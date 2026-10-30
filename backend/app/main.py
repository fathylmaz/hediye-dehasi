"""Gift Expert API. OpenAPI docs at /docs."""
from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .engine import GOAL_NAMES, INTEREST_NAMES, recommend
from .models import Product, RecommendationRequest, RecommendationResponse
from .storage import CatalogStore

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CATALOG = ROOT / 'data' / 'processed' / 'catalog.json'


def create_app(db_path: Path | None = None, catalog_path: Path | None = None) -> FastAPI:
    db_path = Path(db_path or os.getenv('GIFT_DB_PATH', str(ROOT / 'backend' / 'catalog.db')))
    store = CatalogStore(db_path, catalog_path or DEFAULT_CATALOG)

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        store.initialize()
        yield

    app = FastAPI(title='Hediye Dehası Expert API', description='Açıklanabilir, kural tabanlı çocuk hediyesi öneri sistemi', version='3.0.0', lifespan=lifespan)
    origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False,
                       allow_methods=['GET','POST'], allow_headers=['Content-Type'])

    @app.get('/api/health')
    def health():
        return {'status': 'ok', 'service': 'hediye-dehasi-api', 'version': '3.0.0'}

    @app.get('/api/meta')
    def meta():
        return {'product_count': len(store.all()), 'categories': store.categories(),
                'goals': [{'key': k, 'label': v} for k, v in GOAL_NAMES.items()],
                'interests': [{'key': k, 'label': v} for k, v in INTEREST_NAMES.items()]}

    @app.get('/api/products')
    def products(page: int = Query(1, ge=1), page_size: int = Query(12, ge=1, le=48),
                 category: str | None = None, q: str | None = Query(None, max_length=120),
                 age: int | None = Query(None, ge=0, le=17)):
        data = store.all()
        if category:
            data = [p for p in data if p.category.casefold() == category.casefold()]
        if q:
            data = [p for p in data if q.casefold().strip() in p.name.casefold()]
        if age is not None:
            data = [p for p in data if p.age_min <= age <= min(p.age_max,17)]
        start = (page - 1) * page_size
        return {'items': data[start:start+page_size], 'total': len(data), 'page': page, 'page_size': page_size}

    @app.get('/api/products/{product_id}', response_model=Product)
    def product_detail(product_id: str):
        result = store.get(product_id)
        if not result:
            raise HTTPException(404, 'Ürün bulunamadı')
        return result

    @app.post('/api/recommendations', response_model=RecommendationResponse)
    def recommendations(request: RecommendationRequest):
        return recommend(store.all(), request)

    return app


app = create_app()

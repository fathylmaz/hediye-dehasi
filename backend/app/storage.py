"""SQLite catalog persistence with idempotent seeding."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from .models import Product


class CatalogStore:
    def __init__(self, db_path: Path, catalog_path: Path):
        self.db_path = Path(db_path)
        self.catalog_path = Path(catalog_path)

    def initialize(self) -> None:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        catalog = [Product.model_validate(p) for p in json.loads(self.catalog_path.read_text(encoding='utf-8'))]
        with sqlite3.connect(self.db_path) as con:
            con.execute('CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, age_min INTEGER NOT NULL, age_max INTEGER NOT NULL, payload TEXT NOT NULL)')
            con.execute('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)')
            con.execute('CREATE INDEX IF NOT EXISTS idx_products_age ON products(age_min, age_max)')
            for p in catalog:
                con.execute('INSERT OR REPLACE INTO products (id,name,category,age_min,age_max,payload) VALUES (?,?,?,?,?,?)',
                            (p.id, p.name, p.category, p.age_min, p.age_max, p.model_dump_json()))
            # Remove stale records when source catalog was changed.
            ids = [p.id for p in catalog]
            if ids:
                con.execute('DELETE FROM products WHERE id NOT IN (' + ','.join('?' for _ in ids) + ')', ids)
            else:
                con.execute('DELETE FROM products')

    def all(self) -> list[Product]:
        with sqlite3.connect(self.db_path) as con:
            return [Product.model_validate_json(row[0]) for row in con.execute('SELECT payload FROM products ORDER BY name, id')]

    def get(self, product_id: str) -> Product | None:
        with sqlite3.connect(self.db_path) as con:
            row = con.execute('SELECT payload FROM products WHERE id = ?', (product_id,)).fetchone()
            return Product.model_validate_json(row[0]) if row else None

    def categories(self) -> list[dict]:
        with sqlite3.connect(self.db_path) as con:
            rows = con.execute('SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY COUNT(*) DESC, category').fetchall()
        return [{'name': name, 'count': count} for name, count in rows]

# Teknik Mimari

## Sorumluluk ayrımı

- **Web (React/TypeScript):** Yaş, hedef, ilgi alanı ve kısıt toplama; API yanıtını görselleştirme; katalog.
- **HTTP API (FastAPI):** İstek şeması ve tip doğrulaması, ürün listeleme, ürün detayı, öneri endpoint'leri.
- **Çıkarım / karar motoru (`engine.py`):** Önce ileri yönde kural doğrulama / kesin eleme, ardından kanıtlanabilir ağırlıklı puanlama. UI'den bağımsızdır.
- **Katalog deposu (`storage.py`):** JSON'dan SQLite'a idempotent yükleme; sorgular parametreli.
- **Normalizasyon (`tools/normalize_catalog.py`):** Kaynağa dokunmadan standart, tekrar üretilebilir JSON katalog.
- **Dağıtım:** `web` Nginx reverse proxy + `api` Uvicorn/FastAPI + SQLite Docker volume.

## Veri akışı

```text
Kaynak JSON A ─┐
               ├─> normalize_catalog.py ─> data/processed/catalog.json
Kaynak JSON B ─┘                              │
                                             ↓
                                        SQLite catalog
                                             │
Form kullanıcı bilgisi ─> POST /api/recommendations
                                             │
                                 R-AGE (zorunlu)
                                       ↓
                               R-QUIET (isteğe bağlı)
                                       ↓
                               R-TECH (isteğe bağlı)
                                       ↓
                         R-SAFETY-RATING (isteğe bağlı)
                                       ↓
                         Ağırlıklı skor + veri kapsamı
                                       ↓
                                  Gerekçeli sıralama
```

## API uçları

| Metot | Yol | İçerik |
|---|---|---|
| GET | `/api/health` | Servis durumu |
| GET | `/api/meta` | Ürün sayısı, kategori ve seçenekler |
| GET | `/api/products` | `page`, `page_size`, `category`, `q`, `age` ile liste |
| GET | `/api/products/{id}` | Ürün ayrıntıları |
| POST | `/api/recommendations` | İstek bilgilerine göre eleme, sıralama ve gerekçeler |
| GET | `/docs` | OpenAPI Swagger |

## Güvenlik / gizlilik tasarımı

Kullanıcı yanıtları uygulamada kalıcı olarak saklanmaz. Tarayıcı istekleri HTTP üzerinden yerel servise gider; uzak dağıtımda HTTPS/reverse proxy gerekli. Kullanıcı girdileri Pydantic şemasıyla denetlenir. SQLite sorguları parametreli çalışır. CORS yalnızca yerel geliştirme kaynaklarına açıktır. Üçüncü taraf bağlantıları genel ürün arama sayfalarına yönlendirir, doğrulanmış ürün sayfası olduğunu ileri sürmez.

## Teknik borç / sonraki sürüm

React bileşenlerini ayrı modüllere bölmek; erişilebilirlik denetimi (axe), E2E Playwright testleri, oturum tabanlı yönetim/ürün doğrulama süreci, sürümlenmiş veri göçleri ve canlı TLS dağıtımı. Bunlar v1.0 için yapılmış gibi gösterilmez.

# Dağıtım / Deployment

## Yerel Docker Compose

```powershell
docker compose up --build -d
docker compose ps
docker compose logs -f --tail 100
```

- Web: `http://localhost:8080`
- API: `http://localhost:8000`
- `web`, `api` sağlıklı olana dek bekler.
- Kalıcı SQLite dosyası `gift_data` Docker volume içerisinde tutulur.
- Durdur: `docker compose down`. **Tüm veriyi silen** `docker compose down -v` komutunu kullanmayın; sadece test sıfırlamada kullanın.

## Güvenli yayın ortamı için ek gereksinimler

Bu paket localhost prototipidir. Açık internete yayınlamadan önce HTTPS/TLS, domain, çalışma zamanı gizli anahtar yönetimi (ileride eklenirse), rate limiting, görüntü/ürün telif izinleri, koruyucu log politikası, güvenlik taraması, tarayıcı E2E testi ve üretici veri doğrulama süreci gerekir. **Bu işlemler henüz gerçekleştirilmedi**.

Ürün veri tabanındaki güvenlik puanlarının hukuki uygunluk/belge anlamına gelmediğini kullanıcıya açıkça gösterin. Canlı fiyat veya CE/EN 71 veri doğrulaması bulunmadıkça bunu vaat etmeyin.

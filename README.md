# ✳ Hediye Dehası — Açıklanabilir Hediye Seçim Uzman Sistemi

**Hazırlayanlar:** Fatih Yılmaz · Gamze Özateş

**Akademik rapor:** [Uzman Sistem Geliştirme Raporu (PDF)](docs/Hediye_Dehasi_Uzman_Sistem_Gelistirme_Raporu.pdf)

**Hediye Dehası**, üniversite kapsamındaki hediye seçimi problemini açıklanabilir ve kural tabanlı karar destek yaklaşımıyla ele alan bir projedir. React + TypeScript arayüzü, Python / FastAPI uzman sistem servisi ve SQLite ürün kataloğu ile çalışır.

> **Proje durumu (v3.0 — 30 Ekim 2026):** v3 yerel web uygulaması kullanıcı bilgisayarında açıldı; öneri oluşturma, iki sıralama modu, veri yeterliliği ve kural gerekçeleri **manuel olarak başarılı** bildirildi. Bu yayın hazırlık paketinde **29/29 backend testi yeniden çalıştırıldı**. v3 için bağımsız `npm.cmd run build` çıktısı ve GitHub Actions sonuçları henüz belgelenmedi; CI ilk push sonrasında kontrol edilmelidir. Uygulama, doğrulanmış ürün güvenliği sertifikasyon servisi değildir.

## Ürün özellikleri

- Yaş, gelişim hedefi ve ilgi alanıyla **3 adımlı hediye seçimi**
- **Kurallı eleme**: yaş zorunlu; isteğe bağlı sessizlik, düşük teknoloji ve yüksek *kaynak güvenlik puanı* eşikleri
- **Açıklanabilir skor**: 0–100 arasında hesaplanan uyum puanı; her önerinin **ürün detayında ayrı ayrı** ham bileşenler, ağırlıklar, katkı puanları, gerekçeler ve çalışan kural kayıtları
- **Veri kapsamını ayrı değerlendirme**: kaynakta bulunan/eksik kriter alanları açıkça listelenir; %40 veri alanı kapsamı bir güven olasılığı değildir. Varsayılan sıralama önce veri kapsamı kategorisini, sonra uyum puanını kullanır; kullanıcı yalnız puana göre sıralamayı seçebilir.
- **Yanıltmayan görseller**: ürün adına göre temsilî simge ve açık 'Temsili simge' etiketi; doğrulanmış ürün fotoğrafı iddiası yok
- **397 normalize ürün kaydı**, 21 kaynak kategori; kaynak kimlikleri ve veri kalitesi notları
- Arama, kategori filtresi, sayfalama, ürün detayları ve kriter profili
- Responsive Türkçe arayüz, FastAPI OpenAPI dokümantasyonu, SQLite, otomatik testler, Docker Compose

## v3.0 ile gelenler

- Kaynak alan doluluğu ayrı **kanıt kapsamı göstergesi** olarak görünür: kullanılan puan alanı, toplam alan, eksik puanlar ve geniş/kısmi/sınırlı sınıfı.
- İki sıralama modu: **Önce veri kapsamı, sonra skor** (varsayılan) ve eski sıralama ile uyumlu **yalnızca skor**. Her iki modda ham skor değişmez.
- Ürün adlarından türetilen temsili ikonlar; gerçek ürün fotoğrafı olmadığı hem görselde hem erişilebilirlik açıklamasında belirtilir.
- Teknik kuralların anlaşılır Türkçe metinleri doğrudan görüntülenir; kimlikleri geliştirici ayrıntılarında saklanır.
- 7 ek backend testi: **29/29 geçti**. Kullanıcı v3 arayüzünü yerel ortamda açıp dört yeni akışı doğruladı; ayrı frontend build kanıtı ve GitHub Actions doğrulaması bekliyor.

[**v2 → v3 yükseltme rehberi**](V3_GUNCELLEME_REHBERI.md) · [Veri yeterliliği politikası](docs/EVIDENCE_POLICY.md) · [Değişiklik günlüğü](docs/CHANGELOG.md)

## 5 dakikalık başlangıç (Docker)

1. ZIP'i çıkarın ve terminalde `hediye-dehasi` klasörüne geçin.
2. Docker Desktop açıkken çalıştırın:

```powershell
docker compose up --build -d
docker compose ps
```

3. Web sitesi: **http://localhost:8080**
4. API belgeleri: **http://localhost:8000/docs**
5. Kapatmak için: `docker compose down` (veri korunur).

İlk derlemenin internet bağlantısı gerektirdiğini unutmayın. Docker olmadan çalıştırma için [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md) dosyasına bakın.

## Mimari

```text
frontend (React + TS) ── /api ──> backend (FastAPI)
                                     │
                             Uzman sistem motoru
                           ┌─────────┴─────────┐
                    Kural tabanlı eleme     Ağırlıklı skor
                           │                   │
                           └───── SQLite ──────┘
                                     ↑
                            397 normalize kayıt
                                     ↑
                          legacy JSON + extended JSON
```

## Klasörler

```text
hediye-dehasi/
  frontend/                   React + Vite + TypeScript web
    src/App.tsx               UI ve çok adımlı karar akışı
    src/styles.css            Responsive tasarım
    src/api.ts                API istemcisi
  backend/
    app/main.py               HTTP API
    app/engine.py             Kural motoru ve skorlama
    app/models.py             Şema / veri doğrulama
    app/storage.py            SQLite veri katmanı
    tests/                    Otomatik testler
  data/
    raw/                      Kullanıcı projesindeki orijinal iki JSON
    processed/catalog.json    Standardize ürün kataloğu
  tools/normalize_catalog.py Yeniden üretilebilir veri işlemi
  docs/                       Akademik / teknik belgeler
  deploy/nginx.conf           Reverse proxy
  docker-compose.yml          İki servisli kurulum
  .github/workflows/ci.yml    Test / build iş akışı
```

## Veri ve güvenlik şeffaflığı

Katalog puanları eski akademik veri kümesinden gelir. **Gerçek fiyat, stok, CE/EN71 sertifikası, üretici tarafından teyit edilmiş uygunluk, ürün fotoğrafı ve canlı e-ticaret verisi içermez.** Kullanıcıya sunulan “uyum puanı”, olasılık/başarı garantisi değil, hesaplanan bir sıralama skorudur. Satın alma öncesi ürün ambalajı, boğulma riski ve üretici uyarıları bağımsız doğrulanmalıdır.

Farklı yaş aralığıyla kaydedilmiş aynı isimli ürünler ayrı kayıt olarak korunur. Kriter ölçeklerinin yönü net olmayan alanlar filtreye dahil edilmez. Detaylar: [docs/DATA_AUDIT.md](docs/DATA_AUDIT.md), [docs/SCORING_METHOD.md](docs/SCORING_METHOD.md).

## GitHub’da yayımlama

[GitHub yayın rehberi](docs/GITHUB_PUBLISHING.md) · [Yayın öncesi açıklamalar ve sınırlamalar](docs/PUBLICATION_NOTES.md) · [English README](README_EN.md)

Bu depodaki kaynak JSON dosyaları kullanıcının üniversite projesine aittir. Herkese açık yayımlamadan önce veri ve diğer içeriklerin paylaşım hakları sahipleri tarafından teyit edilmelidir. Orijinal mülakat, ekip listesi ve öğrenci numarası içeren belgeler bu pakette **yer almaz**.

## Belgeler

[Windows kurulumu](INSTALL_WINDOWS.md) · [Gereksinimler](docs/REQUIREMENTS.md) · [Mimari](docs/ARCHITECTURE.md) · [Bilgi tabanı](docs/KNOWLEDGE_BASE.md) · [Skorlama](docs/SCORING_METHOD.md) · [Veri sözlüğü](docs/DATA_DICTIONARY.md) · [Veri analizi](docs/DATA_AUDIT.md) · [Test planı](docs/TEST_PLAN.md) · [Akademik proje raporu (PDF)](docs/Hediye_Dehasi_Uzman_Sistem_Gelistirme_Raporu.pdf)

## Test ve doğrulama durumu

| Kontrol | Durum |
|---|---|
| v1: Docker / API / 18 test / TypeScript derlemesi / mobil-manuel kontroller | Windows ortamında başarılı (kullanıcı çıktıları) |
| v2: 22 backend test / TypeScript üretim derlemesi / Docker v2.0.0 | Windows ortamında başarılı (kullanıcı çıktıları) |
| v2: Açıklama ekranı | Kullanıcının ekran görüntüsüyle doğrulandı |
| v3: Backend otomatik testleri | **29/29 başarılı**, paket oluşturma ortamında |
| v3: TS/TSX sözdizimi | Başarılı (TypeScript parser) |
| v3: Yerel site, öneri, iki sıralama modu, veri kapsamı, kural açıklamaları | **Kullanıcı tarafından başarılı bildirildi** |
| v3: Ayrı `npm.cmd run build` çıktısı ve GitHub Actions | **Henüz belgelenmedi / çalıştırılmadı** |

```powershell
# frontend dizininde
npm.cmd install
npm.cmd run build
# backend dizininde
.\.venv\Scripts\python.exe -m pytest -q
```

## Veri yeniden üretimi

```powershell
python tools/normalize_catalog.py
```

İşlem kaynak verileri değiştirmez; `catalog.json` ve `DATA_AUDIT.md` dosyalarını yeniden oluşturur.

---

**English summary (v3):** Hediye Dehası is an explainable, rule-based gift recommendation system reconstructed from a university expert-system project. It includes a React/TypeScript frontend, FastAPI backend, SQLite catalog, deterministic rules and auditable source data. Scores are not probabilities or safety certifications.

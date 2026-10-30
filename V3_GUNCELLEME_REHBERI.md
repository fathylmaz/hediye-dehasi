# Hediye Dehası v3 — Windows Yükseltme ve Doğrulama

v2 projeni **silme veya dosyalarının üzerine yazma**. Bu, ayrı çalıştırılıp doğrulanacak yeni bir kaynak kodu sürümüdür.

## 1) Eski Docker hizmetlerini durdur

VS Code'da eski **v2** `hediye-dehasi` klasörüne git ve çalıştır:

```powershell
docker compose down
```

**`docker compose down -v` kullanma**; `-v` eski veritabanı birimlerini de kaldırabilir.

## 2) v3 paketini ayrı dizine çıkar

`Hediye-Dehasi-Profesyonel-Proje-v3.zip` → örn. `C:\VS CODE PROJE\hediye-dehasi-v3\`. Çıkan `hediye-dehasi` klasörünü VS Code ile aç.

```powershell
cd "C:\VS CODE PROJE\hediye-dehasi-v3\hediye-dehasi"
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8000/api/health
```

API sürümü `3.0.0` görünmeli, `api` healthy ve `web` Up olmalı.

## 3) Testler

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest -q
cd ..\frontend
npm.cmd install
npm.cmd run build
```

Beklenen hedef: **29 backend testi**, TypeScript/Vite derlemesi başarıyla tamamlanmalı. İlk başlatma internet bağlantısı ister.

## 4) Sitede sadece üç kritik gözlem

1. **Hediye seçimi → tercihler:** `Önerilerin sıralaması` kısmında `Önce veri kapsamı...` ve `Yalnızca hesaplanan uyum puanı` seçeneklerini gör.
2. **Aynı kriterlerle iki sıralama:** İlk modda geniş puan alanı olan ürünler önce listelenmeli; diğer modda ham puan yüksek olanlar öne çıkabilir. **Her ürünün 0–100 puanı moddan etkilenmemeli.**
3. **Ürün detayı:** `%40` gibi bir alan kapsamı varsa eksik metrikler açıkça gösterilmeli. Ürün çizimi `Temsili simge` diye etiketlenmeli. `3D Şehir Yapbozu` için 🧩 kullanılmalı.

Tarayıcı yenileme: `Ctrl + Shift + R`; bağlantı: http://localhost:8080.

## Hata durumunda

- `npm.ps1 is disabled` → PowerShell yerine `npm.cmd` yaz.
- `py -3.13` bulunamıyor → `py list` ve gerekiyorsa `py install 3.13`.
- Port 8080 meşgul → önce eski proje dizininde `docker compose down`.
- Docker servisi başlamıyorsa → `docker compose logs --tail 100 api` / `docker compose logs --tail 100 web`.

**Doğrulama dürüstlüğü:** v3 frontend'in tam üretim derlemesi paketin hazırlandığı ortamda paket indirme kısıtı yüzünden çalıştırılamadı. Windows'taki bu adımın çıktısı gelmeden 'v3 tüm testleri geçti' denmeyecek.

# Windows Kurulum Rehberi — Hediye Dehası

Bu dosya ZIP'teki **kaynak kodunu bilgisayarınızda çalıştırmak** içindir. Uygulama tek tıkla açılan bir `.exe` değildir; Docker ile iki servisi başlatır veya Python + Node.js üzerinden geliştirici modunda çalışır.

## v1 veya v2 kuruluysa — verileri koruyarak geçiş

Yeni paketi eski klasörün **üzerine yazmayın**. Eski klasörü yedek olarak tutun.

1. Eski çalışan siteyi durdurun. VS Code'da eski `hediye-dehasi` klasöründe:

```powershell
docker compose down
```

2. v3 ZIP dosyasını farklı bir ana klasöre çıkarın (ör. `C:\VS CODE PROJE\Hediye-v3\`). ZIP içindeki `hediye-dehasi` klasörü yeni projenizdir.
3. Yeni klasörde `BASLAT_WINDOWS.bat` çalıştırın. Eski sürüme ait Docker veri birimleri silinmez. Yeni sürüm ayrı bir veri birimi oluşturabilir.
4. Katalogda 397 kaydı ve ürün detayındaki veri kapsamı ve eksik alan açıklamalarını doğrulayın.

## Seçenek A: Docker ile (önerilen)

**Gereken:** Çalışan Docker Desktop ve internet bağlantısı (ilk paket indirme/derleme için).

1. İndirdiğiniz `Hediye-Dehasi-Profesyonel-Proje-v3.zip` dosyasını Windows'ta **Tümünü Ayıkla** ile örneğin `C:\dev\projects\` içine çıkarın. Oluşan klasör: `C:\dev\projects\hediye-dehasi`.
2. VS Code → **File > Open Folder** → `C:\dev\projects\hediye-dehasi`.
3. VS Code → **Terminal > New Terminal**.
4. Aşağıdaki komutları sırayla girin:

```powershell
cd C:\dev\projects\hediye-dehasi
docker --version
docker compose version
docker compose up --build -d
docker compose ps
```

5. Tarayıcıdan **http://localhost:8080** sayfasını açın.
6. API kontrolü: **http://localhost:8000/api/health** → `status: ok`.
7. Swagger arayüzü: **http://localhost:8000/docs**.

**Durdurma:** `docker compose down`.

**Hataları görmek:** `docker compose logs --tail 100 api` ve `docker compose logs --tail 100 web`.

> Önemli: Docker Desktop'ta engine çalışıyor olmalı. İlk derlemede Python, Node ve NPM paketleri indirileceği için internet gerekir. Yerel 8080 veya 8000 portu doluysa `docker-compose.yml` portlarını değiştirin.

## Seçenek B: Docker olmadan (geliştirme)

Python 3.13+, Node.js 22+ ve npm kurulu olmalı. **İki ayrı terminal** kullanacağız.

**Terminal 1 — Backend:**

```powershell
cd C:\dev\projects\hediye-dehasi\backend
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python -m pytest -q
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

PowerShell etkinleştirme engelinde, venv'yi aktive etmeden `.\.venv\Scripts\python.exe -m pip install ...` ve `.\.venv\Scripts\python.exe -m uvicorn ...` komutlarını da kullanabilirsiniz.

**Terminal 2 — Frontend:**

```powershell
cd C:\dev\projects\hediye-dehasi\frontend
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

Web: **http://localhost:5173**. Vite `/api` çağrılarını otomatik olarak `http://127.0.0.1:8000` adresine aktarır.

## Kurulum sonrası kontrol listesi

1. Ana sayfa açılıyor mu?
2. 'Haydi, hediyeni bul' → yaş → ilgi alanı → tercihler → sonuç geliyor mu?
3. Kesin kısıtlar etkinleştirildiğinde ürün sayısı değişiyor mu?
4. Ürün detayında kriter puanları ve kaynaklar görünüyor mu?
5. Katalog arama, filtre ve sayfalama çalışıyor mu?
6. `/docs` açılıyor ve `/api/health` v3.0.0 dönüyor mu?
7. Ürün detayında **veri kapsamı, eksik puanlar ve çalışan kurallar** görünüyor mu?
8. Varsayılan ve 'yalnızca skor' sıralama modları çalışıyor mu?
9. 3D Şehir Yapbozu için artık temsili **🧩**, teleskop değil, görünüyor mu?

## Sık rastlanan sorunlar

- `Cannot connect to Docker daemon` → Docker Desktop'ı açın ve engine hazır olunca yeniden çalıştırın.
- `Port is already allocated` → Port 8080 veya 8000 doludur; Docker'da farklı host portu belirleyin.
- `npm is not recognized` → Node.js 22+ kurun ve terminali yeniden açın.
- `python not found` → Windows Python kurulumunu ve `py -3.13 --version` komutunu kontrol edin.
- `API bağlantısı kurulamadı` → Backend terminalini / Docker API günlüklerini kontrol edin.
- `npm install` hata verirse → İnternet bağlantısını, npm registry erişimini ve Node sürümünü kontrol edin.

İlk başarılı çalıştırmadan sonra gerçek ekran görüntülerini ve test sonuçlarını belgelere ekleyerek LinkedIn/CV paylaşımı için son kontrol yapacağız.

## Windows ortamında görülebilen iki hata

- `py -3.13`: `No runtime installed that matches 3.13` → `py list` ile sürümleri görün. Gerekirse `py install 3.13` kullanın; ardından `py -3.13 --version` doğrulayın.
- `npm.ps1 cannot be loaded because running scripts is disabled` → PowerShell güvenlik ayarını değiştirmek yerine **`npm.cmd install`**, **`npm.cmd run build`** kullanın.
- `npm warn install-scripts ... esbuild` → Tek başına başarısızlık anlamına gelmez. `npm.cmd run build` sonuçlarını esas alın.

# Hediye Dehası v2 — Güvenli güncelleme ve doğrulama

## Neler değişti?

- Öneri sayfasında 1., 2. veya 3. ürünün ok simgesine tıklayın.
- Detay penceresinde **Bu ürün neden önerildi?** bölümünde o ürünün skorunun bileşenlerini, ağırlıklarını, toplam puana katkılarını ve açıklamalarını görün.
- **Çalışan kural kayıtlarını göster** kısmında karar motorunun kullandığı kural ID'lerini ve anlamlarını inceleyin.
- Katalogdan açılan ürün detayında bu açıklamalar **beklenmez**; çünkü katalog kullanıcının kişisel seçimine bağlı bir puanlama yapmaz.
- Detay penceresi klavyeyle açılıp kapanabilir; `Esc` ile kapanır.

## Windows üzerinde mevcut v1'den güncelleme

1. Eski çalışan projeyi durdurun (eski projenin ana klasöründe):

   ```powershell
   docker compose down
   ```

2. v2 ZIP dosyasını **ayrı bir klasöre** ayıklayın. Eski klasörünüzü silmeyin. Örnek:

   `C:\VS CODE PROJE\Hediye-v2\hediye-dehasi\`

3. VS Code ile **v2 içindeki `hediye-dehasi` klasörünü** açın. Yeni terminalde:

   ```powershell
   docker compose up --build -d
   docker compose ps
   Invoke-RestMethod http://localhost:8000/api/health
   ```

4. Tarayıcıdan `http://localhost:8080` adresini açın. Hediye seçimini tamamlayıp ilk **iki farklı öneriye** tıklayın: skor bileşenleri farklı olabiliyor mu? `Esc` pencereden çıkıyor mu?

5. İsterseniz yerel Python testlerini yeniden doğrulayın:

   ```powershell
   cd backend
   .\.venv\Scripts\python.exe -m pytest -q
   ```

   Yeni klasörde `.venv` henüz yoksa:

   ```powershell
   py -3.13 -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
   .\.venv\Scripts\python.exe -m pytest -q
   ```

   Beklenen: **22 passed**.

6. Frontend üretim derlemesini doğrulayın:

   ```powershell
   cd ..\frontend
   npm.cmd install
   npm.cmd run build
   ```

   `npm.cmd` kullanımı, PowerShell'deki `npm.ps1` engeline takılmamak içindir.

## Notlar

- Eski klasörünüzde `docker compose down -v` kullanmayın; `-v` veri birimini kaldırabilir.
- v1'in Windows'ta çalıştığı doğrulandı. **v2 frontend derlemesi bu ZIP'in oluşturulduğu ortamda doğrulanamadı** (npm bağımlılık indirme kısıtı), bu nedenle ilk kullanımda yukarıdaki derleme doğrulamasını gerçekleştirin.
- Puanlar öznel kaynak verisine dayanır, gerçek yaş güvenliği/sertifika veya fiyat kontrolü değildir.

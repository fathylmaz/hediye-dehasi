# Hediye Dehası — GitHub Yayınlama Rehberi (Windows / PowerShell)

Bu yönergeler proje kodunu **kişisel GitHub hesabındaki yeni bir depoya** yüklemek içindir. Mevcut uygulamanın internette bir sunucuda yayımlandığı anlamına gelmez. GitHub, bu projede **kaynak kodu ve belgeler** için kullanılacaktır; FastAPI + React uygulaması GitHub Pages üzerinde doğrudan çalışmaz.

## Ortak proje katkısı

Proje belgelerinde **Fatih Yılmaz ve Gamze Özateş** hazırlayan olarak listelenmiştir. Fatih’in kişisel GitHub hesabında açılan depoda **Settings → Collaborators → Add people** yoluyla Gamze kendi GitHub hesabıyla katkıda bulunabilir. Kişisel depoda tek hesap sahibi olur; iş birliği yetkisi ortak hesap sahipliği demek değildir. Her geliştirici kendi hesabıyla commit ve katkılarını oluşturabilir.

## 1. Önce paylaşım haklarını kontrol edin

- `data/raw` ve `data/processed` eski üniversite çalışmasındaki verilerden türetilmiştir. İçeriğin herkese açık paylaşımı için hak sahiplerinden gerekli izinlerin sizde olduğundan emin olun.
- Başkalarına ait kaynak kodu, marka görseli, ücretli görsel, mülakat kaydı, katılımcı bilgisi, öğrenci numarası veya kullanıcı verisi depoya eklemeyin.
- Bu paket **orijinal Word, Excel ve PowerPoint belgelerini içermez**; bunları doğrudan depoya sürüklemeyin.
- Açık lisans seçimi yapılmadı. Lisans eklemek isterseniz kaynak verilerin yeniden dağıtımı bakımından uygun izinleri kontrol edin; lisans seçmeden de GitHub deposu oluşturabilirsiniz.

## 2. GitHub'da boş depo açın

1. GitHub hesabınıza girin → **New repository**.
2. **Repository name**: `hediye-dehasi`.
3. **Description**: `Açıklanabilir, kural tabanlı hediye öneri sistemi | React, TypeScript, FastAPI, SQLite, Docker`.
4. **Visibility**: Haklar kontrol edilene kadar `Private` önerilir; izinler teyit edildiğinde `Public` seçebilirsiniz.
5. **Add a README / .gitignore / license** seçeneklerini **işaretlemeyin**; projede zaten README ve `.gitignore` var.
6. **Create repository** ile oluşturun.

## 3. VS Code'da proje kökünden Git kullanın

VS Code içinde **`hediye-dehasi` kök klasörünü** açın; terminal `README.md`, `docker-compose.yml`, `frontend`, `backend` dosyalarını içeren konumda olmalıdır. Ardından:

```powershell
Get-Location
git --version
git init -b main
git status --short
git add .
git diff --cached --check
git diff --cached --stat
git commit -m "feat: publish Hediye Dehasi v3 expert system"
```

> `git status --short` içinde `.venv/`, `node_modules/`, `dist/`, `catalog.db` veya `.env` gibi kişisel/üretilmiş dosyalar bulunmamalıdır. Varsa **commit atmadan önce** durun ve `.gitignore` kontrolü yapın. `git diff --cached --check` boş çıktı veriyorsa boşluk hatası bulunmadı demektir. `git commit` isim ve e-posta kimliği isterse, GitHub'da kullanmak istediğiniz imza bilgilerini `git config --global user.name ...` ve `git config --global user.email ...` ile ayarlayın. E-postanızı gizlemek için GitHub noreply adresini kullanabilirsiniz.

## 4. GitHub remote adresini ekleyin ve push yapın

Yeni depoda GitHub'ın sunduğu **HTTPS URL'sini kopyalayın**. Aşağıdaki örnekteki `GITHUB-KULLANICI-ADIN` bölümünü kendi kullanıcı adınızla değiştirin:

```powershell
git remote add origin https://github.com/GITHUB-KULLANICI-ADIN/hediye-dehasi.git
git push -u origin main
```

Eğer `origin` zaten varsa tekrar eklemeyin; `git remote -v` ile kontrol edin. İlk push için tarayıcı üzerinden Git Credential Manager oturum açma penceresi gelebilir. **Şifre/token'ı sohbete veya ekran görüntüsüne yazmayın.**

## 5. Yayın sonrası kontroller

- Depo ana sayfasında README düzgün görüntüleniyor mu?
- `Actions` sekmesindeki **backend** ve **frontend** kontrolleri yeşil mi? İlk push sonrası sonuçları bekleyin. Hata varsa logların kişisel bilgi içermeyen kısmını inceleyin.
- GitHub `About` bölümüne kısa açıklama ve şu konuları ekleyebilirsiniz: `expert-system`, `rule-based`, `explainable-ai`, `recommendation-system`, `fastapi`, `react`, `typescript`, `docker`.
- Henüz barındırılmayan site için canlı demo URL'si uydurmayın. Yerel demo ekran görüntüleri ve kısa kullanım videosu ekleyin.
- Üniversitedeki **orijinal proje** ile 2026'daki **yeniden mühendislik** çalışmasını ayrı tarihlerle ve açık ifadelerle belirtin.

## İleri aşama: Gerçek sunucuya dağıtım

Docker Compose örneği yalnızca yerel geliştirme içindir ve portlar `127.0.0.1` adresine bağlanmıştır. Herkese açık web sitesi için HTTPS, güvenlik taraması, erişim politikaları, kaynak verilerin dağıtım hakları ve üretim yapılandırması ayrıca ele alınmalıdır. Bu çalışma tamamlanmadan projeyi çevrimiçi dağıtıldı diye tanıtmayın.

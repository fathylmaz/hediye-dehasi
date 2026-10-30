# Contributing / Katkıda Bulunma

Hediye Dehası, Fatih Yılmaz ve Gamze Özateş tarafından GitHub üzerinde sürdürülen akademik temelli bir uzman sistem projesidir. Geliştirmeler mevcut belgelenmiş uzman sistemi mantığını ve veri şeffaflığını korumalıdır.

## Development workflow / Geliştirme akışı

1. Açık bir konu veya hata için Issue oluşturun; hassas bilgileri paylaşmayın.
2. `main` dalı üzerinden `feature/<kisa-aciklama>` veya `fix/<kisa-aciklama>` dalı açın.
3. Küçük ve açıklayıcı commit'ler yapın, yeni davranışları testlerle destekleyin.
4. Pull Request açıp yapılan değişikliği, test sonuçlarını ve gerekiyorsa ekran görüntülerini ekleyin.
5. Diğer geliştiricinin gözden geçirmesinden sonra `main` ile birleştirin.

## Local checks / Yerel kontroller

Backend:
```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest -q
```

Frontend:
```powershell
cd frontend
npm.cmd install
npm.cmd run build
```

GitHub Actions ayrıca backend testleri ve frontend üretim derlemesini çalıştırır.

## Accuracy and data / Doğruluk ve veri

- Öneri puanlarını doğrulanmış başarı olasılığı veya ürün güvenliği sertifikası olarak tanıtmayın.
- Yeni ürün kayıtları için kaynak ve eksik kriter alanlarını açıkça belirtin.
- Üçüncü taraf telif haklarını ve katılımcı gizliliğini gözetin; özel dosyaları, şifreleri ve API anahtarlarını commit etmeyin.
- Akademik çalışmayı ve daha sonra eklenen yazılım özelliklerini tarihsel olarak doğru atfedin.

Bu proje [MIT Lisansı](LICENSE) altında dağıtılır.

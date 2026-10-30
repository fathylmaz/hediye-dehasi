# v3 Yayın / GitHub / LinkedIn Hazırlık Kontrolü

- [x] Orijinal iki veri kaynağı değiştirilmeden korundu, 397 normalize kayıt tekrar kullanıldı.
- [x] Kesin eleme ve hesaplanan ham skor değişmeden korundu.
- [x] Alan doluluk göstergesi, eksik alan listesi ve iki sıralama modu uygulandı.
- [x] Temsili ürün simgeleri gerçek ürün fotoğrafı sanılmayacak şekilde etiketlendi.
- [x] 29 backend otomatik test başarılı.
- [x] v3 frontend TS/TSX dosyalarının sözdizimi kontrol edildi.
- [x] v2 kullanıcı Windows ortamında 22 test, tam build, Docker ve öneri modalını doğruladı.
- [ ] v3 Windows ortamında `npm.cmd run build` hatasız geçti.
- [x] v3 yerel site açıldı (kullanıcı bildirimi); yeni UI akışları manuel kontrol edildi.
- [ ] v3 Docker `compose ps`, API `health` ve ekran görüntüleri ayrı olarak belgelenip depoya eklendi.
- [x] v3 öneri sistemi, iki sıralama modu, veri yeterliliği ve uzman kural açıklamaları manuel kontrol edildi.
- [ ] v3 temsilî ürün simgeleri için ürün bazlı görsel kayıt oluşturuldu.
- [x] GitHub Actions backend testleri ve frontend derlemesi en son yüklemeden sonra başarılı (30 Ekim 2026; Actions run #2).
- [ ] Kritik erişilebilirlik ve güvenlik kontrolleri yapıldı.
- [x] Yayın paketinde öğrenci numarası/e-posta/telefon/anahtar biçiminde içerik için metin taraması yapıldı; örnek eşleşme bulunmadı.
- [x] Kaynak verilerinin ve akademik materyallerin paylaşım hakları proje sahibi tarafından teyit edildi (30 Ekim 2026).
- [x] Akademik rapor ve proje sunumu GitHub deposunda; PDF belgeleri yayımlandı.
- [x] MIT `LICENSE`, `CITATION.cff` ve ortak katkı yönergeleri eklendi.
- [ ] Depo GitHub ayarlarından `Public` yapıldı ve anonim erişim kontrol edildi.

**İddia sınırı:** v3 backend testleri ve dört manuel akış kontrolü başarılıdır, ancak Yayın hakları, erişilebilirlik ve bağımsız doğrulama için üstteki açık maddeler gereklidir. Eski üniversite çalışması ile bu sürümdeki 2026 yeniden mühendislik çalışması ayrı tanımlanmalıdır.

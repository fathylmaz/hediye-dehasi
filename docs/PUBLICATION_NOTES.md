# Yayın Notları — Hediye Dehası v3.0

## Tamamlanan kontroller

- 397 katalog kaydı; iki kaynak JSON ve türetilmiş katalog için SHA-256 eşleşmesi doğrulandı.
- 29/29 backend otomatik testi bu yayın hazırlık ortamında yeniden geçti.
- Yerel v3 site açıldı (kullanıcı doğrulaması).
- v3 öneri oluşturma, iki sıralama modu, veri yeterliliği ve kural açıklamaları kullanıcı kontrolünde başarılı bildirildi.
- Metin dosyalarında yaygın e-posta/telefon/öğrenci numarası ve açık API anahtarı kalıpları için tarama yapıldı; eşleşme bulunmadı. Bu tarama kişisel bilgi bulunmadığını kesin olarak garanti etmez.

## Açık kontroller

- v3 için ayrı bir Windows `npm.cmd run build` çıktısı rapora eklenmemiştir. Ancak GitHub Actions `Quality checks` iş akışının ikinci çalışması 30 Ekim 2026 tarihinde **başarılı** tamamlanmıştır (backend testleri ve frontend üretim derlemesi). Bu durum uçtan uca tarayıcı testlerinin yapıldığı anlamına gelmez.
- Kaynak veri, akademik materyal ve kodun herkese açık paylaşımında hak sorunu bulunmadığı proje sahibi tarafından teyit edildi; bu teyit bağımsız hukuk denetimi değildir.
- Otomatik tarayıcı E2E, erişilebilirlik denetimi ve canlı internete açılmaya yönelik güvenlik kontrolleri tamamlanmadı.
- Orijinal uzman görüşmeleri, anket metodolojisi ve ürün kriterlerinin bağımsız uzman doğrulaması henüz yeniden değerlendirilmedi.
- Çocuklar için yaş uygunluğu ve güvenlik puanları üretici sertifikası yerine geçmez.

## Ürün sınırlamaları

Uyum skorları hesaplanan **sıralama puanlarıdır**, olasılık veya güvenlik garantisi değildir. Veri kapsamı yüzdesi yalnızca hesaplamada gereken kaynak puan alanlarının doluluğunu gösterir. Ürün görselleri temsili çizimdir; doğrulanmış ürün fotoğrafı, fiyat, stok veya ürün sertifika kaydı yoktur.

## Akademik atıf ve proje sahipliği

Bu depo, üniversitede geliştirilen **Hediye Seçim Uzman Sistemi** fikrinin **2026'da yeniden yazılmış mühendislik sürümüdür**. Orijinal proje tarihleri ve varsa ekip katkıları uygun biçimde atfedilmeli; sonradan eklenen React/FastAPI, testler, Docker, açıklanabilir puanlama ve veri kapsamı özellikleri orijinal teslimin parçasıymış gibi anlatılmamalıdır.

## Açık kaynak lisansı

Projede [MIT Lisansı](../LICENSE) uygulanır. `CITATION.cff` akademik atıf bilgilerini, `CONTRIBUTING.md` ortak katkı iş akışını açıklar. Üçüncü kişilere ait markalar ve ürün isimleri kendi hak sahiplerine aittir.

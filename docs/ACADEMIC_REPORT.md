# Hediye Dehası: Açıklanabilir Hediye Seçim Uzman Sistemi

**Akademik/teknik rapor çalışma taslağı — yeniden geliştirme sürümü, 2026**

> Bu belge üniversiteye teslim edilmiş orijinal raporun birebir kopyası değildir. Orijinal çalışmanın fikrine dayanarak yapılan sonradan mühendislik geliştirmelerini açıkça ayırır. Test ve saha doğrulaması yapılmamış sonuçlar başarı olarak raporlanmamalıdır. Ad, ders, tarih ve ekip bilgileri kamuya açık sürüme eklenmeden önce doğrulanmalıdır.

## Özet

Günlük hayatta çocuklara hediye seçerken yaş aralığı, gelişim hedefleri, ilgi alanları, aile tercihleri ve ürün özellikleri birlikte değerlendirilir. Hediye Dehası bu çok ölçütlü problemi açıklanabilir, kural tabanlı karar destek yaklaşımıyla ele alır. Üniversite çalışmasından gelen iki ayrı ürün veri tabanı normalize edilerek tek katalogda toplanmış; yaş ve tercihlere göre kesin eleme, ilgi/gelişim kriterlerine göre puanlama ve sonuçlara gerekçe ekleme işlevleri oluşturulmuştur. 400 kaynak satırından, aynı isim ve yaş aralığında mükerrer olan üç kayıt birleştirilerek 397 kayıt elde edilmiştir. Sistem Python/FastAPI API'si ve React/TypeScript arayüzü üzerinden yapılandırılmıştır. v3 backend kurallarının ve API davranışının 29 otomatik testi paket hazırlama ortamında başarıyla çalışmıştır; v3 yerel web uygulaması kullanıcı bilgisayarında açılmış ve dört yeni akış (öneri, sıralama, veri yeterliliği, kural açıklamaları) manuel olarak başarılı bildirilmiştir; ayrı frontend üretim derlemesi ve CI logları henüz kayıt altına alınmamıştır. Ürün güvenliği, fiyatı ve ticari uygunluğu için bağımsız doğrulama yapılmadığından sistem yalnızca akademik amaçlı karar destek prototipidir.

**Anahtar kelimeler:** uzman sistemler, kural tabanlı çıkarım, karar destek, açıklanabilir öneriler, çok kriterli değerlendirme, veri normalizasyonu.

## 1. Problem tanımı

Hediye satın alma kararı kişisel ihtiyaçlarla şekillenir. Yalnızca ürün popülerliğine veya tek bir genel puana bakmak, yaş ve tercih kısıtlarını göz ardı edebilir. Amaç her ürüne genel bir başarı iddiası üretmek değil, kullanıcının kriterlerine göre ürünleri izlenebilir şekilde sıralamaktır.

## 2. Eski çalışmadan yeni sürüme geçiş

Orijinal projede HTML/CSS/JavaScript tabanlı bir site, iki JSON ürün dosyası, Excel veri tabloları, mülakat/kriter dokümanları ve akademik sunum bulunuyordu. Eski kodda yaş kategorisi sabit eşleşiyordu, bazı engelleyici tercihler yüksek negatif ceza ile ifade ediliyor ve ilk üç öneriye %98, %92, %85 gibi sabit yüzdeler atanıyordu. Yeniden tasarlanan sürümde yaş gerçek yıl aralığıyla ele alınır; veto koşulları kesin filtre olarak çalışır; skor bileşenlerinden hesaplanır ve eksik veri varsayılmaz.

## 3. Veri ve normalizasyon

Kaynak JSON kayıt sayıları 200 + 200'dür. Aynı normalize isim ve tam yaş aralığı anahtarıyla üç mükerrer satır tekilleştirilmiştir; 397 kayıt elde edilmiştir. Kayıtlar kaynak ID'sini korur. Genişletilmiş veri ile ilk veri kümesi aynı puanı farklı bildirdiğinde durum kalitenin notu olarak kaydedilmiştir. Farklı yaş aralığına sahip benzer isimler birleştirilmemiştir. Bu yaklaşım veri kaybını azaltır, ancak ürünlerin fiziksel olarak tekil olduğunu doğrulamaz.

## 4. Yöntem: kural ve çıkarım motoru

Kullanıcı yaşı zorunlu bir eleme koşuludur. Gürültü, teknoloji yoğunluğu ve kaynak güvenlik puanı için isteğe bağlı eşikler sağlanmıştır. Ürün bu koşullardan herhangi birini sağlayamıyorsa, skor hesaplamaya geçilmez. Uygun ürünlerin gelişim uyumu, kategori eşleşmesi ve eğitsel/pratik puanları ağırlıklandırılarak sıralama skoru oluşturulur. v3 ile kaynaktaki puan alanlarının doluluk oranı, eksik alan adları ve veri yeterlilik sınıfı skordan ayrı gösterilir. Varsayılan sıralama önce alan kapsam kategorisini sonra ham uyum puanını dikkate alır; yalnızca ham puana göre sıralama da kullanıcıya sunulur. Bu eşikler istatistiksel olarak doğrulanmış güvenilirlik ölçüsü değildir. Kural kimlikleri, anlaşılır karar açıklamaları ve kaynak bilgi notları kullanıcıya sunulur. Detaylı denklem için `SCORING_METHOD.md` incelenmelidir.

## 5. Sistem mimarisi ve teknolojiler

Frontend React, TypeScript ve Vite; backend FastAPI ve Pydantic; kalıcı veri SQLite; dağıtım Docker Compose/Nginx ile tasarlanmıştır. Normalizasyon betiği Python standart kütüphanesini kullanır. Otomatik testlerde pytest ve FastAPI TestClient kullanılmıştır. SQLite parametreli sorgulara dayanır ve API kullanıcı taleplerini kalıcı olarak kaydetmez.

## 6. Değerlendirme

Backend test sonuçları: **29 başarılı / 29 test** (v3 paket oluşturma ortamı). Bu testler kural, API, iki sıralama modu ve veri kapsamı hesaplamalarını doğrular. Kullanıcının Windows ortamında v2 Docker, 22 test, frontend üretim derlemesi ve skor açıklaması görsel olarak doğrulanmıştır; **v3 yeni ekranların dört akışı kullanıcı bilgisayarında kontrol edilmiştir; v3 için bağımsız tam üretim derlemesi ve CI çıktısı henüz kayıt altına alınmamıştır**. Önerilerin çocuk gelişimi üzerindeki etkisi, anketle kullanıcı memnuniyeti, gerçek güvenlik geçerliliği veya e-ticaret başarısı hakkında çıkarım yapmaya yeterli değildir. v3 için erişilebilirlik ve dağıtım doğrulamaları yerel kurulum sonrasına bırakılmıştır.

## 7. Etik ve sınırlılıklar

Öneri skoru istatistiksel bir olasılık değildir. Veri kümesindeki “güvenlik” kaydı ticari belge değildir. Yaş etiketleri üretici tarafından yeniden teyit edilmelidir. Yanlış güven oluşturabilecek ürün fotoğrafları, doğrulanmış fiyat ve sertifika bilgisi uydurulmamıştır. Uzman görüşmesi ve sunum dosyalarındaki kişisel kimlik bilgileri bu dağıtılabilir pakete eklenmemiştir.

## 8. Gelecek çalışmalar

Gerçek üretici katalog verileri, ürün sertifika doğrulama iş akışı, kaynağı belgelenmiş fiyat/veri güncelliği, uzmanlar arası tutarlılık incelemesi, kör kullanıcı değerlendirmesi, ölçüt ağırlığı duyarlılık analizi, açıklama kalitesi anketi ve otomatik uçtan uca testler eklenebilir.

## Kaynakça için doğrulanacak alanlar

Orijinal mülakat/sunum kaynaklarının tarih ve alıntı bilgileri kontrol edilmeli; kaynakça yalnızca doğrulanabilen yayınları/kişileri içermelidir. Henüz harici literatür taraması yapıldığı iddia edilmemektedir.

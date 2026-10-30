# Orijinal Proje Denetimi / Before–After

## Girdiler (orijinal kullanıcı arşivi)

- HTML/CSS/JavaScript statik web sitesi: `index.html`, `style.css`, `script.js`.
- İki ürün veri kümesi: `products.json` (200 kayıt), `products1.json` (200 kayıt).
- Excel çalışma dosyaları ve ürün üretim dosyaları.
- Python `converter.py` dönüşüm aracı.
- Kriter/anket soruları, uzman mülakatı, üniversite sunumu.

## Tespitler

1. **Sabit eşleşme yüzdeleri:** Mevcut arayüz ilk üç öneriye %98, %92, %85 atıyor; skorları hesaplamıyordu.
2. **Kesin eleme eksikliği:** “Veto” için -6000 puan cezası kullanılıyordu; kuralı ihlal eden ürünün her koşulda eleneceği garanti değildi.
3. **Yaş kategorisi:** Kaynak yaş metni ile tam eşitlik kontrolü yapılıyordu; örn. 8 yaş ve 7–12 yaş aralığı arasındaki semantik ilişki modellenmemişti.
4. **Çatallanan veri şemaları:** İlk küme 13 alan, genişletilmiş küme 21 alan kullanıyor. İki veri kümesinde ortak isimler, hatta aynı yaşın olduğu tekrarlı kayıtlar bulunuyor.
5. **Kriter kaynakları:** Bazı ağırlık/anket ifadelerinin yöntem ve ölçek tutarlılığı kontrol gerektiriyordu. Ölçek yönü belirsiz alanlardan ticari vaat çıkarılamaz.
6. **Test edilebilirlik:** Ayrı karar motoru ve otomatik test dosyaları arşivde yoktu; sunumda test sözlü olarak anlatılmıştı.
7. **Ticari doğrulama:** Yaş, ürün güvenlik sertifikası, stok ve güncel fiyat kayıtları doğrulanabilir canlı kaynaklara bağlanmamıştı.

## Yapılan tasarım değişiklikleri

| Eski yaklaşım | Yeni yaklaşım |
|---|---|
| Statik HTML + tarayıcıdaki tek JS | React/TS istemci + bağımsız FastAPI servis |
| Sabit %98/92/85 | Formülden hesaplanan 0–100 uyum puanı |
| -6000 puan “veto” | Gerçek IF–THEN kesin eleme |
| Doğrudan JSON'dan tarayıcıya | Kaynakları koruyan normalize JSON + SQLite |
| Yaş kategorisi metin eşitliği | Sayısal yaş aralığı doğrulaması |
| Kaynak belirsiz | Her ürün için dataset ve kaynak ID |
| Yeniden oynatılamayan test anlatısı | `pytest` ile doğrulanan 18 API/engine testi |
| “güvenlik” gibi yorumlanabilen puan | Öznel kaynak puanı uyarıları ve eksik veri politikası |

## Kamuya açık paket politikası

Orijinal sunum/mülakat dosyaları kişisel kimlik bilgileri barındırdığından bu paket onları içermez. Yalnızca ürün verisi JSON'ları (kullanıcının sağladığı veri) ve yeni oluşturulmuş kaynak kod/belgeler yer alır. Harici lisans veya kaynak sahipliği denetimi yayın öncesi yapılmalıdır.

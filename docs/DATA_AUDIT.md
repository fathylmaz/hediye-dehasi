# Veri analizi / Data audit

Kaynaklar: `data/raw/products_legacy.json` (ilk veri kümesi), `data/raw/products_extended.json` (genişletilmiş veri kümesi). Veri kayıtları üniversite projesinden alınmıştır.

| Ölçüm | Değer |
|---|---:|
| original_legacy | 200 |
| original_extended | 200 |
| output_unique_name_age | 397 |
| merged_duplicate_records | 3 |
| conflicting_merged_records | 2 |
| source_range_over_17 | 1 |
| source_range_over_10_years | 3 |

## Dönüşüm kuralları

- Birleştirme anahtarı: normalize edilmiş **ürün adı + tam yaş aralığı**. Aynı isim fakat farklı yaş aralığı tek ürün kabul **edilmez**.
- Çakışan sayısal kriterlerde genişletilmiş veri kümesi önceliklidir, diğer kaynakta olup eksik olanlar korunur. Çakışmalar ürünün `quality_notes` alanında belirtilir.
- Yaş aralıkları kaynak metninden okunur, doğrulanmış yaş güvenliği anlamına gelmez.
- Sıfır/eksik puan **tahmin edilmez**; kriter yoksa hiç eklenmez.
- `budget_proxy`, `material_proxy`, `battery_proxy` alanlarının yönü/saha doğrulaması belirsiz olduğundan fiyat, malzeme sertifikası veya pil gereksinimi olarak yorumlanmaz.
- Güvenlik puanı uzman veri setinde yer alan **öznel puandır**. Gerçek oyuncak güvenliği, standart uygunluğu veya sertifika kanıtı değildir.
- Fiyat, satıcı, fotoğraf, stok ve sertifika bilgisi kaynak dosyalarda bulunmaz. Uydurulmamıştır.
- `source_range_over_17` ve `source_range_over_10_years` kayıtları manüel doğrulama gerektirir.

## Kategoriler

- Bilim: 81
- Sanat: 57
- Spor: 52
- Doğa: 45
- Müzik: 36
- Sosyal: 22
- Mantık: 18
- Beceri: 14
- Bilişsel: 11
- Fiziksel: 10
- Bebek: 8
- Dil: 8
- Yaratıcı: 7
- Duyusal: 7
- Teknoloji: 6
- STEM: 6
- Hobi: 4
- Eğlence: 2
- İnşa: 1
- Genel: 1
- Dekor: 1

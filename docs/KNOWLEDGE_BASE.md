# Bilgi Tabanı ve Çıkarım Kuralları

## Kaynaklar

Üniversite projesindeki eski ve genişletilmiş ürün JSON'ları ile mülakat/anket yoluyla oluşturulmuş kriter yaklaşımı temel alınmıştır. Yeniden geliştirilen sürüm, **öznel kaynak puanları ile doğrulanmış ticari ürün özelliklerini ayırır**. Bu pakete bireylerin adlarını içeren ham mülakat/sunum dosyaları eklenmemiştir.

## IF–THEN kuralları

- **R-AGE:** Eğer çocuğun tam yaşı ürünün kaynak yaş aralığının dışında ise ürün elenir. Ayrıca 17 yaş üstü kullanıcı girişi kabul edilmez.
- **R-QUIET:** Eğer `quiet_only=true` ise sessizlik kaynak puanı **en az 7** olmalıdır. Eksik puan eleme sebebidir.
- **R-TECH:** Eğer `avoid_technology=true` ise teknoloji yoğunluğu kaynak puanı **en fazla 3** olmalıdır. Eksik puan eleme sebebidir.
- **R-SAFETY-RATING:** Eğer `high_safety_score_only=true` ise öznel güvenlik kaynak puanı **en az 8** olmalıdır. Sertifikasyon teyidi olarak yorumlanmaz. Eksik puan eleme sebebidir.
- **R-INTEREST-MATCH:** Uygun ürünün kategorisi, seçilen ilgi alanı gruplarından birine aitse ilgi alanı eşleşmesi verilir.
- **R-SCORE-WEIGHTED:** Kesin kısıtları geçen uygun kayıtlar, mevcut kriterlere göre sıralanır.

Kural tetiklenmesi yalnızca bir sayı düşürmek yerine ürünü gerçekten eler. Bu, eski sistemin “-6000 puan” yaklaşımından farklıdır.

## Kriter yönü

- `quietness`: yüksek değer daha sessiz kabul edilir (eski proje veto mantığı ile uyumlu).
- `technology`: yüksek değer daha teknoloji yoğun kabul edilir (eski proje veto mantığı ile uyumlu).
- `safety`: yüksek kaynak puanı göreli daha iyi olarak alınır, **resmî güvenlik değerlendirmesi değildir**.
- `cognitive`, `physical`, `social`, `emotional`: yüksek kaynak puanı gelişim katkısı açısından daha iyi kabul edilir.

Kaynaklar `budget_proxy`, `material_proxy`, `battery_proxy`, `difficulty`, `parent_involvement` puanlarının yönünü/ölçeğini yeterli güvenilirlikle açıklamadığından bu alanlar sıralamada veya veto kuralında kullanılmaz. Kullanıcı detay sayfasında kaynak değeri olarak görülebilir.

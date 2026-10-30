# Veri Sözlüğü

Her ürünün `id`, `name`, `category`, `age_min`, `age_max`, `metrics`, `sources`, `quality_notes` alanları bulunur.

- `id` (`HD-0001` vb.): Normalizasyonda oluşturulan kararlı sıra ID'si; ürünün evrensel ürün numarası **değildir**.
- `age_min`, `age_max`: Kaynakta yazan yaş aralığı, yıl cinsinden; üretici tarafından teyit edilmiş güvenlik sınıfı değildir.
- `sources`: Kaynak veri kümesi (`legacy` / `extended`) ve kaynak satır ID'si.
- `quality_notes`: Çelişkili puan, geniş yaş aralığı gibi şeffaflık uyarıları.
- `metrics`: Var olan sayısal kriter puanları. Eksik metrik **bulunmaz** (uydurma 0/5 yok).

| Kaynak başlığı | Yeni anahtar | Açıklama |
|---|---|---|
| Bilişsel | cognitive | Bilişsel gelişim puanı |
| Fiziksel | physical | Fiziksel gelişim puanı |
| Sosyal | social | Sosyal gelişim puanı |
| Duygusal | emotional | Duygusal gelişim puanı |
| Güvenlik | safety | Doğrulanmamış kaynak güvenlik puanı |
| Ses | quietness | Yüksek puan sessizlik yönünde (kaynak kod yorumu) |
| Teknoloji | technology | Yüksek puan teknoloji yoğunluğu yönünde |
| Öğretici | educational | Öğreticilik puanı |
| Ömür | durability | Kullanım ömrü kaynak puanı |
| Açık Uçlu | open_ended | Açık uçlu oyun puanı |
| Bütçe | budget_proxy | Belirsiz maliyet erişilebilirlik puanı, **gerçek fiyat değil** |
| Malzeme | material_proxy | Malzeme kaynak puanı; doğal malzeme garantisi değil |
| Pil | battery_proxy | Pil kaynak puanı; gerçek pil ihtiyacı bilgisi değil |
| Mevsim | season | Mevsim uygunluğu kaynak puanı |
| Zorluk | difficulty | Zorluk kaynak puanı |
| Ebeveyn | parent_involvement | Ebeveyn katılımı kaynak puanı |
| Alan | space | Alan gereksinimi kaynak puanı |
| Sürdür. | sustainability | Sürdürülebilirlik kaynak puanı |
| Dil | language | Dil kaynak puanı |

**Kritik sınırlama:** Bu puanlar akademik ürün derlemesinden aktarılmıştır; harici piyasa veya güvenlik incelemesiyle doğrulanmamıştır. Bazı ürün kategorilerinin orijinal kaynaklarda tutarsız eşleştirildiği tespit edilmiştir. Kategorileri küresel bir taksonomi gibi kullanmayın.

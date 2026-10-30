# Veri Yeterliliği ve Karar Şeffaflığı — v3

## Amaç

0–100 **uyum skoru**, eldeki gelişim/ilgi/kriter puanlarına göre sıralamadır. Skor, güven, sertifika, ürünün güvenliği, eğitim etkisi, gerçek satın alma başarısı veya istatistiksel olasılık **değildir**. Eksik kaynak puanları uydurulmaz; skor hesaplamasında yalnızca mevcut kriterler kullanılır.

## Alan kapsamı

Kapsam, kullanıcının seçtiği gelişim hedefleri (hiç hedef seçilmediyse dört gelişim alanı) ile dört eğitsel/pratik kaynak kriterinin (`safety`, `educational`, `durability`, `open_ended`) **kaçında veri olduğu** göstergesidir.

```text
Alan kapsamı = 100 × mevcut alan sayısı / beklenen alan sayısı
```

İlgi alanı eşleşmesi ürün kategorisinden belirlendiği için doluluk hesabına girmez. Ön-eleme kısıtlarında kullanılan `quietness` ve `technology` gibi puanlar da bu göstergede sayılmaz; bunlar kendi kurallarında ayrı değerlendirilir. Dolayısıyla %100 kapsam, ürünün tüm özellikleri hakkında eksiksiz veya doğrulanmış veri olduğu anlamına **gelmez**.

**Örnek:** `cognitive` hedefi seçilince 1 gelişim + 4 kaynak kriteri = 5 alan gerekir. Üründe yalnız `cognitive` ve `educational` kayıtlıysa kapsam 2/5 = **%40**. Buna rağmen 87,5 gibi bir skor çıkabilir; çünkü hesaplama mevcut bileşenlerin ağırlıklarını yeniden normalleştirir. Bu, 87,5 güven derecesi anlamına gelmez.

## Düzeyler (tasarım tercihi)

| Alan kapsamı | Ekran etiketi | API değeri |
|---|---|---|
| %80–100 | Geniş alan kapsamı | `full` |
| %50–79,9 | Kısmi alan kapsamı | `partial` |
| %0–49,9 | Sınırlı alan kapsamı | `limited` |

Bu eşikler **ürün geliştirme tasarım tercihidir**, bilimsel olarak doğrulanmış güvenilirlik eşiği değildir. Bu ayrım kaynak puanlarının doğru olduğunu kanıtlamaz; sadece alan doluluğunu gösterir.

## İki sıralama politikası

- `evidence_then_score` (varsayılan): önce kapsam düzeyi (geniş > kısmi > sınırlı), sonra 0–100 ham uyum skoru, ardından alan kapsamı, ad ve kalıcı ürün kimliği.
- `score_only`: v2 ile aynı sıralama: ham skor, ardından alan kapsamı, ad, kimlik.

**Her iki modda ham skor ve zorunlu eleme kuralları aynıdır.** Uyum ve veri kapsamı tek bir yapay toplam skorda birleştirilmez. Bu tasarım, sınırlı veriden kaynaklanan yüksek puanlı ürünlerin varsayılan listede gereksiz öne çıkmasını azaltır.

## Arayüzde açıklık ve kaynaklar

- Kartta alan kapsamı ve puan gösterilir; modalda mevcut/beklenen alan sayıları ve eksik kriter adları görünür.
- Kural kodları `R-...` olarak geliştirici bölümünde korunur; kullanıcıya Türkçe kural açıklaması sunulur.
- Katalog görselleri çizim/simge niteliğindedir. Gerçek marka/model fotoğrafı gibi sunulmaz.
- Kaynak ürünlerin yaş ve öznel güvenlik puanları sertifika yerine geçmez; ürün etiketleri, yaş uyarıları, malzeme ve boğulma riskleri dışarıda doğrulanmalıdır.

## Gelecekte doğrulama gereksinimleri

Gelişim ve güvenlik puanlarının uzman kuruluyla bağımsız doğrulanması, gerçek ürün model kimlikleri, sürümlü veri kayıtları, kullanıcı değerlendirmeleri ve sıralama algısının kullanılabilirlik testi ileride yapılacak çalışmalardır; tamamlandığı iddia edilmemektedir.

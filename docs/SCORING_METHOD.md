# Puanlama ve Açıklanabilirlik Metodu

## A. Önce kesin eleme

Sırasıyla yaş; sessizlik, teknoloji ve kaynak güvenlik puanı kullanıcı tarafından seçildiyse ilgili eşikler uygulanır. Bir koşul ihlalinde puan hesaplanmaz.

## B. Kriter bileşenleri

Her bileşen 0–10 aralığındadır:

1. `development`: Seçilen gelişim alanlarında **mevcut** kaynak puanlarının ortalaması. Alan seçilmemişse dört gelişim alanı üzerinden mevcut olanların ortalaması alınır.
2. `interest`: Ürünün kategorisinin seçilen ilgi alanı gruplarıyla eşleşen oranı × 10. İlgi alanı seçilmemişse bu bileşen kullanılmaz.
3. `quality`: Mevcut `safety`, `educational`, `durability`, `open_ended` puanlarının ortalaması. Bu kaynak puanları ölçülmüş kalite ya da ticari sertifika değildir.

## C. Ağırlıklar

- En az bir gelişim alanı seçilmişse: gelişim **55**, ilgi **25**, kalite **20** ağırlık birimi.
- Gelişim alanı seçilmemişse: varsayılan gelişim **65**, ilgi **25**, kalite **35** birimi. *(Bu ayrı 65/25/35 sayıları yüzdelik değildir; aktif bileşenler arasında yeniden normalize edilir.)*
- İlgi seçilmemişse, ilgi bileşeni atlanır. Herhangi bir bileşen için ölçüm yoksa o bileşen atlanır.
- Etkin ağırlıklar toplamına göre yeniden normalize edilir; eksik alanlar için 5 gibi yapay puan atanmaz.

Formül:

```text
Score (0–100) = 10 × Σ(component_value × component_weight) / Σ(active_component_weight)
```

**Örnek:** Gelişim 8, ilgi eşleşmesi 10, kalite 7 ise; ağırlıklar sırasıyla 55,25,20 olduğunda: `10 × (8×55 + 10×25 + 7×20) / 100 = 83.0`.

## D. Veri kapsamı

`coverage = 100 × (eldeki gelişim puanı adedi + eldeki 4 kalite puanı adedi) / (seçilmiş/varsayılan gelişim kriteri sayısı + 4)`.

Bu oran, **sadece puanlamada başvurulan kaynak alanlarının doluluğunu** gösterir; tahminin doğruluk veya güven olasılığı değildir. İlgi alanı kategori üzerinden değerlendirildiği için bu kapsama dahil edilmez. Her öneriye mevcut/beklenen alan sayısı ve eksik alan adları eklenir. Kapsamı yüksek ürünün kaynak puanlarının doğruluğu yine doğrulanmış değildir.

## E. Kararlı sıralama — v3

**Varsayılan** `evidence_then_score`: önce puan alanı kapsam sınıfı (geniş, kısmi, sınırlı), sonra azalan uyum puanı, azalan alan kapsamı, alfabetik ad ve ID.

**İsteğe bağlı** `score_only`: v2 ile aynı politika; önce azalan ham uyum puanı, sonra azalan alan kapsamı, ad ve ID. Mod değiştirmek puanı veya eleme sonuçlarını değiştirmez.

Birincil kapsama göre sıralama, eksik veriyi sanki tam veriymiş gibi en üst sıraya çıkarmamak için tercih edilmiştir. Seçilen %80/%50 eşikleri ampirik olarak kalibre edilmemiş tasarım tercihleridir. Ayrıntı: [EVIDENCE_POLICY.md](EVIDENCE_POLICY.md).

## F. Bilimsel sınırlılık

Bu ağırlıklar **ürün yönetimi tercihi** olarak belirlenmiştir, istatistiksel olarak optimize edilmiş, uzmanlar tarafından doğrulanmış veya etki araştırmasıyla kanıtlanmış katsayılar değildir. Kullanıcı testi / uzman değerlendirmesi tamamlanmadan böyle bir iddiada bulunulmamalıdır.

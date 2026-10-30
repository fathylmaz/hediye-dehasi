# Fonksiyonel Gereksinimler / Functional Requirements

**Kapsam:** Ürün satın alma değil, açıklanabilir ve kaynak temelli öneri prototipi.

| ID | Gereksinim | Kabul ölçütü |
|---|---|---|
| FR-01 | 0–17 arasında tam yaş seçimi | API dış aralığı 422 ile reddeder |
| FR-02 | Bilişsel, fiziksel, sosyal, duygusal hedefler | Çoklu seçim desteklenir |
| FR-03 | 9 ilgi alanı tercihi | Kategori üzerinden eşleşme hesaplanır |
| FR-04 | Sessizlik ve düşük teknoloji koşulları | İhlal eden / eksik puanlı kayıtlar elenir |
| FR-05 | Yüksek *kaynak güvenlik puanı* filtresi | Min. 8/10; sertifika olarak etiketlenmez |
| FR-06 | Sıralanmış öneri listesi | Deterministik 0–100 skor; açıklama bileşenleri |
| FR-07 | Katalog, sayfalama, arama ve kategori filtresi | API + UI üzerinden kullanılabilir |
| FR-08 | Ürün ayrıntıları | Yaş, kaynak, metrik, kalite notları |
| FR-09 | Veri aktarımı | Kaynak JSON'lar değiştirilmeden dönüşüm tekrar çalışır |
| FR-10 | Boş sonuç ve hata durumları | Açıklayıcı kullanıcı mesajı |
| FR-11 | Eksik kaynak puanı açıklaması | Her öneride gözlenen/toplam alanlar, eksik alan adları ve kapsam sınıfı |
| FR-12 | Kullanıcının iki sıralama modu arasında seçim yapması | Önce kapsam veya yalnızca skor; ham skor ve kesin kısıtlar değişmez |
| FR-13 | Ürün simgelerinin temsili olduğunun belirtilmesi | Simgeler gerçek ürün fotoğrafı olarak sunulmaz |

## Fonksiyonel olmayan gereksinimler

- NFR-01: Kurallar ve skorlar deterministik, otomatik test edilebilir.
- NFR-02: API Pydantic ile giriş doğrular, SQLite sorgularında parametre kullanır.
- NFR-03: Responsive tasarım ve temel klavye erişilebilirliği.
- NFR-04: İki servis için tekrarlanabilir Docker Compose çalıştırması.
- NFR-05: Kaynak veri ve varsayımlar şeffaf belgelenir.

## Bu sürümün kapsamı dışında

- Gerçek zamanlı stok / fiyat / güvenlik sertifikası doğrulama.
- Kullanıcı hesabı, kişisel verinin saklanması, takip ve reklam.
- Makine öğrenimi veya üretken yapay zekâ tahmini.
- Bağımsız tıbbi/çocuk gelişimi değerlendirmesi, ticari güvenlik garantisi.

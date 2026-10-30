# Değişiklik günlüğü

## 3.0.0 — 30 Ekim 2026 — Kaynak veri yeterliliği yükseltmesi

### Yeni / düzeltildi
- Ham uyum puanından ayrı **kanıt alanı kapsamı** bilgisi: mevcut ve eksik puan alanları, alan sayıları, % kapsam ve üç düzey.
- **Varsayılan kapsam öncelikli sıralama** ve v2'ye uyumlu isteğe bağlı **yalnızca skora göre sıralama**.
- Ürün adını da dikkate alan, **gerçek ürün fotoğrafı gibi sunulmayan temsili simgeler**; 3D Şehir Yapbozu simgesi düzeltildi.
- Öneri modalında doğrudan okunabilen Türkçe kural açıklamaları ve ayrı teknik kural kodları.
- 7 yeni backend testi (toplam 29 test), API şemalarında `evidence`, `ranking_mode` alanları.
- [Veri yeterliliği politikası](EVIDENCE_POLICY.md), ayrı Windows yükseltme rehberi, güncellenmiş dokümanlar.

### Değişmeyenler
- Kaynak veri setleri, 397 ürünlük normalize katalog ve ürün puanlama formülü değişmedi.
- Yaş/sessizlik/teknoloji/öznel güvenlik puanı kesin eleme kuralları değişmedi.
- Gerçek ürün fotoğrafı veya fiyat/sertifika doğrulaması eklenmedi.

### Doğrulama durumu
- Backend: 29/29 otomatik test başarılı.
- Frontend TS/TSX dosyaları sözdizimi kontrolü başarılı; **v3 tarayıcı üzerindeki dört kullanıcı akışı 30 Ekim 2026'da başarılı bildirildi**. Ayrı frontend `npm.cmd run build` çıktısı ve GitHub Actions sonuçları henüz depoda belgelenmedi.

# Değişiklik günlüğü

## 2.0.0 — 30 Ekim 2026 — Açıklanabilirlik yükseltmesi

### Yeni
- Öneri kartından ürün detayına geçildiğinde **o ürüne ait** 0–100 puan, ham bileşen puanları, normalize edilmiş ağırlıklar, katkı puanları ve kapsam gösterilir.
- Önerilen ürünün çalıştırdığı kural kodları, anlaşılır Türkçe açıklamaları ile açılır listede görünür.
- Modal klavye odak yönetimi: açılışta odak, Tab döngüsü, Escape, kapanınca odak iadesi.
- Hesaplamaların doğruluğunu ve kısıtların tutarlılığını ölçen dört yeni otomatik test (22/22).

### Korunanlar
- Orijinal kaynak JSON dosyaları ve 397 kayıtlık normalize katalog değiştirilmedi.
- Kural motorunun seçme ve sıralama formülü değiştirilmedi.
- Katalogdan açılan detayda kişisel skorlama gösterilmez.

### Sınırlamalar / doğrulama
- Bu paketin hazırlandığı ortamda **v2 frontend derlemesi gerçekleştirilemedi**; paket bağımlılıklarının indirilmesi başarısız oldu. Kullanıcının Windows ortamında `npm.cmd run build` ve `docker compose up --build -d` ile doğrulama yapılmalı.
- v1'in başarılı kullanıcı testleri, v2'nin aynı sürüm olduğu anlamına gelmez. Özellikle yeni açıklama bölümü manuel test edilmelidir.
- Ürün puanlarının gerçek güvenlik sertifikası olmadığı unutulmamalıdır.

## 1.0.0 — 29 Ekim 2026
- Akademik hediye seçim uzman sisteminin baştan tasarlanmış React/TypeScript + FastAPI + SQLite sürümü.
- 397 kaynak kayıt, gerçek eleme kuralları, açıklanabilir puanlama, ürün kataloğu, Docker.
- Kullanıcının Windows sisteminde 18/18 backend testi, üretim derlemesi, Docker ve temel arayüz kontrolleri tamamlandı.

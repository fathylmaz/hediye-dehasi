# Test Planı — v3

## A. Otomatik testler

**29/29 backend testi başarılı** (paket oluşturma ortamında). Bu testler yaş ve kesin kısıtlar, ürün sıralaması, veri eksikliği, hesaplama bileşenleri, deterministic sonuç, API doğrulaması, yeni kanıt kapsamı ve iki sıralama modunu kapsar.

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest -q
```

`httpx` / `starlette` uyarısı, önceki testlerde de görülen uyumluluk uyarısıdır; bir testin başarısız olduğuna işaret etmez. Bağımlılık versiyonları kalıcı olarak kilitlenmeden bunu çözülmüş saymayın.

## B. v3 Frontend ve Docker — Windows'ta doğrulanacak

```powershell
# repo kök dizini
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8000/api/health
# ayrı terminal, frontend klasörü
npm.cmd install
npm.cmd run build
```

Paket ortamında v3 TSX/TS dosyaları parse edildi; tam TypeScript typecheck + Vite build **doğrulanmadı**. Windows çıktısı gereklidir.

## C. Son 6 manuel kabul testi

- [ ] v3 web ana sayfası ve mobil sihirbazı açılıyor.
- [ ] `3D Şehir Yapbozu` ürününde teleskop yerine 🧩 ve `Temsili simge` yazısı görünüyor.
- [ ] Öneri detayında veri alanı kapsamı (ör. 2/5 = %40) ve eksik puan alanları listeleniyor.
- [ ] `Önce veri kapsamı` sıralamasında daha iyi kapsama düzeyindeki ürünler önde; `Yalnızca skor` moduna geçince fark olabilir.
- [ ] İki sıralama modunda aynı ürünün puanı değişmiyor, filtre sayıları sabit kalıyor.
- [ ] Kullanıcı dostu karar gerekçeleri ve teknik kural kayıtları görünüyor; model güvenlik sertifikası iddiası yok.

## D. Yayın öncesi kalan işlemler

- Erişilebilirlik manuel inceleme (klavye, ekran okuyucu ve kontrast) tamamlanmalı.
- CI'nin GitHub ortamında backend + frontend geçtiği görülmeli.
- Ürün veri lisansı/kullanım hakkı ve üçüncü kişilerin kişisel bilgilerinin ayıklanması doğrulanmalı.
- Sıralama katsayıları ve kaynak puanlar uzmanların bağımsız onayından geçmeden bilimsel doğrulama iddiası kullanılmamalı.

## Son kullanıcı geri bildirimi (30 Ekim 2026)

Hediye Dehası v3 yerel ortamda açıldı. Kullanıcı tarafından öneri sistemini çalıştırma, iki sıralama modunu deneme, veri yeterliliğini inceleme ve karar gerekçelerini görüntüleme kontrollerinin dörtte dördü başarılı bildirildi. Bu geri bildirim otomatik uçtan uca tarayıcı testinin yerine geçmez. CI üzerinde frontend build ve backend testleri ayrıca doğrulanacaktır.

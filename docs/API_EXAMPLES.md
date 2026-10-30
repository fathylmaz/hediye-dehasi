# API Örnekleri

Swagger (canlı istek): `http://localhost:8000/docs`

## Sağlık

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

## Öneri

```powershell
$payload = @{
  age = 8
  goals = @('cognitive')
  interests = @('science')
  preferences = @{
    quiet_only = $true
    avoid_technology = $false
    high_safety_score_only = $false
  }
  max_results = 5
  ranking_mode = 'evidence_then_score' # alternatif: score_only
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/recommendations -Body $payload -ContentType 'application/json; charset=utf-8'
```

## Ürün ve arama

```powershell
Invoke-RestMethod 'http://localhost:8000/api/products?page=1&page_size=12'
Invoke-RestMethod 'http://localhost:8000/api/products?q=Arduino'
Invoke-RestMethod 'http://localhost:8000/api/meta'
```

**Dönen yanıt:** `ranking_mode` kullanılan sıralama yöntemidir; `recommendations[].score` hesaplanan 0–100 ham değerdir; `coverage` kaynak puan alanı doluluk oranı; `evidence` gözlenen/toplam alan sayısı, eksik alanlar ve kapsam sınıfı; `score_components` bileşen katkıları; `reasons` gerekçeler; `fired_rules` tetiklenen kurallar; `excluded_by_rule` her kuralın (öncelik sırasına göre) elediği ürün sayısıdır. `coverage` bir güven/sertifika olasılığı değildir.

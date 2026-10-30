"""Normalize the user's two historical JSON datasets into an auditable catalog.

No product facts are invented. Identical name + age entries are merged, extended
ratings take priority when conflicts occur. Other matches remain separate.
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data' / 'raw'
OUTPUT = ROOT / 'data' / 'processed' / 'catalog.json'
REPORT = ROOT / 'docs' / 'DATA_AUDIT.md'

METRIC_KEYS = {
    'Bilişsel': 'cognitive', 'Fiziksel': 'physical', 'Sosyal': 'social',
    'Duygusal': 'emotional', 'Mevsim': 'season', 'Açık Uçlu': 'open_ended',
    'Güvenlik': 'safety', 'Teknoloji': 'technology', 'Bütçe': 'budget_proxy',
    'Öğretici': 'educational', 'Ses': 'quietness', 'Ömür': 'durability',
    'Zorluk': 'difficulty', 'Ebeveyn': 'parent_involvement',
    'Alan': 'space', 'Pil': 'battery_proxy', 'Sürdür.': 'sustainability',
    'Dil': 'language', 'Malzeme': 'material_proxy'
}


def name_key(s: str) -> str:
    s = unicodedata.normalize('NFKC', str(s)).casefold().strip()
    return re.sub(r'\s+', ' ', s)


def normalize(row: dict, source: str) -> dict:
    name = str(row.get('Ürün Adı', '')).strip()
    category = str(row.get('Kategori', '')).strip()
    age_text = str(row.get('Yaş', '')).strip()
    m = re.fullmatch(r'(\d{1,2})\s*[-–]\s*(\d{1,2})', age_text)
    if not name or not category or not m:
        raise ValueError(f'Invalid record in {source}: name={name!r}, category={category!r}, age={age_text!r}')
    age_min, age_max = map(int, m.groups())
    if age_min > age_max:
        raise ValueError(f'Reversed age range in {name}: {age_text}')
    metrics = {}
    for old, new in METRIC_KEYS.items():
        raw = row.get(old)
        if raw is None or str(raw).strip() == '':
            continue
        value = float(str(raw).replace(',', '.'))
        if value != int(value) or not 0 <= value <= 10:
            raise ValueError(f'Out-of-range {old}={raw!r} in {name}')
        metrics[new] = int(value)
    notes = []
    if age_max > 17:
        notes.append('Kaynak yaş aralığı çocuk odaklı 0–17 kapsamını aşıyor; üretici tarafından doğrulanmadı.')
    if age_max - age_min > 10:
        notes.append('Kaynak yaş aralığı çok geniş; üretici yaş etiketi ayrıca kontrol edilmeli.')
    return {
        'name': name, 'category': category, 'age_min': age_min,
        'age_max': age_max, 'metrics': metrics,
        'sources': [{'dataset': source, 'source_id': str(row.get('ID', ''))}],
        'quality_notes': notes,
    }


def build() -> tuple[list[dict], dict]:
    legacy = json.loads((RAW / 'products_legacy.json').read_text(encoding='utf-8'))
    extended = json.loads((RAW / 'products_extended.json').read_text(encoding='utf-8'))
    indexed: dict[tuple[str, int, int], dict] = {}
    collisions: list[dict] = []
    for label, rows in (('legacy', legacy), ('extended', extended)):
        for row in rows:
            product = normalize(row, label)
            key = (name_key(product['name']), product['age_min'], product['age_max'])
            if key in indexed:
                old = indexed[key]
                different = [k for k, v in product['metrics'].items() if k in old['metrics'] and old['metrics'][k] != v]
                if different:
                    collisions.append({'name': product['name'], 'metrics': different})
                    old['quality_notes'].append('Çakışan kaynak kriter puanları var: ' + ', '.join(different) + '. Genişletilmiş kaynak tercih edildi.')
                if label == 'extended':
                    old['metrics'].update(product['metrics'])
                    old['category'] = product['category']
                else:
                    for k, v in product['metrics'].items():
                        old['metrics'].setdefault(k, v)
                old['sources'].extend(product['sources'])
                old['quality_notes'] = list(dict.fromkeys(old['quality_notes'] + product['quality_notes']))
            else:
                indexed[key] = product
    catalog = sorted(indexed.values(), key=lambda p: (name_key(p['name']), p['age_min'], p['age_max']))
    for n, product in enumerate(catalog, start=1):
        product['id'] = f'HD-{n:04d}'
    counts = dict(Counter(p['category'] for p in catalog).most_common())
    audit = {'original_legacy': len(legacy), 'original_extended': len(extended),
             'output_unique_name_age': len(catalog), 'merged_duplicate_records': len(legacy)+len(extended)-len(catalog),
             'conflicting_merged_records': len(collisions), 'categories': counts,
             'source_range_over_17': sum(p['age_max'] > 17 for p in catalog),
             'source_range_over_10_years': sum(p['age_max'] - p['age_min'] > 10 for p in catalog)}
    return catalog, audit


def main() -> None:
    catalog, audit = build()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    REPORT.write_text('''# Veri analizi / Data audit

Kaynaklar: `data/raw/products_legacy.json` (ilk veri kümesi), `data/raw/products_extended.json` (genişletilmiş veri kümesi). Veri kayıtları üniversite projesinden alınmıştır.

| Ölçüm | Değer |
|---|---:|
''' + ''.join(f'| {key} | {value} |\n' for key, value in audit.items() if key != 'categories') + '''
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

''' + '\n'.join(f'- {k}: {v}' for k, v in audit['categories'].items()) + '\n', encoding='utf-8')
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'Import failed: {exc}', file=sys.stderr)
        sys.exit(1)

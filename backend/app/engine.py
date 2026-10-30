"""Deterministic, explainable forward-rule evaluation and weighted ranking.

Source ratings are subjective 0–10 and are never represented as product
certification, age-safety guarantees or actual purchase prices.
"""
from __future__ import annotations

from collections import Counter

from .models import (
    Product, RecommendationRequest, RecommendationResponse, RankedProduct,
    ScoreComponent, EvidenceSummary,
)

GOAL_NAMES = {'cognitive': 'Bilişsel gelişim', 'physical': 'Fiziksel gelişim',
              'social': 'Sosyal gelişim', 'emotional': 'Duygusal gelişim'}
INTEREST_CATEGORIES = {
    'science': {'Bilim', 'STEM', 'Teknoloji'},
    'art': {'Sanat', 'Yaratıcı', 'Beceri', 'İnşa', 'Hobi', 'Dekor'},
    'sports': {'Spor', 'Fiziksel'}, 'music': {'Müzik'},
    'nature': {'Doğa'}, 'logic': {'Mantık', 'Bilişsel'},
    'social': {'Sosyal', 'Eğlence', 'Genel'},
    'language': {'Dil'}, 'sensory': {'Duyusal', 'Bebek'},
}
INTEREST_NAMES = {
    'science': 'Bilim ve teknoloji', 'art': 'Sanat ve yaratıcılık',
    'sports': 'Spor ve hareket', 'music': 'Müzik', 'nature': 'Doğa ve keşif',
    'logic': 'Mantık ve oyun', 'social': 'Sosyal oyun',
    'language': 'Dil ve anlatım', 'sensory': 'Duyusal keşif',
}


def _eligible(product: Product, req: RecommendationRequest) -> tuple[bool, str | None]:
    """Ordered hard rules; absent evidence never passes an enabled constraint."""
    if not product.age_min <= req.age <= min(product.age_max, 17):
        return False, 'R-AGE'
    m = product.metrics
    if req.preferences.quiet_only and (m.get('quietness') is None or m['quietness'] < 7):
        return False, 'R-QUIET'
    if req.preferences.avoid_technology and (m.get('technology') is None or m['technology'] > 3):
        return False, 'R-TECH'
    if req.preferences.high_safety_score_only and (m.get('safety') is None or m['safety'] < 8):
        return False, 'R-SAFETY-RATING'
    return True, None


def _weighted_score(p: Product, req: RecommendationRequest) -> RankedProduct:
    m = p.metrics
    selected_goals = req.goals or list(GOAL_NAMES)
    available = [m[g] for g in selected_goals if g in m]
    goal_value = sum(available)/len(available) if available else None
    matched_interests = [x for x in req.interests if p.category in INTEREST_CATEGORIES[x]]
    interest_value = 10.0 * len(matched_interests) / len(req.interests) if req.interests else None
    quality_keys = ('safety', 'educational', 'durability', 'open_ended')
    quality_values = [m[k] for k in quality_keys if k in m]
    quality_value = sum(quality_values)/len(quality_values) if quality_values else None

    # Redistribute weights over only available components. No fabricated values.
    candidates = [('goals', 'Gelişim uyumu', 55 if req.goals else 65, goal_value,
                   f'{len(available)}/{len(selected_goals)} gelişim kriteri mevcut'),
                  ('interests', 'İlgi alanı uyumu', 25, interest_value,
                   f'{len(matched_interests)}/{len(req.interests)} ilgi alanı eşleşti'),
                  ('quality', 'Eğitsel / pratik veri puanı', 20 if req.goals else 35, quality_value,
                   f'{len(quality_values)}/{len(quality_keys)} kaynak kriteri mevcut')]
    used = [(k,t,w,v,d) for k,t,w,v,d in candidates if v is not None]
    denominator = sum(w for _,_,w,_,_ in used)
    components = [ScoreComponent(key=k, title=t, weight=round(100*w/denominator),
                                 value=round(v, 1), contribution=round(10*v*w/denominator, 1), details=d)
                  for k,t,w,v,d in used]
    score = round(sum(10*v*w/denominator for _,_,w,v,_ in used), 1) if denominator else 0.0
    # Coverage is a separate data-completeness indicator, never confidence/probability.
    expected_keys = list(dict.fromkeys([*selected_goals, *quality_keys]))
    available_keys = [key for key in expected_keys if key in m]
    missing_keys = [key for key in expected_keys if key not in m]
    observed_count = len(available_keys)
    expected_count = len(expected_keys)
    coverage = round(100 * observed_count / expected_count, 1)
    # Evidence quality is defined solely by field completeness (NOT validity,
    # accuracy, confidence, certification or a predicted success probability).
    evidence_level = 'full' if coverage >= 80 else 'partial' if coverage >= 50 else 'limited'
    evidence = EvidenceSummary(observed=observed_count, expected=expected_count,
                               level=evidence_level, available_metrics=available_keys,
                               missing_metrics=missing_keys)
    reasons: list[str] = []
    for goal in selected_goals:
        if goal in m and m[goal] >= 8:
            reasons.append(f'{GOAL_NAMES[goal]} puanı {m[goal]}/10')
    if matched_interests:
        reasons.append('İlgi alanı eşleşmesi: ' + ', '.join(INTEREST_NAMES[x] for x in matched_interests))
    if req.preferences.quiet_only:
        reasons.append(f'Sessizlik kriterini geçti ({m["quietness"]}/10)')
    if req.preferences.avoid_technology:
        reasons.append(f'Düşük teknoloji kullanımı puanı ({m["technology"]}/10)')
    if req.preferences.high_safety_score_only:
        reasons.append(f'Veri kümesindeki güvenlik puanı eşiğini geçti ({m["safety"]}/10)')
    if not reasons:
        reasons.append('Mevcut gelişim ve eğitsel kriterler üzerinden sıralandı')
    fired = ['R-AGE-PASS', 'R-SCORE-WEIGHTED']
    if matched_interests:
        fired.append('R-INTEREST-MATCH')
    if req.preferences.quiet_only:
        fired.append('R-QUIET-PASS')
    if req.preferences.avoid_technology:
        fired.append('R-TECH-PASS')
    if req.preferences.high_safety_score_only:
        fired.append('R-SAFETY-RATING-PASS')
    return RankedProduct(product=p, score=score, coverage=coverage, evidence=evidence,
                         reasons=reasons[:5], score_components=components, fired_rules=fired)


def recommend(products: list[Product], req: RecommendationRequest) -> RecommendationResponse:
    excluded: Counter[str] = Counter()
    selected = []
    age_eligible = 0
    for product in products:
        if product.age_min <= req.age <= min(product.age_max, 17):
            age_eligible += 1
        passed, rule = _eligible(product, req)
        if not passed:
            assert rule is not None
            excluded[rule] += 1
            continue
        selected.append(_weighted_score(product, req))
    if req.ranking_mode == 'evidence_then_score':
        priority = {'full': 2, 'partial': 1, 'limited': 0}
        selected.sort(key=lambda r: (-priority[r.evidence.level], -r.score, -r.coverage,
                                     r.product.name.casefold(), r.product.id))
    else:
        selected.sort(key=lambda r: (-r.score, -r.coverage, r.product.name.casefold(), r.product.id))
    warnings = [
        'Kaynak yaş aralığı ve öznel güvenlik puanı üretici güvenlik sertifikası değildir. Satın almadan önce yaş etiketi ve ürün uyarılarını kontrol edin.',
        'Uyum puanı hesaplanan bir sıralama skorudur; satın alma başarısı veya güvenlik olasılığı değildir.',
    ]
    if not selected:
        warnings.insert(0, 'Bu kriterlere uyan kayıt bulunamadı. İsteğe bağlı kısıtları azaltabilirsiniz.')
    elif any(r.coverage < 100 for r in selected[:req.max_results]):
        warnings.append('Bazı ürünlerin puanlama alanları eksik. % veri kapsamı doğruluk veya güvenlik olasılığı değildir.')
    if req.ranking_mode == 'evidence_then_score':
        warnings.append('Sıralama önce kaynak puan alanlarının doluluk düzeyine, sonra uyum puanına göredir. İsterseniz yalnızca puana göre sıralayabilirsiniz.')
    if any(r.evidence.level == 'limited' for r in selected[:req.max_results]):
        warnings.append('Sınırlı veriyle yüksek bir puan hesaplanabilir; satın alma kararı için bu puanı tek başına kullanmayın.')
    return RecommendationResponse(total_products=len(products), age_eligible=age_eligible,
                                  filtered_eligible=len(selected), excluded_by_rule=dict(excluded),
                                  recommendations=selected[:req.max_results],
                                  ranking_mode=req.ranking_mode, warnings=warnings)

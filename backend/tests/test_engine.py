from app.engine import recommend
from app.models import Product, RecommendationRequest


def prod(pid='X', age=(3, 7), **metrics):
    return Product(id=pid, name=pid, category='Bilim', age_min=age[0], age_max=age[1],
                   metrics=metrics, sources=[{'dataset':'test','source_id':'1'}])


def test_age_is_a_real_gate():
    data = [prod('young', age=(0,2), safety=10), prod('ok', age=(3,7), safety=8)]
    res = recommend(data, RecommendationRequest(age=5))
    assert res.filtered_eligible == 1
    assert res.recommendations[0].product.id == 'ok'
    assert res.excluded_by_rule['R-AGE'] == 1


def test_noise_veto_cannot_be_overridden_by_high_score():
    a = prod('loud', quietness=3, cognitive=10, safety=10)
    b = prod('quiet', quietness=8, cognitive=6, safety=6)
    res = recommend([a,b], RecommendationRequest(age=5, preferences={'quiet_only':True}, goals=['cognitive']))
    assert [r.product.id for r in res.recommendations] == ['quiet']
    assert res.excluded_by_rule['R-QUIET'] == 1


def test_unknown_noise_cannot_pass_a_veto():
    res = recommend([prod('unknown', cognitive=10)], RecommendationRequest(age=5, preferences={'quiet_only':True}))
    assert not res.recommendations


def test_technology_veto():
    data = [prod('digital', technology=9, cognitive=10), prod('analogue', technology=2, cognitive=6)]
    res = recommend(data, RecommendationRequest(age=6, preferences={'avoid_technology':True}))
    assert [r.product.id for r in res.recommendations] == ['analogue']


def test_subjective_safety_rating_gate():
    data = [prod('low', safety=7), prod('high', safety=8)]
    res = recommend(data, RecommendationRequest(age=4, preferences={'high_safety_score_only':True}))
    assert [r.product.id for r in res.recommendations] == ['high']


def test_missing_rating_not_imputed():
    result = recommend([prod('p', cognitive=8)], RecommendationRequest(age=5, goals=['cognitive','emotional']))
    item = result.recommendations[0]
    assert item.coverage < 100
    assert '1/2' in item.score_components[0].details


def test_score_is_calculated_and_sorted():
    a = prod('low', cognitive=2, safety=2, educational=2)
    b = prod('high', cognitive=10, safety=10, educational=10)
    res = recommend([a,b], RecommendationRequest(age=5, goals=['cognitive']))
    assert res.recommendations[0].product.id == 'high'
    assert res.recommendations[0].score > res.recommendations[1].score
    assert res.recommendations[0].score == 100


def test_interest_match_changes_ranking():
    a = prod('A', cognitive=7, safety=7)
    b = prod('B', cognitive=7, safety=7).model_copy(update={'category': 'Müzik'})
    res = recommend([a,b], RecommendationRequest(age=4, interests=['music']))
    assert res.recommendations[0].product.id == 'B'
    assert 'R-INTEREST-MATCH' in res.recommendations[0].fired_rules


def test_empty_results_are_explained():
    res = recommend([prod('too old', age=(9,12))], RecommendationRequest(age=1))
    assert res.filtered_eligible == 0
    assert res.warnings[0].startswith('Bu kriterlere uyan')


def test_results_respect_limit():
    data = [prod(str(i), cognitive=8) for i in range(6)]
    res = recommend(data, RecommendationRequest(age=4, max_results=2))
    assert len(res.recommendations) == 2
    assert res.filtered_eligible == 6


def test_component_explanations_reconstruct_score():
    """Public explanations must trace the displayed deterministic score."""
    p = prod('explain', cognitive=9, social=7, safety=10, educational=8,
             durability=6, open_ended=9)
    req = RecommendationRequest(age=5, goals=['cognitive', 'social'], interests=['science'])
    item = recommend([p], req).recommendations[0]
    assert {c.key for c in item.score_components} == {'goals','interests','quality'}
    assert abs(sum(c.contribution for c in item.score_components) - item.score) <= 0.2
    assert all(0 <= c.value <= 10 and 0 < c.weight <= 100 for c in item.score_components)
    assert item.fired_rules == ['R-AGE-PASS', 'R-SCORE-WEIGHTED', 'R-INTEREST-MATCH']


def test_total_accounting_and_no_increase_with_hard_constraints():
    dataset = [prod('A', quietness=10, technology=0, safety=10),
               prod('B', quietness=3, technology=0, safety=10),
               prod('C', quietness=10, technology=8, safety=10),
               prod('D', quietness=10, technology=0, safety=3),
               prod('E', age=(9,12), quietness=10, technology=0, safety=10)]
    unfiltered = recommend(dataset, RecommendationRequest(age=5))
    constrained = recommend(dataset, RecommendationRequest(age=5, preferences={
        'quiet_only': True, 'avoid_technology': True, 'high_safety_score_only': True
    }))
    assert unfiltered.filtered_eligible == 4
    assert constrained.filtered_eligible == 1
    assert constrained.recommendations[0].product.id == 'A'
    assert sum(constrained.excluded_by_rule.values()) + constrained.filtered_eligible == len(dataset)
    assert constrained.excluded_by_rule == {
        'R-QUIET': 1, 'R-TECH': 1, 'R-SAFETY-RATING': 1, 'R-AGE': 1
    }


def test_scoring_is_deterministic_for_same_input():
    p = prod('stable', cognitive=7, safety=10, open_ended=3, educational=8)
    req = RecommendationRequest(age=5, goals=['cognitive'])
    one = recommend([p], req)
    two = recommend([p], req)
    assert one.model_dump() == two.model_dump()


def test_evidence_summary_reports_exact_missing_fields_without_imputation():
    item = recommend([prod('sparse', cognitive=10, educational=8)],
                     RecommendationRequest(age=5, goals=['cognitive'], interests=['science'])).recommendations[0]
    assert item.coverage == 40.0
    assert item.evidence.observed == 2
    assert item.evidence.expected == 5
    assert item.evidence.level == 'limited'
    assert item.evidence.available_metrics == ['cognitive', 'educational']
    assert item.evidence.missing_metrics == ['safety', 'durability', 'open_ended']
    assert item.score > 0


def test_default_ranking_prefers_more_complete_evidence_without_changing_score():
    sparse = prod('sparse', cognitive=10, safety=10)
    complete = prod('complete', cognitive=7, safety=7, educational=7, durability=7, open_ended=7)
    req = RecommendationRequest(age=5, goals=['cognitive'])
    result = recommend([sparse, complete], req)
    assert result.ranking_mode == 'evidence_then_score'
    assert [r.product.id for r in result.recommendations] == ['complete', 'sparse']
    assert result.recommendations[0].score == 70
    assert result.recommendations[1].score == 100
    assert result.recommendations[0].coverage == 100
    assert result.recommendations[1].coverage == 40


def test_score_only_mode_keeps_original_sort_order_and_scores():
    sparse = prod('sparse', cognitive=10, safety=10)
    complete = prod('complete', cognitive=7, safety=7, educational=7, durability=7, open_ended=7)
    result = recommend([sparse, complete], RecommendationRequest(age=5,
                   goals=['cognitive'], ranking_mode='score_only'))
    assert result.ranking_mode == 'score_only'
    assert [r.product.id for r in result.recommendations] == ['sparse', 'complete']
    assert result.recommendations[0].score == 100
    assert any('Sınırlı veriyle' in w for w in result.warnings)


def test_evidence_tier_cutoffs_and_no_extra_metadata_in_denominator():
    one = recommend([prod('a', cognitive=8, safety=10, educational=9, durability=7)],
                    RecommendationRequest(age=5, goals=['cognitive'])).recommendations[0]
    assert one.evidence.level == 'full'
    assert one.coverage == 80
    two = recommend([prod('b', cognitive=8, safety=10, educational=9)],
                    RecommendationRequest(age=5, goals=['cognitive'])).recommendations[0]
    assert two.evidence.level == 'partial'
    assert two.coverage == 60


def test_coverage_is_based_on_selected_goals_not_all_development_goals():
    item = recommend([prod('c', cognitive=9, physical=10, safety=9)],
                     RecommendationRequest(age=5, goals=['cognitive'])).recommendations[0]
    assert item.evidence.expected == 5
    assert item.evidence.observed == 2
    assert 'physical' not in item.evidence.available_metrics

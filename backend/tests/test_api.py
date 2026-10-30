def test_health(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_meta(client):
    data = client.get('/api/meta').json()
    assert data['product_count'] == 397
    assert len(data['categories']) > 5
    assert any(x['key']=='cognitive' for x in data['goals'])


def test_product_listing_search(client):
    response = client.get('/api/products', params={'q': 'Arduino', 'page_size': 5})
    assert response.status_code == 200
    assert response.json()['total'] >= 1
    assert all('Arduino' in x['name'] for x in response.json()['items'])


def test_product_listing_pagination(client):
    first = client.get('/api/products', params={'page':1,'page_size':10}).json()
    second = client.get('/api/products', params={'page':2,'page_size':10}).json()
    assert len(first['items']) == len(second['items']) == 10
    assert first['items'][0]['id'] != second['items'][0]['id']


def test_product_detail_and_404(client):
    pid = client.get('/api/products').json()['items'][0]['id']
    assert client.get(f'/api/products/{pid}').json()['id'] == pid
    assert client.get('/api/products/HD-XXXX').status_code == 404


def test_recommendation(client):
    response = client.post('/api/recommendations',json={'age': 8,'goals':['cognitive'],'interests':['science']})
    assert response.status_code == 200
    data = response.json()
    assert data['total_products'] == 397
    assert data['age_eligible'] > 0
    assert data['recommendations']
    assert all(0 <= item['score'] <= 100 for item in data['recommendations'])
    assert all(item['product']['age_min'] <= 8 <= item['product']['age_max'] for item in data['recommendations'])
    assert all(len(item['score_components']) > 0 for item in data['recommendations'])


def test_validation(client):
    for payload in ({'age':-1},{'age':18},{'age':8,'goals':['invalid']}, {'age':8,'goals':['social','social']},{'age':8,'max_results':300},{'age':8,'unexpected':True}):
        assert client.post('/api/recommendations',json=payload).status_code == 422


def test_no_sql_injection(client):
    response = client.get('/api/products', params={'q':"' OR 1=1 --"})
    assert response.status_code == 200
    assert response.json()['total'] == 0


def test_recommendation_explanation_is_present_and_consistent(client):
    response = client.post('/api/recommendations', json={
        'age': 7, 'goals': ['cognitive'], 'interests': ['nature'],
        'preferences': {'quiet_only': True, 'avoid_technology': True,
                        'high_safety_score_only': True}, 'max_results': 9
    })
    assert response.status_code == 200
    data = response.json()
    assert data['filtered_eligible'] <= data['age_eligible']
    assert sum(data['excluded_by_rule'].values()) == data['total_products'] - data['filtered_eligible']
    for result in data['recommendations']:
        metrics = result['product']['metrics']
        assert metrics.get('quietness', -1) >= 7
        assert metrics.get('technology', 11) <= 3
        assert metrics.get('safety', -1) >= 8
        assert 0 <= result['score'] <= 100
        assert abs(result['score'] - sum(c['contribution'] for c in result['score_components'])) <= 0.2
        assert {'R-AGE-PASS', 'R-QUIET-PASS', 'R-TECH-PASS', 'R-SAFETY-RATING-PASS'} <= set(result['fired_rules'])


def test_api_evidence_metadata_and_default_ranking(client):
    response = client.post('/api/recommendations', json={'age': 7, 'goals': ['cognitive']})
    assert response.status_code == 200
    data = response.json()
    assert data['ranking_mode'] == 'evidence_then_score'
    if data['recommendations']:
        for r in data['recommendations']:
            e = r['evidence']
            assert e['observed'] + len(e['missing_metrics']) == e['expected']
            assert abs(r['coverage'] - 100 * e['observed']/e['expected']) <= 0.1
        tiers = {'full': 2, 'partial': 1, 'limited': 0}
        assert [tiers[r['evidence']['level']] for r in data['recommendations']] == sorted(
            (tiers[r['evidence']['level']] for r in data['recommendations']), reverse=True)


def test_api_allows_score_only_but_rejects_unknown_mode(client):
    good = client.post('/api/recommendations', json={'age': 7, 'ranking_mode': 'score_only'})
    assert good.status_code == 200
    assert good.json()['ranking_mode'] == 'score_only'
    bad = client.post('/api/recommendations', json={'age': 7, 'ranking_mode': 'unknown'})
    assert bad.status_code == 422

import type { Goal, Interest, Meta, Page, Preferences, Product, RankingMode, RecommendationResponse } from './types'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, options)
  } catch {
    throw new Error('Sunucuya ulaşılamadı. Backend uygulamasının çalıştığını kontrol edin.')
  }
  if (!response.ok) {
    if (response.status === 422) throw new Error('Gönderilen bilgiler doğrulanamadı. Seçimleri kontrol edin.')
    throw new Error(`İstek başarısız oldu (HTTP ${response.status}).`)
  }
  return response.json() as Promise<T>
}

export const api = {
  meta: () => request<Meta>('/meta'),
  products: (params: { page: number; page_size: number; q?: string; category?: string }) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') q.set(key, String(value)) })
    return request<Page>(`/products?${q}`)
  },
  product: (id: string) => request<Product>(`/products/${encodeURIComponent(id)}`),
  recommend: (body: { age: number; goals: Goal[]; interests: Interest[]; preferences: Preferences; max_results: number; ranking_mode: RankingMode }) =>
    request<RecommendationResponse>('/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
}

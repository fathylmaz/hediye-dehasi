export type RankingMode = 'evidence_then_score' | 'score_only'
export interface EvidenceSummary { observed: number; expected: number; level: 'full' | 'partial' | 'limited'; available_metrics: string[]; missing_metrics: string[] }
export type Goal = 'cognitive' | 'physical' | 'social' | 'emotional'
export type Interest = 'science' | 'art' | 'sports' | 'music' | 'nature' | 'logic' | 'social' | 'language' | 'sensory'
export interface Preferences { quiet_only: boolean; avoid_technology: boolean; high_safety_score_only: boolean }
export interface Product {
  id: string; name: string; category: string; age_min: number; age_max: number
  metrics: Record<string, number>; sources: { dataset: string; source_id: string }[]; quality_notes: string[]
}
export interface ScoreComponent { key: string; title: string; weight: number; value: number; contribution: number; details: string }
export interface RankedProduct { product: Product; score: number; coverage: number; evidence: EvidenceSummary; reasons: string[]; score_components: ScoreComponent[]; fired_rules: string[] }
export interface RecommendationResponse { total_products: number; age_eligible: number; filtered_eligible: number; excluded_by_rule: Record<string, number>; recommendations: RankedProduct[]; ranking_mode: RankingMode; warnings: string[]; methodology: string }
export interface Meta { product_count: number; categories: { name: string; count: number }[]; goals: { key: Goal; label: string }[]; interests: { key: Interest; label: string }[] }
export interface Page { items: Product[]; total: number; page: number; page_size: number }

"""API schema: user-entered facts and expert-system explanations."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Goal = Literal['cognitive', 'physical', 'social', 'emotional']
RankingMode = Literal['evidence_then_score', 'score_only']
Interest = Literal['science', 'art', 'sports', 'music', 'nature', 'logic', 'social', 'language', 'sensory']


class Source(BaseModel):
    dataset: str
    source_id: str


class Product(BaseModel):
    id: str
    name: str
    category: str
    age_min: int
    age_max: int
    metrics: dict[str, int]
    sources: list[Source]
    quality_notes: list[str] = Field(default_factory=list)


class Preference(BaseModel):
    quiet_only: bool = False
    avoid_technology: bool = False
    high_safety_score_only: bool = False


class RecommendationRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    age: int = Field(ge=0, le=17, description='Child age in completed years')
    goals: list[Goal] = Field(default_factory=list, max_length=4)
    interests: list[Interest] = Field(default_factory=list, max_length=9)
    preferences: Preference = Field(default_factory=Preference)
    max_results: int = Field(default=9, ge=1, le=30)
    ranking_mode: RankingMode = 'evidence_then_score'

    @field_validator('goals', 'interests')
    @classmethod
    def unique(cls, values: list[str]) -> list[str]:
        if len(values) != len(set(values)):
            raise ValueError('Tekrarlanan seçenekler kabul edilmez.')
        return values


class ScoreComponent(BaseModel):
    key: str
    title: str
    weight: int
    value: float
    contribution: float
    details: str


class EvidenceSummary(BaseModel):
    observed: int
    expected: int
    level: Literal['full', 'partial', 'limited']
    available_metrics: list[str]
    missing_metrics: list[str]


class RankedProduct(BaseModel):
    product: Product
    score: float
    coverage: float
    evidence: EvidenceSummary
    reasons: list[str]
    score_components: list[ScoreComponent]
    fired_rules: list[str]


class RecommendationResponse(BaseModel):
    total_products: int
    age_eligible: int
    filtered_eligible: int
    excluded_by_rule: dict[str, int]
    recommendations: list[RankedProduct]
    ranking_mode: RankingMode
    warnings: list[str]
    methodology: str = 'Kurallı eleme + açıklanabilir ağırlıklı puanlama. Puanlar olasılık değildir.'

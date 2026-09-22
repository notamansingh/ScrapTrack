"""Run directly: python scripts/test_summary.py"""
from app.models import Disposal, MetalGrade
from app.routers.disposals import compute_summary

disposals = [
    Disposal(driver_name="A", metal_grade=MetalGrade.BRIGHT_COPPER, total_weight_kg=100, estimated_payout_aud=800),
    Disposal(driver_name="B", metal_grade=MetalGrade.ALUMINUM, total_weight_kg=50, estimated_payout_aud=200),
    Disposal(driver_name="C", metal_grade=MetalGrade.STAINLESS_STEEL, total_weight_kg=10, estimated_payout_aud=40),  # no matrix entry
]
co2_per_kg_by_grade = {
    MetalGrade.BRIGHT_COPPER: 4.2,
    MetalGrade.ALUMINUM: 9.2,
}

summary = compute_summary(disposals, co2_per_kg_by_grade)

assert summary.total_weight_kg == 160
assert summary.total_valuation_aud == 1040
# (100*4.2 + 50*9.2 + 10*0) / 1000 = (420 + 460) / 1000
assert abs(summary.carbon_mitigation_tons - 0.88) < 1e-9

assert compute_summary([], {}).total_weight_kg == 0

print("OK")

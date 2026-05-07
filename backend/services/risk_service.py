# backend/services/risk_service.py

from backend.adapters.risk_adapter import compute_risk
from backend.adapters.model_adapter import run_ai_model

def evaluate_risk(state):

    classical_risk = compute_risk(state)

    ai_risk = run_ai_model(state)

    return {
        "classical_risk": classical_risk,
        "ai_risk": ai_risk
    }
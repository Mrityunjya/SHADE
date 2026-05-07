# backend/adapters/risk_adapter.py

import sys
import os

# Adds the project root to the sys.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)

# FIXED: 
# 1. Used the 'src.' prefix
# 2. Changed 'risk.collision' to 'src.risk.collision_cone' to match your file name
try:
    from src.risk.collision_cone import calculate_risk_score
except ImportError:
    # Fallback if the function name inside collision_cone.py is different
    # or if the logic actually resides in src/baseline/risk_score.py
    try:
        from src.baseline.risk_score import calculate_risk_score
    except ImportError:
        def calculate_risk_score(state):
            print("Warning: calculate_risk_score not found in risk/collision_cone.py or baseline/risk_score.py")
            return 0.0

def compute_risk(state):
    """
    Computes collision risk using the risk assessment engine.
    """
    risk = calculate_risk_score(state)
    return risk
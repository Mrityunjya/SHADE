import numpy as np
from utils.data_utils import load_npy, save_npy

PROCESSED_DIR = "data/processed"

def compute_hazard_score(risk_flags):
    """
    Computes a simple hazard score for each object.
    Inputs:
        risk_flags: dict {norad_id: np.array(time_steps)} 1=near-miss, 0=safe
    Returns:
        hazard_score: dict {norad_id: float} (higher = more hazardous)
    """
    hazard_score = {}
    for oid, flags in risk_flags.items():
        # simple score: fraction of timesteps with near-miss
        hazard_score[oid] = np.sum(flags) / len(flags)
    return hazard_score

if __name__ == "__main__":
    risk_flags = load_npy(f"{PROCESSED_DIR}/baseline_risk.npy")
    hazard_score = compute_hazard_score(risk_flags)
    save_npy(hazard_score, f"{PROCESSED_DIR}/baseline_hazard_score.npy")

    # Print top 5 risky satellites
    top5 = sorted(hazard_score.items(), key=lambda x: x[1], reverse=True)[:5]
    print("Top 5 high-risk satellites:")
    for oid, score in top5:
        print(f"{oid}: {score:.3f}")

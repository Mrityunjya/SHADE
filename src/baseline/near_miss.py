import numpy as np
from utils.data_utils import load_npy, save_npy

PROCESSED_DIR = "data/processed"

def compute_pairwise_distance(pos1, pos2):
    return np.linalg.norm(pos1 - pos2)

def baseline_near_miss(trajectories, threshold_km=5.0):
    """
    Compute a simple baseline: mark a near-miss if two objects
    come closer than threshold_km at any timestep.
    trajectories: dict {norad_id: np.array(time_steps, 6)}
    Returns:
        risk_flags: dict {norad_id: np.array(time_steps)} 1 if near-miss, 0 else
    """
    object_ids = list(trajectories.keys())
    num_objects = len(object_ids)
    num_timesteps = trajectories[object_ids[0]].shape[0]

    risk_flags = {oid: np.zeros(num_timesteps) for oid in object_ids}

    for t in range(num_timesteps):
        positions = {oid: trajectories[oid][t, :3] for oid in object_ids}  # x,y,z
        for i in range(num_objects):
            for j in range(i + 1, num_objects):
                dist = compute_pairwise_distance(positions[object_ids[i]], positions[object_ids[j]])
                if dist < threshold_km:
                    risk_flags[object_ids[i]][t] = 1
                    risk_flags[object_ids[j]][t] = 1
    return risk_flags

if __name__ == "__main__":
    trajectories = load_npy(f"{PROCESSED_DIR}/trajectories.npy")
    risk_flags = baseline_near_miss(trajectories, threshold_km=5.0)
    save_npy(risk_flags, f"{PROCESSED_DIR}/baseline_risk.npy")
    print("Baseline near-miss computation done. Saved baseline_risk.npy")

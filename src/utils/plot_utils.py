import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def plot_orbits(trajectories, highlight_ids=None, title="Satellite Orbits"):
    """
    trajectories: dict {norad_id: np.array(time_steps, 6)}
    highlight_ids: list of NORAD IDs to highlight
    """
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')

    for oid, traj in trajectories.items():
        x, y, z = traj[:, 0], traj[:, 1], traj[:, 2]
        if highlight_ids and oid in highlight_ids:
            ax.plot(x, y, z, label=f"{oid}", linewidth=2.5)
        else:
            ax.plot(x, y, z, color='gray', alpha=0.5)

    ax.set_xlabel("X (km)")
    ax.set_ylabel("Y (km)")
    ax.set_zlabel("Z (km)")
    ax.set_title(title)
    if highlight_ids:
        ax.legend()
    plt.show()

def plot_risk_flags(trajectories, risk_flags, title="Baseline Risk over Time"):
    """
    trajectories: dict {norad_id: np.array(time_steps, 6)}
    risk_flags: dict {norad_id: np.array(time_steps)}
    """
    plt.figure(figsize=(12, 6))
    for oid in trajectories.keys():
        plt.plot(risk_flags[oid], label=oid)
    plt.xlabel("Timestep")
    plt.ylabel("Risk Flag (0=Safe,1=Near-Miss)")
    plt.title(title)
    plt.legend()
    plt.show()

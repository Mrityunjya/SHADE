import numpy as np

def collision_cone(p_sat, v_sat, p_deb, v_deb, R=10):

    p = p_deb - p_sat
    v = v_deb - v_sat

    dist = np.linalg.norm(p)

    if dist == 0:
        return False

    theta = np.arcsin(R/dist)

    angle = np.arccos(
        np.dot(p,v) /
        (np.linalg.norm(p)*np.linalg.norm(v))
    )

    return angle < theta
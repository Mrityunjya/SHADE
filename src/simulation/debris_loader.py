import json
import numpy as np

def load_debris(path="data/raw/debris_positions.json"):
    with open(path) as f:
        data = json.load(f)

    x = np.array(data["x"])
    y = np.array(data["y"])
    z = np.array(data["z"])

    debris = np.vstack((x, y, z)).T
    return debris
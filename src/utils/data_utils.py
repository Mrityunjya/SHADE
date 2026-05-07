import json
import numpy as np
import os

def save_json(obj, filepath):
    with open(filepath, "w") as f:
        json.dump(obj, f, indent=4)

def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)

def save_npy(array, filepath):
    np.save(filepath, array)

def load_npy(filepath):
    return np.load(filepath)

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

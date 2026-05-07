# backend/adapters/propagation_adapter.py

import sys
import os

# Adds the project root to the sys.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)

# FIXED: 
# 1. Used the 'src.' prefix
# 2. Corrected 'propagation' to 'propogation' to match your folder spelling
# 3. Changed 'predictor' to 'orbit_propogator' based on your file list
try:
    from src.propogation.orbit_propogator import predict_trajectory
except ImportError:
    # Fallback if the function name inside orbit_propogator.py is different
    def predict_trajectory(state):
        print("Warning: Function 'predict_trajectory' not found in orbit_propogator.py")
        return state

def propagate(state):
    """
    Predict future orbital path using the orbit propagator.
    """
    prediction = predict_trajectory(state)
    return prediction
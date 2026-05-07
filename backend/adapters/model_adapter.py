# backend/adapters/model_adapter.py

import sys
import os

# Adds the project root to the sys.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)

# FIXED: Pointing to src.models.adapt_go_engine 
# (Replace 'infer_collision_probability' with the actual function name in that file)
try:
    from src.models.adapt_go_engine import infer_collision_probability
except ImportError:
    # Fallback if the function name differs in your engine file
    def infer_collision_probability(features):
        print("Warning: Function 'infer_collision_probability' not found in adapt_go_engine.py")
        return 0.0

def run_ai_model(features):
    """
    Executes the AI model for collision probability inference.
    """
    prediction = infer_collision_probability(features)
    return prediction
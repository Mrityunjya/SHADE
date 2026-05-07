# backend/adapters/simulation_adapter.py

import sys
import os

# This helps the Python interpreter find the 'src' folder at runtime
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)

# Use the full path from the project root
try:
    from src.simulation.debris_simulator import update_world
except ImportError:
    def update_world():
        print("Warning: update_world function not found in src.simulation.debris_simulator")
        return {"status": "error", "message": "Function not implemented"}

def run_simulation_step():
    """
    Executes one simulation step.
    """
    state = update_world()
    return state
# backend/services/simulation_service.py

from backend.adapters.simulation_adapter import run_simulation_step
from backend.adapters.propagation_adapter import propagate

def update_simulation():

    state = run_simulation_step()

    future_path = propagate(state)

    return {
        "state": state,
        "trajectory": future_path
    }
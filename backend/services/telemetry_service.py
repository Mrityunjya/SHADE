# backend/services/telemetry_service.py

from backend.services.simulation_service import update_simulation
from backend.services.risk_service import evaluate_risk

def generate_telemetry():

    sim_data = update_simulation()

    risk_data = evaluate_risk(sim_data["state"])

    telemetry = {
        "satellites": sim_data["state"],
        "trajectory": sim_data["trajectory"],
        "risk": risk_data,
        "timestamp": "LIVE"
    }

    return telemetry
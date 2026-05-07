# backend/services/alert_service.py

def detect_alerts(risk_score):

    alerts = []

    if risk_score > 0.7:
        alerts.append({
            "level": "HIGH",
            "message": "Collision probability critical"
        })

    elif risk_score > 0.4:
        alerts.append({
            "level": "MEDIUM",
            "message": "Potential orbital anomaly"
        })

    return alerts
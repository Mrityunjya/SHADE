# backend/services/state_manager.py

mission_state = {
    "status": "ACTIVE",
    "collisions": 0,
    "objects": []
}

def get_state():
    return mission_state

def update_state(new_state):
    global mission_state
    mission_state = new_state
import sys
import os

# 🔥 Correct path fix
sys.path.insert(0, os.path.abspath("src"))
from src.propogation.tle_parser import load_tle
from src.propogation.orbit_propogator import propagate_satellite
from src.visualization.orbit_visualizer import animate_orbits
import numpy as np

# Load satellites
sats = load_tle("data/raw/starlink_tle.txt")

if not sats:
    raise ValueError("No satellites loaded")

name, sat = sats[0]
print(f"🚀 Simulating: {name}")

# Orbit propagation
orbit = propagate_satellite(sat)
import numpy as np
orbit = np.array(orbit)  # 🔥 CONVERT TO NUMPY\

# Initial debris
num_debris = 300
debris = np.random.uniform(-8000, 8000, (num_debris, 3))

# Animate
animate_orbits(orbit, debris)
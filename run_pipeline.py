from src.simulation.debris_simulator import generate_debris
from src.visualization.orbit_visualizer import animate_orbits

import numpy as np

sat_orbit = []

for t in range(100):

    x = 7000*np.cos(t/10)
    y = 7000*np.sin(t/10)
    z = 0

    sat_orbit.append([x,y,z])

debris = generate_debris(1000)

animate_orbits(sat_orbit, debris)
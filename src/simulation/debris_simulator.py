import numpy as np

def generate_debris(n=1000, orbit_radius=7000):

    debris_positions = []

    for _ in range(n):

        theta = np.random.uniform(0, 2*np.pi)
        phi = np.random.uniform(0, np.pi)

        x = orbit_radius * np.sin(phi) * np.cos(theta)
        y = orbit_radius * np.sin(phi) * np.sin(theta)
        z = orbit_radius * np.cos(phi)

        debris_positions.append([x,y,z])

    return np.array(debris_positions)
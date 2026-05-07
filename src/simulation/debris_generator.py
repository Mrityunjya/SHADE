import numpy as np

def generate_debris(n=5000):

    debris = []

    for i in range(n):

        r = np.random.normal(6800, 500)

        theta = np.random.uniform(0, 2*np.pi)
        phi = np.random.uniform(0, np.pi)

        x = r*np.sin(phi)*np.cos(theta)
        y = r*np.sin(phi)*np.sin(theta)
        z = r*np.cos(phi)

        debris.append([x,y,z])

    return np.array(debris)
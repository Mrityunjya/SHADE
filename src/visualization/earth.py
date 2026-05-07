import numpy as np

def earth_mesh(radius=6371):

    u = np.linspace(0, 2*np.pi, 100)
    v = np.linspace(0, np.pi, 100)

    x = radius*np.outer(np.cos(u), np.sin(v))
    y = radius*np.outer(np.sin(u), np.sin(v))
    z = radius*np.outer(np.ones(len(u)), np.cos(v))

    return x,y,z
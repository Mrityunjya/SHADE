import numpy as np

def risk_score(Pgeom, Ptrend, Puncert):

    theta = np.array([Pgeom, Ptrend, Puncert])

    weights = np.exp(theta) / np.sum(np.exp(theta))

    return np.dot(weights, theta)
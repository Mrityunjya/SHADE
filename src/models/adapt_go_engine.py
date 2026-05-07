import numpy as np

class AdaptGO:

    def __init__(self):
        pass

    def softmax(self, x):

        e = np.exp(x - np.max(x))
        return e / e.sum()

    def compute_probabilities(self, distance, velocity_diff, uncertainty):

        p_geom = 1 / (distance + 1)

        p_trend = velocity_diff

        p_uncert = uncertainty

        return np.array([p_geom, p_trend, p_uncert])

    def risk_score(self, distance, velocity_diff, uncertainty):

        probs = self.compute_probabilities(
            distance,
            velocity_diff,
            uncertainty
        )

        weights = self.softmax(probs)

        risk = np.sum(weights * probs)

        return risk
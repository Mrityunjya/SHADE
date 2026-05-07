from sgp4.api import jday
import numpy as np

def propagate_satellite(sat):

    positions = []

    for minute in range(0, 90):

        jd, fr = jday(2024,1,1,0,minute,0)

        e, r, v = sat.sgp4(jd, fr)

        if e == 0:
            positions.append(r)

    return np.array(positions)
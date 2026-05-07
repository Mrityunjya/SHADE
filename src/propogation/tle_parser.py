from sgp4.api import Satrec
from sgp4.api import jday

def load_tle(file_path):
    satellites = []

    with open(file_path) as f:
        lines = f.readlines()

    for i in range(0, len(lines), 3):
        name = lines[i].strip()
        line1 = lines[i+1].strip()
        line2 = lines[i+2].strip()

        sat = Satrec.twoline2rv(line1, line2)

        satellites.append((name, sat))

    return satellites
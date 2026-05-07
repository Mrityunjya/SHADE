import plotly.graph_objects as go

def plot_orbits(sat_orbit, debris):

    sat_x = [p[0] for p in sat_orbit]
    sat_y = [p[1] for p in sat_orbit]
    sat_z = [p[2] for p in sat_orbit]

    debris_x = debris[:,0]
    debris_y = debris[:,1]
    debris_z = debris[:,2]

    fig = go.Figure()

    fig.add_trace(go.Scatter3d(
        x=sat_x, y=sat_y, z=sat_z,
        mode='lines',
        name='Satellite Orbit'
    ))

    fig.add_trace(go.Scatter3d(
        x=debris_x, y=debris_y, z=debris_z,
        mode='markers',
        marker=dict(size=2),
        name='Debris'
    ))

    fig.show()
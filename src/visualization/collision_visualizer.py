import plotly.graph_objects as go

def plot_collision_cone(sat_pos):

    cone = go.Cone(
        x=[sat_pos[0]],
        y=[sat_pos[1]],
        z=[sat_pos[2]],
        u=[1],
        v=[0],
        w=[0],
        sizemode="absolute",
        sizeref=500
    )

    return cone
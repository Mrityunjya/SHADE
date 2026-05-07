import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.animation import FuncAnimation


# 🔺 Collision Cone Generator
def create_cone(origin, direction, length=2000, radius=500, resolution=20):
    direction = direction / np.linalg.norm(direction)

    t = np.linspace(0, length, resolution)
    theta = np.linspace(0, 2*np.pi, resolution)

    t, theta = np.meshgrid(t, theta)

    x = origin[0] + direction[0]*t + radius*np.cos(theta)*(1 - t/length)
    y = origin[1] + direction[1]*t + radius*np.sin(theta)*(1 - t/length)
    z = origin[2] + direction[2]*t

    return x, y, z


def animate_orbits(orbit, debris):

    orbit = np.array(orbit)

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # 🌍 Earth
    u, v = np.mgrid[0:2*np.pi:30j, 0:np.pi:15j]
    x = 6371 * np.cos(u) * np.sin(v)
    y = 6371 * np.sin(u) * np.sin(v)
    z = 6371 * np.cos(v)
    ax.plot_surface(x, y, z, color='blue', alpha=0.2)

    sat_line, = ax.plot([], [], [], lw=2)
    sat_point, = ax.plot([], [], [], 'o')

    debris_scatter = ax.scatter(debris[:,0], debris[:,1], debris[:,2], s=5, alpha=0.3)
    risk_scatter = ax.scatter([], [], [], color='red', s=30)

    cone_surface = None
    danger_sphere = None

    RISK_THRESHOLD = 500

    def update(frame):
        nonlocal cone_surface, danger_sphere

        ax.set_xlim(-10000, 10000)
        ax.set_ylim(-10000, 10000)
        ax.set_zlim(-10000, 10000)

        # Orbit trail
        if frame > 1:
            sat_line.set_data(orbit[:frame, 0], orbit[:frame, 1])
            sat_line.set_3d_properties(orbit[:frame, 2])

        # Satellite point
        sat_point.set_data([orbit[frame, 0]], [orbit[frame, 1]])
        sat_point.set_3d_properties([orbit[frame, 2]])

        # Move debris
        moving_debris = debris + np.random.normal(0, 50, debris.shape)

        # Distance calculation
        distances = np.linalg.norm(moving_debris - orbit[frame], axis=1)

        closest_idx = np.argmin(distances)
        closest_obj = moving_debris[closest_idx]
        min_dist = distances[closest_idx]

        risk_mask = distances < RISK_THRESHOLD
        high_risk = moving_debris[risk_mask]

        # 🔥 Slow motion near collision
        if min_dist < 300:
            plt.pause(0.1)

        # Update debris
        debris_scatter._offsets3d = (
            moving_debris[:, 0],
            moving_debris[:, 1],
            moving_debris[:, 2]
        )

        # Risk points
        if len(high_risk) > 0:
            risk_scatter._offsets3d = (
                high_risk[:, 0],
                high_risk[:, 1],
                high_risk[:, 2]
            )
            print("⚠️ COLLISION RISK DETECTED")
        else:
            risk_scatter._offsets3d = ([], [], [])

        # 🔥 Highlight most dangerous object
        ax.scatter(
            closest_obj[0],
            closest_obj[1],
            closest_obj[2],
            s=80
        )

        # 🔺 Collision cone
        if frame > 1:
            direction = orbit[frame] - orbit[frame-1]

            cx, cy, cz = create_cone(orbit[frame], direction)

            if cone_surface:
                cone_surface.remove()

            cone_surface = ax.plot_surface(cx, cy, cz, alpha=0.2)

        # 🔥 Danger sphere
        if min_dist < RISK_THRESHOLD:
            u, v = np.mgrid[0:2*np.pi:10j, 0:np.pi:5j]
            r = 800

            xs = closest_obj[0] + r*np.cos(u)*np.sin(v)
            ys = closest_obj[1] + r*np.sin(u)*np.sin(v)
            zs = closest_obj[2] + r*np.cos(v)

            if danger_sphere:
                danger_sphere.remove()

            danger_sphere = ax.plot_surface(xs, ys, zs, alpha=0.3)

        return sat_line, sat_point, debris_scatter, risk_scatter

    ani = FuncAnimation(fig, update, frames=len(orbit), interval=50)

    plt.title("SHADE: Collision Risk Visualization Engine")
    plt.show()
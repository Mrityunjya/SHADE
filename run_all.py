import subprocess
import time
import sys
import signal

def run_shade_system():
    processes = []
    
    try:
        print("🚀 Launching SHADE System...")

        # 1. Start Backend (FastAPI/Uvicorn)
        # Using sys.executable ensures we use the same Python environment
        backend = subprocess.Popen(
            ["uvicorn", "backend.api.server:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
        )
        processes.append(backend)
        
        # Give the backend a moment to initialize
        time.sleep(2)

        # 2. Start Frontend (Vite/React)
        frontend = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd="frontend",
            shell=True
        )
        processes.append(frontend)

        print("\n✅ SHADE SYSTEM ONLINE")
        print("📡 Backend  -> http://127.0.0.1:8000")
        print("🖥️  Frontend -> http://localhost:5173")
        print("💡 Press Ctrl+C to shut down all services\n")

        # Keep the main script alive while processes are running
        while True:
            time.sleep(1)
            # Optional: Check if a process died unexpectedly
            if backend.poll() is not None or frontend.poll() is not None:
                break

    except KeyboardInterrupt:
        print("\n🛑 Shutting down SHADE gracefully...")
    finally:
        # Cleanup: Kill all started processes
        for p in processes:
            try:
                # On Windows, taskkill is often more reliable for shell=True processes
                if sys.platform == "win32":
                    subprocess.run(["taskkill", "/F", "/T", "/PID", str(p.pid)], capture_output=True)
                else:
                    p.terminate()
            except Exception:
                pass 
        print("👋 All systems offline.")

if __name__ == "__main__":
    run_shade_system()
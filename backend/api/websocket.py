# backend/api/websocket.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import logging

from backend.services.telemetry_service import generate_telemetry

logger = logging.getLogger(__name__)
router = APIRouter()

@router.websocket("/orbits")
async def orbit_socket(websocket: WebSocket):
    await websocket.accept()
    logger.info("Frontend connected to Orbit WebSocket")
    
    try:
        while True:
            # 1. Generate telemetry
            telemetry = generate_telemetry()
            
            # 2. Advanced: Check if the client is still there before sending
            # This prevents "Broken Pipe" errors on the server
            await websocket.send_json(telemetry)
            
            # 3. Heartbeat
            await asyncio.sleep(0.1)
            
    except WebSocketDisconnect:
        logger.info("Mission Control: Frontend disconnected gracefully.")
    except Exception as e:
        # In production, we log the error but don't crash the whole server
        logger.error(f"WebSocket Streaming Error: {e}")
    finally:
        # Cleanup
        try:
            # Check if state is still open before trying to close
            if websocket.client_state.name != "DISCONNECTED":
                await websocket.close()
        except Exception:
            pass
from interview_session import entrypoint
from livekit import agents

if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint, worker_type=agents.WorkerType.ROOM)
    )

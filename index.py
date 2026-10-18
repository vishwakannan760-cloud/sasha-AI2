"""
SASHA AI — Serverless Function Entrypoint
------------------------------------------
Entrypoint for Vercel, AWS Lambda, and cloud serverless runtimes.
Exposes the FastAPI ASGI application instance directly to prevent
500 FUNCTION_INVOCATION_FAILED errors during platform dispatch.
"""

import sys
import os

# Ensure root directory is on the Python module search path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Import the core FastAPI application
from backend.app import app

# Provide Mangum handler if in AWS Lambda / WSGI context, otherwise native ASGI app
try:
    from mangum import Mangum
    handler = Mangum(app)
except Exception:
    handler = app

# Expose app for Vercel Python runtime
__all__ = ["app", "handler"]

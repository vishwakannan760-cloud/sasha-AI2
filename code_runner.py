"""
SASHA AI — Safe Python Code Runner
----------------------------------
Executes Python code snippets in an isolated subprocess with timeout protection.
Used by the Learning Assistant to provide live code execution for beginners.
"""

import sys
import subprocess
import tempfile
import os
from typing import Dict, Any

TIMEOUT_SECONDS = 6

def execute_python_code(code: str) -> Dict[str, Any]:
    """
    Executes Python code in a safe temporary subprocess.
    Returns stdout, stderr, execution time, and exit code.
    """
    if not code or not code.strip():
        return {
            "success": False,
            "stdout": "",
            "stderr": "No code provided to execute.",
            "exit_code": 1
        }

    # Write to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_file = os.path.join(temp_dir, f"sasha_run_{os.getpid()}_{hash(code) & 0xffffffff}.py")

    try:
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(code)

        # Run with current Python interpreter
        process = subprocess.run(
            [sys.executable, temp_file],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS
        )

        return {
            "success": process.returncode == 0,
            "stdout": process.stdout,
            "stderr": process.stderr,
            "exit_code": process.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"⏱️ Execution timed out after {TIMEOUT_SECONDS} seconds. Check for infinite loops (like 'while True:')!",
            "exit_code": -1
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Execution error: {str(e)}",
            "exit_code": 1
        }
    finally:
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Move(BaseModel):
    x: int
    y: int

states = {}

# ---------- Utility Functions ----------

def init_board(size):
    return [["" for _ in range(size)] for _ in range(size)]

def is_full(grid):
    return all(cell != "" and not isinstance(cell, list) for row in grid for cell in row)

def check_winner(grid):
    n = len(grid)
    lines = grid + list(zip(*grid))  # Rows + columns
    lines.append([grid[i][i] for i in range(n)])           # Main diagonal
    lines.append([grid[i][n - i - 1] for i in range(n)])   # Anti-diagonal

    for line in lines:
        if line.count(line[0]) == n and line[0] not in ["", []]:
            return line[0]
    return "Draw" if is_full(grid) else None

def get_subgrid_size(mode):
    return {"classic": 1, "ultimate": 3, "max": 3}[mode]

def get_board_size(mode):
    return {"classic": 3, "ultimate": 9, "max": 27}[mode]

def update_meta_grid(state, gx, gy):
    board = state["board"]
    mode = state["mode"]
    subgrid_size = get_subgrid_size(mode)

    sx, sy = gx * subgrid_size, gy * subgrid_size
    subgrid = [row[sx:sx + subgrid_size] for row in board[sy:sy + subgrid_size]]
    result = check_winner(subgrid)

    if result:
        cx, cy = sx + subgrid_size // 2, sy + subgrid_size // 2
        if not isinstance(board[cy][cx], list):
            board[cy][cx] = [result]

def check_meta_winner(state):
    board = state["board"]
    subgrid_size = get_subgrid_size(state["mode"])
    meta_grid_size = len(board) // subgrid_size

    meta_grid = []
    for gy in range(meta_grid_size):
        row = []
        for gx in range(meta_grid_size):
            cx = gx * subgrid_size + subgrid_size // 2
            cy = gy * subgrid_size + subgrid_size // 2
            val = board[cy][cx]
            row.append(val[0] if isinstance(val, list) else "")
        meta_grid.append(row)

    return check_winner(meta_grid)

def get_valid_moves(state):
    board = state["board"]
    size = len(board)
    subgrid_size = get_subgrid_size(state["mode"])
    valid = []

    if state["active_subgrid"]:
        sx, sy = state["active_subgrid"]
        start_x, start_y = sx * subgrid_size, sy * subgrid_size
        for y in range(start_y, start_y + subgrid_size):
            for x in range(start_x, start_x + subgrid_size):
                if board[y][x] == "":
                    valid.append((x, y))
    else:
        for y in range(size):
            for x in range(size):
                if board[y][x] == "":
                    valid.append((x, y))
    return valid

def apply_move(state, x, y):
    board = state["board"]
    mode = state["mode"]
    player = state["player"]
    board_size = len(board)

    if not (0 <= x < board_size and 0 <= y < board_size):
        raise IndexError("Move out of bounds")

    cell = board[y][x]
    if cell != "" or isinstance(cell, list):
        raise ValueError("Cell already taken")

    board[y][x] = player

    if mode == "classic":
        state["winner"] = check_winner(board)
        state["active_subgrid"] = None
    else:
        subgrid_size = get_subgrid_size(mode)
        gx, gy = x // subgrid_size, y // subgrid_size
        update_meta_grid(state, gx, gy)
        state["winner"] = check_meta_winner(state)

        nx, ny = x % subgrid_size, y % subgrid_size
        state["active_subgrid"] = [nx, ny]

        # If next subgrid is full or won, free move
        sx, sy = nx * subgrid_size, ny * subgrid_size
        if sx + subgrid_size > board_size or sy + subgrid_size > board_size:
            state["active_subgrid"] = None
        else:
            sub = [row[sx:sx + subgrid_size] for row in board[sy:sy + subgrid_size]]
            center = board[sy + subgrid_size // 2][sx + subgrid_size // 2]
            if is_full(sub) or isinstance(center, list):
                state["active_subgrid"] = None

    state["player"] = "O" if player == "X" else "X"
    return state

async def ai_move(state):
    await asyncio.sleep(0.5)
    valid = get_valid_moves(state)
    if valid:
        x, y = random.choice(valid)
        return apply_move(state, x, y)
    return state

# ---------- API Endpoints ----------

@app.post("/reset")
async def reset(request: Request):
    mode = request.query_params.get("mode", "classic")
    if mode not in ["classic", "ultimate", "max"]:
        return {"error": "Invalid mode"}

    size = get_board_size(mode)
    states[mode] = {
        "mode": mode,
        "board": init_board(size),
        "player": "X",
        "winner": None,
        "active_subgrid": None,
    }
    return {"status": "reset", "mode": mode}

@app.get("/state")
async def get_state(mode: str):
    return states.get(mode, {"error": "No game state"})

@app.post("/move")
async def move(request: Request, player_type: str = "human"):
    mode = request.query_params.get("mode", "classic")
    state = states.get(mode)
    if not state or state["winner"]:
        return state or {"error": "Game not started"}

    try:
        data = await request.json()
        x, y = data["x"], data["y"]
    except Exception:
        return {"error": "Invalid move payload"}

    try:
        state = apply_move(state, x, y)
    except Exception as e:
        return {
            "error": str(e),
            "status": "Move failed",
            "board": state["board"],
            "player": state["player"],
            "winner": state["winner"],
            "active_subgrid": state["active_subgrid"]
        }

    if player_type == "ai" and not state["winner"]:
        state = await ai_move(state)

    return {
        "board": state["board"],
        "player": state["player"],
        "winner": state["winner"],
        "active_subgrid": state["active_subgrid"]
    }

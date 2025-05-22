from flask import Flask, request, jsonify
from flask_cors import CORS
from game_logic import UltimateTicTacToe

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React

game = UltimateTicTacToe()

@app.route("/move", methods=["POST"])
def move():
    data = request.json
    x, y = data["x"], data["y"]
    game.make_move(x, y)
    return jsonify(game.get_state())

@app.route("/state", methods=["GET"])
def state():
    return jsonify(game.get_state())

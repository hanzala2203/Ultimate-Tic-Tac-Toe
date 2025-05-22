# game_logic.py
class UltimateTicTacToe:
    def __init__(self):
        self.board = [[None for _ in range(9)] for _ in range(9)]
        self.current_player = "X"

    def make_move(self, x, y):
        # Apply rules, update board
        # Return new game state or error
        pass

    def get_state(self):
        return {
            "board": self.board,
            "player": self.current_player
        }

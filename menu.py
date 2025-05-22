import pygame
import sys
from main import run_game

pygame.init()
screen = pygame.display.set_mode((600, 600))
pygame.display.set_caption("Ultimate Tic-Tac-Toe")

# Colors and fonts
BG_COLOR = (34, 139, 34)      # Forest Green
BUTTON_COLOR = (0, 100, 0)    # Darker Green
HIGHLIGHT = (144, 238, 144)   # Light Green
TEXT_COLOR = (255, 255, 255)
BUTTON_HOVER = (30, 136, 229)
FONT = pygame.font.SysFont("Arial", 36)
SMALL_FONT = pygame.font.SysFont("Arial", 24)

def draw_button(text, y, width=250, height=50):
    rect = pygame.Rect((175, y), (width, height))
    mouse_pos = pygame.mouse.get_pos()
    color = BUTTON_HOVER if rect.collidepoint(mouse_pos) else BUTTON_COLOR

    pygame.draw.rect(screen, color, rect, border_radius=12)
    label = FONT.render(text, True, TEXT_COLOR)
    label_rect = label.get_rect(center=rect.center)
    screen.blit(label, label_rect)
    return rect

def main_menu():
    while True:
        screen.fill(BG_COLOR)

        # Title and High Score
        title = FONT.render("Ultimate Tic-Tac-Toe", True, TEXT_COLOR)
        subtitle = SMALL_FONT.render("Choose your game mode", True, HIGHLIGHT)
        screen.blit(title, title.get_rect(center=(300, 60)))
        screen.blit(subtitle, subtitle.get_rect(center=(300, 110)))

        # Buttons
        classic_button = draw_button("Classic Mode", 180)
        ultimate_button = draw_button("Ultimate Mode", 260)
        max_button = draw_button("Max Mode", 340)
        quit_button = draw_button("Quit", 440)

        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit(); sys.exit()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if classic_button.collidepoint(event.pos):
                    run_game(mode="classic")
                elif ultimate_button.collidepoint(event.pos):
                    run_game(mode="ultimate")
                elif max_button.collidepoint(event.pos):
                    run_game(mode="max")
                elif quit_button.collidepoint(event.pos):
                    pygame.quit(); sys.exit()

main_menu()

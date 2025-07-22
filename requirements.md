# Chess Aware Project — Detailed Requirements & Logic Summary

## 1. Move-Level Classifications (with Evaluation Logic)

| Label         | Rule (Eval/Logic) |
|--------------|-------------------|
| **Book**     | If the move is found in Polyglot book (e.g., Perfect2023.bin), classify as "Book". No evaluation needed. |
| **Top Move** | The #1 move recommended by Stockfish (MultiPV=3, first item). |
| **Strong**   | One of the top 3 moves (but not top), and eval drop from best move is ≤ 0.3. Not if drop > 1.0 (fallback to eval-based classification). |
| **Playable** | Not in top 3, and eval drop is < 1.0. (Equivalent to a "good" or "playable" move.) |
| **Inaccuracy** | Eval drop is between 1.0 and 1.5. |
| **Miss**     | (1) Best move gives ≥ +2.0, played move gives ≤ +0.5. (2) Player had a mate in X, but failed to continue. |
| **Mistake**  | Eval drop between 1.5 and 2.0. |
| **Blunder**  | Eval drop > 2.0, or missed mate threat / losing position. |
| **Masterstroke** | Played move causes a significant eval gain (+1.0 or more) and involves a material sacrifice (not in top 3). |

**Notes:**
- “Miss” can also include missed tactics, missed mate, missed faster checkmate, etc.
- “Masterstroke” is your version of “Brilliant” (unique to your platform).
- “Top Move” is your “Best Move.”
- “Strong” is your “Excellent.”
- “Playable” is your “Good/Sound.”

## 2. Game-Level Tags (with Evaluation Logic)

| Tag                  | Rule (Eval/Logic) |
|----------------------|-------------------|
| 📘 Book Opening      | First 8 moves follow theory (≥6/8 book moves). Eval ignored. |
| 😅 Advantage Slipped | Applies to lost/drawn games. Peak advantage ≥ +2.0 eval. Loss: drop ≥3.0 to ≤+0.5. Draw: drop ≥2.5 to ≤+1.0. Exclude justified sacrifices. |
| 🏁 Solid Endgame     | Applies to wins/draws. Endgame phase (≤6 pieces). Wins: eval swing ≤ ±0.3, no blunders. Draws: comeback from ≤-1.5 to ±0.5. |
| 🎯 Initiative        | Sustained pressure (≥5 moves) with eval ≤ +0.9. Signs: checks, pawn breaks, opponent defensive moves. Exclude material-led advantages. |
| 💪 Awesome Comeback  | Win/draw after eval ≤ -2.0. Wins: climb ≥4.0 to >0.0. Draws: climb ≥3.0 to ≤+0.5. Must include ≥3 "Best Moves" during recovery. |

Other possible tags:
- Upset Win (beat much higher-rated opponent)
- Short Game / Long Battle (based on move count)
- Perfect Game (no inaccuracies/mistakes/blunders)

## 3. Implementation Notes
- Stockfish is used for move-by-move evaluation (MultiPV=3 for top 3 moves).
- Polyglot is used for opening detection.
- All analysis is pre-computed and stored in your database for fast access and to avoid repeated computation.
- Icons and tooltips are used in the UI for each tag/classification.
- Language model explanations for “Miss” and other tags can be added later for richer feedback.

## 4. Next Steps (When You Return)
- Lock in requirements and logic (as above).
- Lock in UI/UX (icons, layout, tooltips, etc.).
- Make a copy of your current project for safety.
- Begin implementation:
  - Set up backend/database.
  - Integrate Stockfish/Polyglot.
  - Implement tagging/classification logic.
  - Display results in the UI.

You can save this summary in a file (e.g., requirements.md) in your project folder.
When you return, just point me to it, and I’ll help you continue exactly where you left off! 
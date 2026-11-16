# Tic-Tac-Toe

A 2-player Tic-Tac-Toe game built with React, Next.js, Tailwind CSS, and shadcn/ui. 

I took inspiration from **skribbl.io** so instead of just playing with plain X and O, you can enter your username, design your own character, pick custom marks, and compete on a real-time Top 10 leaderboard.

## What's Inside

- **3×3 Tic-Tac-Toe Game**: Play locally with 2 players taking turns, or switch to **vs Bot** mode if you want to play solo.
- **Character Studio (Skribbl.io style)**: Enter your username and customize your character's color, eyes, mouth, and hat, or hit the dice button to randomize your look.
- **Custom Marks**: Stick with classic X and O, pick custom icons (lightning, flame, crown, swords, star, ghost, rocket), or use your own custom character as your board mark.
- **Scoreboard (Wins, Draws, Losses)**: Tracks wins, draws, losses, and win streaks for both players during your session, with a **New Game** button to start the next round right away.
- **Real-Time Top 10 Leaderboard**: Saves player wins, draws, and losses in real time and keeps only the Top 10 players with the most wins.
- **Mobile Responsive**: Works on desktop and mobile down to 320px screens, with a bottom navigation bar on mobile to switch between the Arena, Character Studio, and Top 10 Leaderboard.

## Tech Stack

- **Next.js** (App Router) & **React**
- **Tailwind CSS** & **shadcn/ui**
- **Lucide React** (icons) & **Canvas Confetti** (win celebration)
- **Web Audio API** (built-in sound effects, muteable anytime)

## Project Structure

```text
src/
├── app/
│   ├── api/leaderboard/   # API route saving Top 10 leaderboard data
│   ├── globals.css        # Tailwind styles & animations
│   ├── layout.tsx         # Root layout & fonts
│   └── page.tsx           # Main game page
├── components/
│   ├── arena/             # Scoreboard banner & 3x3 game board
│   ├── feedback/          # Toast notifications
│   ├── layout/            # Header & mobile bottom nav bar
│   ├── leaderboard/       # Top 10 leaderboard card
│   ├── studio/            # Character & mark customizer
│   └── ui/                # shadcn/ui components
├── constants/             # Colors, marks, and default game data
├── hooks/                 # Custom hooks for game state, profiles, and leaderboard
├── lib/                   # Win/draw checker, bot logic, and sound effects
└── types/                 # TypeScript types
```

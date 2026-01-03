# Faith Recall - JAAGO

A complete, production-ready two-stage Catholic memory & knowledge game for church events.

## Features

- **Two-stage game experience** (180 seconds total)
  - Game 1: Saints Memory Match (90 seconds)
  - Game 2: Emoji Bible Quiz (90 seconds)
- **Zero keyboard input** - all interactions via touch/mouse
- **Automatic transitions** between game stages
- **Security code verification** with punishment flow
- **Real-time leaderboard** with Supabase integration
- **Catholic aesthetic** with warm colors and joyful design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Supabase (database)
- Zustand (state management)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Set up Supabase database:**
   - Create a table named `players` with the following schema:
     ```sql
     CREATE TABLE players (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name TEXT NOT NULL,
       region TEXT NOT NULL,
       score INTEGER NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );

     CREATE INDEX idx_players_score ON players(score DESC);
     ```

4. **Add saint images:**
   - Place PNG images in `/public/images/saints/`:
   - Recommended size: 300x400px (portrait aspect ratio)

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Game Flow

1. **Player Registration** - Enter name and select Indian state
2. **Security Code Entry** - Create 6-digit verification code
3. **Game 1** - Match saint images with names (90 seconds)
4. **Game 2** - Answer Bible story questions (90 seconds)
5. **Security Code Verification** - Verify identity to view results
6. **Results** - View scores and save to leaderboard
7. **Leaderboard** - View top scores with real-time updates

## Project Structure

```
/app
  /page.tsx                 # Player Registration
  /security-code/page.tsx   # Security Code Entry
  /game1/page.tsx          # Saints Memory Match
  /game2/page.tsx          # Emoji Bible Quiz
  /verify-code/page.tsx    # Security Code Verification
  /results/page.tsx        # Results Screen
  /score/page.tsx         # Leaderboard

/components
  /NumericKeypad.tsx       # Reusable 0-9 keypad
  /NameInput.tsx           # Custom on-screen keyboard
  /StateSelector.tsx       # Indian states selector
  /Timer.tsx               # Countdown timer
  /SaintCard.tsx           # Memory game card
  /QuizQuestion.tsx        # Quiz question display

/lib
  /supabase.ts             # Supabase client
  /gameData.ts             # Saints and quiz data

/store
  /gameStore.ts            # Zustand state management
```

## Key Features

### No Keyboard Input
All text and number entry uses custom on-screen interfaces:
- Custom keyboard for name input
- Numeric keypad for security codes
- Touch/mouse only interactions

### Automatic Transitions
- No "Next" or "Continue" buttons
- Automatic progression between stages
- Smooth transitions with appropriate delays

### Scoring Systems

**Game 1:**
- Base points: 1000 - (match_time × 50), minimum 100
- Combo multiplier: 1.0x → 1.2x → 1.5x → 2.0x → 2.5x (max)
- Penalty: -150 points for wrong matches
- Tie-breaker: milliseconds % 10

**Game 2:**
- Points: 1000 - (time_taken × 50), minimum 250
- Wrong answer: 0 points (no penalty)

### Security Code Verification
- 2 attempts allowed
- After 2 failures or "Forgot Code": punishment flow
- Punishment: Check 5 "Hail Mary" boxes to continue

## Admin Features

- **Reset Leaderboard:** Triple-click the "Leaderboard" header to show delete confirmation
- Confirmation required before deleting all scores

## Production Build

```bash
npm run build
npm start
```

## License

This project is built for church events and community use.


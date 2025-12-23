# *Faith Recall* (Church Event Game)

Build a complete, production-ready **two-stage Catholic memory & knowledge game** called **"Faith Recall"** for church events.

---

## 🧱 Tech Stack (Required)

* **Next.js** (latest stable version, App Router architecture)
* **TypeScript** (strict mode enabled)
* **Tailwind CSS** (for all styling)
* **Supabase** (database only - no authentication features)
* **Zustand** or **React Context** (for state management)
* **No keyboard interaction** - all inputs must use touch/mouse interfaces only

---

## 🎯 Core Requirements

### Mandatory Constraints
* **Zero keyboard input** - implement custom on-screen interfaces for ALL text/number entry
* **Single Supabase table** - use only the `players` table for leaderboard data
* **All game content in frontend code** - saints data and quiz questions stored as TypeScript constants (NOT in database)
* **Automatic transitions** - no manual "Next" or "Continue" buttons between game stages
* **Total gameplay time: 180 seconds** (90s per game)

---

## 🔄 Complete Game Flow (Exact Sequence)

The application must follow this precise flow with **automatic transitions** between stages:

### 1. Player Registration Screen
**Inputs Required:**
* **Name input** - implement custom on-screen keyboard/character selector (NO native keyboard input)
* **State/Region selector** - dropdown/button grid showing all 28 Indian states:
  * Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal

**Validation:**
* Both name and state must be selected before proceeding
* Show validation error if either field is empty

**Transition:** Automatically proceed to Security Code Entry after successful validation

---

### 2. Security Code Entry (Pre-Game Setup)
**Purpose:** Player creates a 6-digit numeric security code for later verification

**Implementation:**
* Display custom **numeric keypad (0-9)** with touch/mouse interaction only
* Show 6 input boxes that fill as digits are entered
* Include backspace/clear button
* Require exactly 6 digits before allowing continuation
* Store code in application state (Zustand/Context) - do NOT save to database yet

**Transition:** Automatically start Game 1 when 6-digit code is entered (no "Start Game" button needed)

---

### 3. Game 1 - Saints & Images Memory Match (90 seconds)

#### Game Mechanics

**Initial Setup (First 1 second):**
1. Display 10 saint image cards on LEFT side and 10 saint name cards on RIGHT side
2. All cards are **face-up/revealed** for exactly 1 second
3. After 1 second, shuffle both sides independently and flip all cards face-down
4. Start 90-second countdown timer
5. Enable card interactions

**Card Layout:**
* **Left column:** 10 cards showing saint images (from `/images/saints/*.png`)
* **Right column:** 10 cards showing saint names as text
* Cards should be large, clearly visible, and arranged vertically or in a grid

**Interaction Flow:**

**Step 1 - First Card Selection:**
* Player clicks ANY card from EITHER side (left OR right)
* Selected card: Shows highlighted border/glow effect and reveals its content
* Opposite side: ALL cards on the opposite side immediately reveal and stay revealed
* Same side: All other cards remain hidden

**Step 2 - Changing First Selection (Optional):**
* Player CAN click a different card on the SAME side as their first selection
* Previous selection unhighlights, new card highlights
* Opposite side remains revealed (no re-hiding/re-revealing)
* This can be repeated until player clicks a card on the opposite side

**Step 3 - Second Card Selection:**
* Player clicks ONE card from the now-revealed opposite side
* Immediately disable ALL card clicks to prevent multiple selections
* Perform match validation

**Step 4 - Match Validation:**

**If CORRECT match:**
1. Both cards show **green glow effect** for 800ms
2. After 800ms, both cards **fade out and disappear** completely
3. Empty spaces remain (no re-shuffling or re-centering)
4. All remaining cards flip back to face-down
5. Re-enable card interactions for next match attempt
6. Record match time and calculate score

**If INCORRECT match:**
1. Both selected cards show **red shake animation** for 800ms
2. After 800ms, flip BOTH selected cards face-down
3. Flip ALL cards on the opposite side face-down
4. Return to initial state (all cards hidden)
5. Re-enable card interactions
6. Apply -150 point penalty
7. Reset combo multiplier to 1.0x
8. Reset per-match timer

**Step 5 - Repeat:**
* Continue until all 10 pairs are matched OR 90-second timer expires

#### Scoring System (Game 1)

**Timers:**
* **Global timer:** 90-second countdown (starts after initial 1-second reveal)
* **Per-match timer:** Starts when first card is selected, resets after each match attempt

**Score Calculation Per Match:**
```
Base Points = 1000 - (match_time_seconds × 50)
Minimum Base Points = 100

Combo Multiplier progression (consecutive correct matches):
- 1st correct match: 1.0x
- 2nd consecutive: 1.2x
- 3rd consecutive: 1.5x
- 4th consecutive: 2.0x
- 5th+ consecutive: 2.5x (capped)
- Resets to 1.0x after ANY incorrect match

Match Score = (Base Points × Combo Multiplier) + (milliseconds % 10)

The milliseconds modulo adds 0-9 points for tie-breaking
```

**Penalties:**
* Wrong match: -150 points (applied immediately)
* Score can go negative during gameplay but minimum final score is 0

**Total Game 1 Score:**
```
Total = SUM(all Match Scores) - SUM(all Penalties)
Minimum = 0 (cannot be negative at game end)
```

#### Saint Data (Fixed Dataset)

Store this data as a TypeScript constant in your frontend code:

```typescript
const SAINTS_DATA = [
  { id: 1, name: 'Saint Peter', image: '/images/saints/peter.png' },
  { id: 2, name: 'Saint Sebastian', image: '/images/saints/sebastian.png' },
  { id: 3, name: 'Saint Francis of Assisi', image: '/images/saints/francis.png' },
  { id: 4, name: 'Saint Thérèse of Lisieux', image: '/images/saints/therese.png' },
  { id: 5, name: 'Saint Matthew', image: '/images/saints/matthew.png' },
  { id: 6, name: 'Saint Mark', image: '/images/saints/mark.png' },
  { id: 7, name: 'Saint Luke', image: '/images/saints/luke.png' },
  { id: 8, name: 'Saint John the Evangelist', image: '/images/saints/john.png' },
  { id: 9, name: 'Saint Paul', image: '/images/saints/paul.png' },
  { id: 10, name: 'Saint Joseph', image: '/images/saints/joseph.png' }
];
```

**Image Requirements:**
* Store PNG images in `/public/images/saints/` directory
* Images must be clear, recognizable representations of each saint
* Recommended size: 300x400px or similar portrait aspect ratio

**Transition:** When Game 1 ends (all matches complete OR timer expires), **immediately** transition to Game 2 with no user confirmation

---

### 4. Game 2 - Emoji Bible Story Quiz (90 seconds)

#### Game Mechanics

**Question Flow:**
1. Shuffle all 6 questions at game start (randomized order)
2. Display questions **one at a time sequentially**
3. Each question has a **15-second individual timer**
4. Questions cannot be skipped
5. After answering (or timeout), **auto-advance** to next question after 300-500ms feedback delay
6. Continue until all 6 questions answered OR 90-second total timer expires

**Question Display:**
* Show emoji sequence (all emojis displayed at once, no animation)
* Show question text: "What is the story?"
* Show 4 multiple-choice options (A, B, C, D) as large clickable buttons
* Show 15-second countdown timer for current question
* **Do NOT show** question counter (e.g., "Question 3 of 6")

**Answer Interaction:**
1. Player clicks one answer button
2. **Immediately lock** the answer (disable all buttons)
3. Show visual feedback:
   * **Correct answer:** Green background/border with ✅ icon, flicker animation
   * **Wrong answer:** Red background/border with ❌ icon, flicker animation
4. Display feedback for **300-500ms**
5. **Auto-advance** to next question (no "Next" button)
6. Calculate and record score

**Timeout Handling:**
* If 15-second timer expires with no answer: treat as wrong answer (0 points)
* Show brief "Time's up" message (300ms)
* Auto-advance to next question

#### Scoring System (Game 2)

**Time Measurement:**
* Timer starts when question appears on screen
* Maximum 15 seconds per question

**Score Calculation:**
```
Correct Answer Points = 1000 - (time_in_seconds × 50)
Minimum Points = 250 (if answered at 15 seconds)

Wrong Answer = 0 points (no penalty)
Timeout = 0 points (treated as wrong)

Total Game 2 Score = SUM(all correct answer points)
```

**Examples:**
* Answer in 2 seconds: 1000 - (2 × 50) = 900 points
* Answer in 8 seconds: 1000 - (8 × 50) = 600 points
* Answer in 14 seconds: 1000 - (14 × 50) = 300 points
* Wrong answer: 0 points

#### Quiz Questions (Fixed Dataset)

Store this data as a TypeScript constant in your frontend code. Create 6 Bible story questions with emoji representations:

```typescript
const BIBLE_QUIZ_DATA = [
  {
    id: 1,
    emojis: ['🌊', '➗', '➡️', '🚶‍♂️'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'Jonah and the Whale' },
      { label: 'B', text: 'Moses parts the Red Sea' },
      { label: 'C', text: 'Noah\'s Ark' },
      { label: 'D', text: 'Jesus Walks on Water' }
    ],
    correctAnswer: 'B'
  },
  // Add 5 more creative Bible story questions with emoji representations
  // Examples: Creation story, David & Goliath, Feeding of 5000, etc.
];
```

**Transition:** When Game 2 ends (all questions answered OR 90-second timer expires), **immediately** show Security Code Verification screen

---

### 5. Security Code Verification (Post-Game)

**Purpose:** Verify player identity before showing results

**Implementation:**
* Display message: "Enter your security code to view results"
* Show custom **numeric keypad (0-9)** (same as pre-game entry)
* Show 6 input boxes
* Include backspace/clear button
* Include "Forgot Code?" button

**Verification Logic:**
* Compare entered code with code stored in state from step 2
* Allow **maximum 2 attempts**

**Attempt Tracking:**
* First wrong attempt: Show error message "Incorrect code. 1 attempt remaining."
* Second wrong attempt: Trigger punishment flow

**Outcomes:**

**If CORRECT (within 2 attempts):**
* Immediately transition to Results screen

**If WRONG (after 2 failed attempts) OR "Forgot Code?" clicked:**
* Show punishment flow screen:
  * Display message: **"Recite 5 Hail Marys to continue"**
  * Show 5 large checkboxes labeled:
    * ☐ Hail Mary 1
    * ☐ Hail Mary 2
    * ☐ Hail Mary 3
    * ☐ Hail Mary 4
    * ☐ Hail Mary 5
  * Show "Continue" button (disabled until all 5 boxes checked)
  * When all boxes checked, enable "Continue" button
  * Clicking "Continue" transitions to Results screen

---

### 6. Results Screen

**Display Information:**
* Player Name
* Region (Indian state)
* Game 1 Score (with label)
* Game 2 Score (with label)
* **Total Score** (Game 1 + Game 2, prominently displayed)

**Automatic Database Save:**
* **Immediately upon displaying results**, save score to Supabase `players` table
* Insert record with: `name`, `region`, `score` (total), `created_at` (auto-generated)
* Handle errors gracefully:
  * If save fails, show error message but still display results
  * Do NOT block user from viewing their score

**Navigation Buttons:**
* **"Play Again"** - Reset all game state, clear Zustand/Context, return to Player Registration screen
* **"View Leaderboard"** - Navigate to `/score` route

---

### 7. Leaderboard Page (`/score` route)

**Data Fetching:**
* Fetch all records from Supabase `players` table
* Sort by `score` descending (highest first)
* Implement real-time updates (Supabase real-time subscriptions) so new scores appear automatically

**Display:**
* Table/list showing:
  * **Rank** (1, 2, 3, ...)
  * **Name**
  * **Region**
  * **Score**
* Highlight top 3 players with special styling (gold/silver/bronze)
* Projector-friendly design (large text, high contrast)

**Admin Features:**
* Include hidden admin button (e.g., triple-click header) to reset/clear all scores
* Confirmation dialog before deletion

---

## 🗄️ Supabase Database Schema

**Table Name:** `players`

**Columns:**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for leaderboard queries
CREATE INDEX idx_players_score ON players(score DESC);
```

**Important Notes:**
* This is the ONLY table needed
* Do NOT store game questions, saint data, or security codes in database
* Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) will be provided separately

---

## 🎨 UI/UX Requirements

**Visual Design:**
* **Catholic aesthetic:** Use warm colors (gold, burgundy, cream, white)
* **Joyful and welcoming:** Bright, celebratory feel appropriate for church events
* **Large interactive elements:** Minimum 60px touch targets for all buttons/cards
* **Clear visual feedback:** Smooth animations for all state changes
* **Responsive:** Works on mobile (portrait), tablet (landscape), and desktop
* **Projector-safe:** High contrast, large fonts for leaderboard display

**Typography:**
* Large, readable fonts (minimum 18px for body text)
* Saint names on cards: minimum 20px, bold
* Headings: minimum 32px

**Animations:**
* Card flips: 300-400ms smooth transition
* Match feedback: 800ms (green glow or red shake)
* Question feedback: 300-500ms flicker effect
* All transitions: ease-in-out timing

**Accessibility:**
* High contrast ratios (WCAG AA minimum)
* Clear focus states for all interactive elements
* Touch targets minimum 44x44px (WCAG AAA)

---

## 📁 Project Structure Recommendations

```
/app
  /page.tsx                 # Player Registration
  /game1/page.tsx          # Saints Memory Match
  /game2/page.tsx          # Emoji Bible Quiz
  /results/page.tsx        # Results Screen
  /score/page.tsx          # Leaderboard
  /layout.tsx              # Root layout

/components
  /NumericKeypad.tsx       # Reusable 0-9 keypad
  /NameInput.tsx           # Custom on-screen keyboard
  /StateSelector.tsx       # Indian states dropdown/grid
  /Timer.tsx               # Countdown timer component
  /SaintCard.tsx           # Memory game card
  /QuizQuestion.tsx        # Quiz question display

/lib
  /supabase.ts             # Supabase client setup
  /gameData.ts             # SAINTS_DATA and BIBLE_QUIZ_DATA constants

/store
  /gameStore.ts            # Zustand store (or use Context)

/public
  /images
    /saints
      /peter.png
      /sebastian.png
      # ... (10 total saint images)
```

---

## ✅ Implementation Checklist

**Phase 1 - Setup:**
- [ ] Initialize Next.js project with TypeScript and Tailwind CSS
- [ ] Set up Supabase client with environment variables
- [ ] Create Zustand store or React Context for game state
- [ ] Create `players` table in Supabase

**Phase 2 - Core Screens:**
- [ ] Build Player Registration screen with custom name input and state selector
- [ ] Build Security Code Entry screen with numeric keypad
- [ ] Build Security Code Verification screen (reuse keypad component)
- [ ] Build Results screen with auto-save functionality
- [ ] Build Leaderboard page with real-time updates

**Phase 3 - Game 1:**
- [ ] Create saint data constant (10 saints)
- [ ] Add saint images to `/public/images/saints/`
- [ ] Build card component with flip animation
- [ ] Implement card selection logic (first card, opposite side reveal, second card)
- [ ] Implement match validation (correct: green glow + remove, incorrect: red shake + reset)
- [ ] Implement scoring system (base points, combo multiplier, penalties, tie-breaker)
- [ ] Implement 90-second timer with auto-transition

**Phase 4 - Game 2:**
- [ ] Create quiz data constant (6 questions with emojis)
- [ ] Build question display component
- [ ] Implement answer selection with immediate feedback
- [ ] Implement 15-second per-question timer
- [ ] Implement timeout handling (auto-advance with 0 points)
- [ ] Implement scoring system (time-based points)
- [ ] Implement auto-advance after feedback delay

**Phase 5 - Flow Integration:**
- [ ] Implement automatic transitions between all screens
- [ ] Test complete flow from registration to leaderboard
- [ ] Implement "Play Again" reset functionality
- [ ] Test punishment flow (wrong code / forgot code)

**Phase 6 - Polish:**
- [ ] Add all animations (card flips, feedback effects, transitions)
- [ ] Ensure no keyboard inputs work anywhere
- [ ] Test on mobile, tablet, and desktop
- [ ] Optimize for projector display (leaderboard)
- [ ] Add error handling for Supabase operations

---

## 🚫 Critical Constraints (Must Follow)

1. **NO keyboard input anywhere** - all text/number entry via custom on-screen interfaces
2. **NO manual "Next" buttons** - all transitions between stages are automatic
3. **NO additional Supabase tables** - only use `players` table
4. **NO game data in database** - saints and questions stored in frontend code
5. **NO authentication system** - security code is only for game verification, not stored
6. **NO skipping questions** in Game 2 - must answer or wait for timeout
7. **NO question counter display** in Game 2 - hide "Question X of 6"

---

## 🎯 Final Deliverable

A complete, production-ready Next.js application that:
* Runs a 180-second two-game experience
* Uses only touch/mouse interaction (zero keyboard input)
* Automatically transitions through all game stages
* Saves scores to Supabase and displays live leaderboard
* Includes security verification with punishment flow
* Works flawlessly on mobile, tablet, and desktop
* Has a joyful Catholic aesthetic appropriate for church events

**Environment variables will be provided separately** - do not hardcode Supabase credentials.

Build the complete application with all features described above.
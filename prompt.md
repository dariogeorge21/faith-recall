Below is a **single, clean BUILD PROMPT** for your **second combined game**, keeping **ALL earlier features intact** (security, verification, leaderboard, inputs, Supabase, no keyboard, etc.) and changing **only the game mechanics**.

This is ready to copy-paste and use.

---

# 🎮 BUILD PROMPT — *Faith Recall* (Church Event Game)

## 🎯 Goal

Build a **two-stage Catholic memory & knowledge game** called **“Faith Recall”** for a church event using **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**.

The game must be:

* Touch/mouse only (NO keyboard)
* Event-friendly
* Competitive
* Visually joyful
* Fully backend-driven
* Uses **ONE Supabase table only**

Total gameplay time: **180 seconds**

---

## 🧱 Tech Stack (Strict)

* Next.js (latest, App Router)
* TypeScript
* Tailwind CSS
* Supabase (DB only, no auth needed)
* Zustand or React Context
* No keyboard interaction anywhere

---

## 🕹️ Gameplay Structure

### Total Game Time

* **180 seconds total**

  * Game 1: 90 seconds
  * Game 2: 90 seconds

---

## 🔄 Complete Game Flow Sequence

The game follows this exact sequence with **automatic transitions** (no manual "Next" buttons between stages):

1. **Player Registration**
   * Player enters name and selects state
   * → **Automatic transition** to Security Code Entry

2. **Security Code Entry** (Before Game 1)
   * Player enters their chosen 6-digit security code
   * Code is saved in state
   * → **Automatic transition** to Game 1

3. **Game 1** (Saints & Images Memory Match)
   * Runs for up to 90 seconds
   * Ends when: all matches completed OR timer expires
   * → **Automatic transition** to Game 2 (no confirmation required)

4. **Game 2** (Emoji Bible Story Finder)
   * Runs for 90 seconds
   * Ends when timer expires
   * → **Automatic transition** to Security Code Verification

5. **Security Code Verification** (After Game 2)
   * Player must re-enter their security code
   * **If CORRECT:** → **Automatic transition** to Results
   * **If WRONG/FORGOTTEN:** → Punishment flow → Results

6. **Results Page**
   * Displays final scores
   * **Automatically saves score to Supabase** when displayed
   * Includes "View Leaderboard" button

---

## 🧠 GAME 1 — *Saints & Images Memory Match*

### Core Concept

A **memory matching game** where players match **Saint images/photos** with their corresponding **Saint names**. One side displays Saint images (visual representations), and the other side displays Saint names as text.

---

### Data Set (Fixed Content)

Use the following saint image-name pairs (stored in frontend application code as a JavaScript/TypeScript constant):

| Saint                     | Image Path                         |
| ------------------------- | ---------------------------------- |
| Saint Peter               | `/images/saints/peter.png`        |
| Saint Sebastian           | `/images/saints/sebastian.png`    |
| Saint Francis of Assisi   | `/images/saints/francis.png`      |
| Saint Thérèse of Lisieux  | `/images/saints/therese.png`      |
| Saint Matthew             | `/images/saints/matthew.png`      |
| Saint Mark                | `/images/saints/mark.png`         |
| Saint Luke                | `/images/saints/luke.png`         |
| Saint John the Evangelist | `/images/saints/john.png`         |
| Saint Paul                | `/images/saints/paul.png`         |
| Saint Joseph              | `/images/saints/joseph.png`       |

**Note:** Each Saint should have an associated PNG image file stored in `/public/images/saints/` directory. The image cards display these visual representations, while the name cards display the Saint names as readable text. See the **Data Architecture** section for TypeScript structure examples.

---

### Gameplay Flow

1. **Initial Display:** All cards on both sides are **revealed briefly** (approximately 1 second) to allow players to memorize positions
2. **Shuffle & Hide:** Cards are shuffled and then hidden/flipped face-down
3. **First Selection:** Player clicks/taps to choose **ONE card from EITHER side** (image side OR name side)

#### Dynamic Reveal Mechanism - Card State Management

**When first card is selected:**
* **Selected card:** Remains highlighted/selected with visual indicator (e.g., border glow)
* **Opposite side cards:** ALL cards on opposite side reveal and **STAY REVEALED** until match validation completes
* **Same side cards:** Remain hidden (except the selected card)

**Changing First Selection:**
* Player **CAN change** their first selection by clicking another card on the **SAME side**
* When first selection changes:
  * Previous selection unhighlights
  * New card becomes highlighted
  * Opposite side cards remain revealed (no re-hiding/re-revealing)

**Multiple Selections During Reveal:**
* Once opposite side is revealed, player can **ONLY click ONE card** from the revealed side
* After second selection is made, **ALL clicks are disabled** until validation animation completes
* If player somehow clicks multiple cards rapidly, only the **FIRST click** on the revealed side counts

4. **Second Selection:** Player then selects the matching card from the now-revealed opposite side

#### Match Validation - Enhanced Specification

**Validation Timing & Sequence:**
1. **Immediate validation** occurs after second card selection (no delay before checking)
2. **Visual feedback delay** of 800ms to show result before state changes
3. **Sequence:**
   * Second card selected → Immediate validation check
   * Show visual feedback (green glow OR red shake) for 800ms
   * Then execute result action (remove/hide cards)

**Correct Match Behavior:**
* Both matched cards: Lock in place with **green glow effect** for 800ms
* After 800ms: Cards **fade out and disappear** from the board (removed completely)
* Empty spaces remain where cards were removed
* Board does NOT re-shuffle or re-center after removal

**Incorrect Match Reset:**
* Both selected cards: Show **red shake animation** for 800ms
* After 800ms animation completes:
  * BOTH selected cards hide/flip back to face-down
  * ALL cards on the opposite side hide/flip back to face-down
  * Board returns to initial state (all cards hidden)
  * Player must start fresh with new first selection

5. **Repeat:** Continue until all pairs are matched or time runs out

---

### Scoring (Game 1) - Enhanced Specification

#### Time Measurement

* **Global timer:** 90-second countdown starts when Game 1 begins (after initial 1-second reveal)
* **Per-match timer:** Starts when FIRST card is selected for each match attempt
* **Per-match timer resets:** When incorrect match occurs, timer resets for next attempt

#### Detailed Scoring Formula

**Base Points Calculation:**
```
Base Points = 1000 - (match_time_seconds × 50)
Minimum Base Points = 100 (even if match takes >18 seconds)
```

**Combo Multiplier:**
* Consecutive correct matches increase multiplier
* Multiplier progression: **1.0x → 1.2x → 1.5x → 2.0x → 2.5x** (caps at 2.5x)
* Resets to 1.0x after **ANY incorrect match**

**Final Match Score:**
```
Match Score = Base Points × Combo Multiplier
```

**Wrong Match Penalty:**
* Fixed penalty: **-150 points** per incorrect attempt
* Score CAN go negative during gameplay (minimum total score = 0 at game end)
* Penalty applies immediately when incorrect match is detected

#### Non-linear Variation to Avoid Ties

**Time-based micro-variation:**
```
Final Match Score += (milliseconds % 10)
```
This adds 0-9 points based on milliseconds component of match time, creating natural variation without affecting core scoring logic.

**Total Game 1 Score:**
```
Total Score = SUM(all Match Scores) - SUM(all Penalties)
Minimum Total Score = 0 (cannot be negative at game end)
```

---

### Time

* Timer: **90 seconds**
* **Automatic Transition:** When Game 1 ends (either by completing all matches OR when the 90-second timer expires), **immediately transition to Game 2** with no user confirmation required
* Do NOT wait for user confirmation between games

---

## 🧠 GAME 2 — *Emoji Bible Story Finder*

### Core Concept

Players identify **Bible stories represented using emojis**, answering **MCQ questions** under time pressure.

**Note:** All emoji Bible story questions and their multiple-choice options must be stored in the frontend application code as a JavaScript/TypeScript object or constant.

---

### Question Presentation Flow

**Question Sequence:**
* Questions are shown **one at a time sequentially**
* Players **cannot skip questions** - must answer or wait for timeout
* Questions are presented in **randomized order** (shuffled at game start)
* If a player doesn't answer within the time limit, it is **treated as a wrong answer** (0 points)

**Question Pool:**
* **Total of 6 questions** exist in the question bank
* **All 6 questions are shown** during the 90-second game
* Each question has a **15-second individual timer**
* If a player answers all 6 questions before 90 seconds, the game continues until the 90-second total timer expires or all questions are completed (whichever comes first)

**Question Display:**
* **No question counter** is displayed (e.g., no "Question 3 of 6")
* Emoji sequence is displayed **all at once** (no animation or reveal)
* **Auto-advance** to next question after answer feedback - no "Next Question" button

---

### Answer Selection and Validation

**Answer Feedback:**
* Feedback is shown **immediately after selection**
* A **flicker/flash animation** plays on the selected answer button
* **Visual color coding**: Green for correct ✅, Red for incorrect ❌
* Feedback is displayed for **300-500ms** before auto-advancing to next question

**Answer Locking:**
* Players **cannot change their answer** once selected
* **No "Submit" button** - answer is submitted immediately on click
* Once clicked, the answer is locked and feedback is shown

**Timeout Handling:**
* If the 15-second question timer expires without an answer, it is **treated as a wrong answer** (0 points)
* Unanswered questions **count as wrong** in the final score
* The game **auto-advances** to the next question (no answer is recorded, just 0 points)

---

### Time-Based Scoring - Enhanced Specification

**Time Measurement:**
* Timer starts **from the moment the question is displayed** on screen
* Each question has a **maximum of 15 seconds** (individual timer)
* The overall game has a **90-second total limit** (6 questions × 15 seconds = 90 seconds max)

**Scoring Formula:**
* **Base points per question**: 1000 points
* **Time-to-points conversion**: `1000 - (time_in_seconds × 50)`
  * Example: Answer in 3 seconds = 1000 - (3 × 50) = **850 points**
  * Example: Answer in 10 seconds = 1000 - (10 × 50) = **500 points**
  * Example: Answer in 15 seconds = 1000 - (15 × 50) = **250 points**
* **Minimum points for correct answer**: 250 points (if answered at 15 seconds)
* **No internal difficulty scaling** - all questions worth the same base points

**Wrong Answer Penalty:**
* Wrong answer = **0 points** (no negative penalty)
* Unanswered questions (timeout) = **0 points** (treated as wrong)
* No deduction from total score

**Total Game 2 Score:**
```
Total Score = SUM(all correct answer points)
```

---

### Game 2 Completion

* When Game 2 ends (after 90 seconds OR all 6 questions completed), **immediately show the security code verification screen**
* No manual "Continue" button required - automatic transition

---

### Example Question

```
🌊 ➗ ➡️ 🚶‍♂️
What is the story?

A. Jonah and the Whale  
B. Moses parts the Red Sea ✅  
C. Noah's Ark  
D. Jesus Walks on Water
```

---

## 🧮 Final Scoring System

* Total Score = Game 1 Score + Game 2 Score
* Both games use **time-based scoring** (faster solutions earn more points)
* Time-weighted formula ensures speed is rewarded
* Non-linear formula to prevent ties
* Speed + accuracy both matter

---

## 👤 Player Registration

* Name → selectable UI (NO keyboard)
* Region → **All 28 Indian States**
* Validate before proceeding
* After validation, immediately proceed to Security Code Entry

---

## 🔐 Security Code Entry (Before Game 1)

### Pre-Game Security Code Setup

* Player must **enter their chosen 6-digit numeric security code**
* Use custom numeric keypad UI (touch/mouse only, NO keyboard)
* Code entry is required before Game 1 can begin
* Store entered code in Zustand / Context for later verification
* Once code is entered and saved, **Game 1 starts automatically** (no manual "Start" button)

---

## 🔎 Security Code Verification (After Game 2)

### Flow: Game 2 End → Verification → Results

When Game 2 ends, player must re-enter their security code to view results.

### Step 1: Code Verification

* Show security code verification screen immediately after Game 2 ends
* Player must re-enter the 6-digit security code they entered before Game 1
* Use custom numeric keypad UI (touch/mouse only, NO keyboard)
* Max 2 attempts to enter correct code

### Step 2: Verification Outcomes

**If code is CORRECT:**
* Show the results page immediately (automatic transition)
* No additional steps required

**If code is WRONG (after 2 failed attempts) OR user clicks "Forgot Code?":**
* Show punishment flow:
  * Message: **"Recite 5 Hail Marys to continue"**
  * 5 large checkboxes:
    * Hail Mary 1 → 5
  * Continue button activates only when all checked
* After punishment is completed, show the results page

---

## 🏁 Final Results Screen

### Display Information

* Show:

  * Player Name
  * Region
  * Game 1 Score
  * Game 2 Score
  * Total Score

### Automatic Score Submission

* **Score is automatically saved to Supabase database** when the results page is displayed
* Save to `players` table with: name, region, score (total score), created_at
* No manual "Submit Score" button required
* Handle submission errors gracefully (show error message if save fails, but still display results)

### Navigation Options

* Buttons:

  * **Play Again** - Resets game and returns to Player Registration
  * **View Leaderboard** - Navigates to leaderboard page (`/score`)

### State Management

On navigation away:

* Reset all game state
* Clear store/context

---

## 🏆 Live Leaderboard (`/score`)

* Supabase live fetch
* Sorted by total score
* Fields:

  * Rank
  * Name
  * Region
  * Score
* Manual reset (admin only)

---

## 🗄 Supabase (Single Table Only)

### Database Purpose

The database should **only be used for leaderboard functionality**. All game questions, saint image-name pairs, and emoji Bible story questions must be stored directly in the frontend application code as JavaScript/TypeScript objects or constants. **No game data (questions, answers, game content, or Saint images) should be stored in the database.**

### Single Table Schema

**Table Name:** `players`

**Columns:**
* `id` (auto-generated primary key)
* `name` (string) - Player name captured via voice input from the user
* `score` (number) - The player's total game score
* `region` (string) - One of India's 28 states, selected from a dropdown/select input
* `created_at` (timestamp, auto-generated)

**Note:** This is the only table needed. All game questions and content are stored in frontend code, not in the database.

---

## 📦 Data Architecture

### Image Storage Location

**Saint Images (Game 1):**
* Saint images stored in **`/public/images/saints/`** directory
* Image format: **PNG** (preferred for transparency and quality)
* Example path: `/public/images/saints/peter.png`

### Data Structure Examples

**Saint Pairs (Game 1):**
```typescript
const saints = [
  { 
    id: 1,
    name: 'Saint Peter', 
    image: '/images/saints/peter.png' 
  },
  { 
    id: 2,
    name: 'Saint Francis of Assisi', 
    image: '/images/saints/francis.png' 
  },
  // ... more saints (10 total)
];
```

**Bible Story Questions (Game 2):**
```typescript
const questions = [
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
  // ... 5 more questions (6 total)
];
```

**Important Notes:**
* All game data (saints, questions) stored in **frontend code** (TypeScript/JavaScript constants)
* **No database queries** for game content
* Only the `players` table in Supabase is used for leaderboard functionality

---

## 🎨 UI / UX Requirements

* Bright, joyful Catholic aesthetic
* Large cards
* Smooth flips & animations
* Mobile + tablet friendly
* Projector-safe leaderboard
* Clear feedback (green/red)
* Saint images must be clearly visible and recognizable on image cards
* Saint names must be clearly readable with appropriate font size on name cards

---

## 🚫 Constraints

* No keyboard input
* No dummy backend
* Supabase env values provided externally
* No auth flow
* No extra tables

---

## ✅ End Result

A **complete, production-ready church event game** with:

* 2 fun games
* 180s gameplay
* Memory + knowledge testing
* Security verification
* Punishment flow
* Live leaderboard
* One-table Supabase backend

---


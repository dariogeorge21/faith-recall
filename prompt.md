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

## 🧠 GAME 1 — *Saints & Images Memory Match*

### Core Concept

A **memory matching game** where players match **Saint images/photos** with their corresponding **Saint names**. One side displays Saint images (visual representations), and the other side displays Saint names as text.

---

### Data Set (Fixed Content)

Use the following saint image-name pairs (stored in frontend application code as a JavaScript/TypeScript constant):

| Saint                     | Image Reference                    |
| ------------------------- | ---------------------------------- |
| Saint Peter               | Image URL/path for Saint Peter    |
| Saint Sebastian           | Image URL/path for Saint Sebastian|
| Saint Francis of Assisi   | Image URL/path for Saint Francis  |
| Saint Thérèse of Lisieux  | Image URL/path for Saint Thérèse  |
| Saint Matthew             | Image URL/path for Saint Matthew  |
| Saint Mark                | Image URL/path for Saint Mark     |
| Saint Luke                | Image URL/path for Saint Luke     |
| Saint John the Evangelist | Image URL/path for Saint John     |
| Saint Paul                | Image URL/path for Saint Paul     |
| Saint Joseph              | Image URL/path for Saint Joseph   |

**Note:** Each Saint should have an associated image/photo file (stored in the frontend application's assets or referenced via URL). The image cards display these visual representations, while the name cards display the Saint names as readable text.

---

### Gameplay Flow

1. **Initial Display:** All cards on both sides are **revealed briefly** (approximately 1 second) to allow players to memorize positions
2. **Shuffle & Hide:** Cards are shuffled and then hidden/flipped face-down
3. **First Selection:** Player clicks/taps to choose **ONE card from EITHER side** (image side OR name side)
4. **Dynamic Reveal Logic:**
   * If player selects a card from the **image side** → Reveal/display **ALL cards on the name side** (show all Saint names)
   * If player selects a card from the **name side** → Reveal/display **ALL cards on the image side** (show all Saint images)
   * The selected card remains highlighted/selected
5. **Second Selection:** Player then selects the matching card from the now-revealed opposite side
6. **Validation:**
   * Check if the two selected cards correctly match (Saint image ↔ corresponding Saint name)
   * **Correct match** → cards lock & glow green, remove/mark both cards as matched
   * **Incorrect match** → brief red shake, hide cards again and continue
7. **Repeat:** Continue until all pairs are matched or time runs out

---

### Scoring (Game 1)

* Scoring is based on **time to solve** each match
* Correct match: + points (amount depends on how quickly the match was made)
* Faster match = higher score (shorter time = more points)
* Consecutive correct matches → combo multiplier
* Wrong match → small penalty
* Score must vary enough to avoid ties

---

### Time

* Timer: **90 seconds**
* Auto move to Game 2 when time ends

---

## 🧠 GAME 2 — *Emoji Bible Story Finder*

### Core Concept

Players identify **Bible stories represented using emojis**, answering **MCQ questions** under time pressure.

**Note:** All emoji Bible story questions and their multiple-choice options must be stored in the frontend application code as a JavaScript/TypeScript object or constant.

---

### Gameplay Flow

* Timer: **90 seconds**
* Each question:

  * Emoji sequence representing a Bible story
  * 4 multiple-choice options
  * One correct answer
* Player taps answer (touch/mouse only)

---

### Example

```
🌊 ➗ ➡️ 🚶‍♂️
What is the story?

A. Jonah and the Whale  
B. Moses parts the Red Sea ✅  
C. Noah’s Ark  
D. Jesus Walks on Water
```

---

### Scoring (Game 2)

* Scoring is based on **time to solve** each question
* Correct answer → points (amount depends on how quickly the answer was selected)
* Faster response → higher score (shorter time = more points)
* Wrong answer → no points (no hard penalty)
* Difficulty scaling internally

---

## 🧮 Final Scoring System

* Total Score = Game 1 Score + Game 2 Score
* Both games use **time-based scoring** (faster solutions earn more points)
* Time-weighted formula ensures speed is rewarded
* Non-linear formula to prevent ties
* Speed + accuracy both matter

---

## 👤 Player Input (Before Game Start)

* Name → selectable UI (NO keyboard)
* Region → **All 28 Indian States**
* Validate before proceeding

---

## 🔐 Security Feature (Same as Previous Game)

### Security Code Generation

* Generate **random 6-digit numeric code**
* Show message: **“Remember this code!”**
* Large typography
* Display for **minimum 5 seconds**
* Animate countdown:
  **5 → 4 → 3 → 2 → 1 → 0**
* Store in Zustand / Context

---

## 🔎 Post-Game Verification (`/verify`)

### Step 1: Code Check

* Numeric keypad UI (custom)
* Max 2 attempts

### Step 2: Punishment Flow

If failed twice OR user clicks **Forgot Code?**:

* Message:
  **“Recite 5 Hail Marys to continue”**
* 5 large checkboxes:

  * Hail Mary 1 → 5
* Continue button activates only when all checked

---

## 🏁 Final Results Screen

* Show:

  * Player Name
  * Region
  * Game 1 Score
  * Game 2 Score
  * Total Score
* Buttons:

  * **Play Again**
  * **View Leaderboard**

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


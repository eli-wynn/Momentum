# Momentum

A modern, offline-first productivity desktop app built with Tauri and React. Momentum combines task management, note taking, a Pomodoro timer, and spaced repetition flashcards into a single clean interface — no subscriptions, no cloud, no tracking. Everything lives on your machine.

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange)
![React](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

- [Features](#features)
- [Download](#download)
- [Getting started](#getting-started)
- [Usage guide](#usage-guide)
  - [Tasks](#tasks)
  - [Notes](#notes)
  - [Pomodoro timer](#pomodoro-timer)
  - [Flashcards](#flashcards)
- [Importing flashcard decks](#importing-flashcard-decks)
  - [Deck JSON format](#deck-json-format)
  - [Using AI to create decks](#using-ai-to-create-decks)
- [Tech stack](#tech-stack)
- [Local development](#local-development)
- [Building from source](#building-from-source)
- [Contributing](#contributing)

---

## Features

### Tasks
- Create, complete, and delete tasks
- Tasks are separated into active and completed sections
- All data persists locally — survives app restarts

### Notes
- Notion-style note creation — click anywhere to start writing
- Searchable note sidebar with fuzzy search (tolerates typos)
- Notes sorted by last modified date
- Instant autosave — no save button needed

### Pomodoro timer
- Classic 25/5 minute work and break cycles
- Automatic long break after every 4 sessions
- Desktop notifications when a session ends
- Background white noise options — rain, ocean, white noise, brown noise
- Session history tracked for the current app session
- Timer continues running when you switch to other tabs

### Flashcards
- Create and manage multiple decks
- Add, edit, and delete cards within any deck
- **Full deck study mode** — go through every card with 1–5 self-rating
- **Spaced repetition study mode** — SM-2 algorithm surfaces cards at optimal intervals
- Import and export decks as JSON files
- Per-deck progress tracking — mastered percentage and due card count

---

## Download

Head to the [Releases](../../releases) page and download the latest version for your platform:

| Platform | File |
|---|---|
| Windows | `momentum-app_x.x.x_x64-setup.exe` |
| macOS | `momentum-app_x.x.x_x64.dmg` |

No installation required on Windows — just run the `.exe`.

---

## Getting started

1. Download the installer for your platform from the [Releases](../../releases) page
2. Run the installer
3. Launch Momentum
4. Your data is stored locally in your system's app data directory — no account needed

---

## Usage guide

### Tasks

- Type a task in the input bar and press **Add** or hit `Enter`
- Click the circle on the left of a task to mark it complete
- Hover over a task to reveal the **Delete** button
- Completed tasks appear in a separate section below active ones

### Notes

- Click anywhere on the Notes page to create a new note
- Type a title at the top and your content below — both autosave as you type
- Use the **sidebar** on the left to browse and search your notes
- The search bar supports fuzzy matching — typing `physcs` will still find `physics`
- Use the **copy** button on a note to duplicate it
- Toggle the notes sidebar with the **≡** button at the top

### Pomodoro timer

- Press **Start** to begin a 25-minute focus session
- The timer runs in the background — you can switch to Tasks or Notes and it keeps going
- When a session ends a desktop notification fires and the timer auto-advances to a break
- Use **Skip** to move to the next phase early
- Use **Reset** to restart the current phase
- Toggle **Notifications** with the bell icon in the bottom right
- Select a **White noise** track from the dropdown — it plays during focus sessions and pauses on breaks
- Session history appears in the bottom left — colour coded by phase

### Flashcards

- Create a deck by typing a title in the input and clicking **New Deck**
- Click a deck to open it and start adding cards
- Each card has a **front** (question) and **back** (answer)
- To study: click **Study All** to go through every card, or **Study Due Cards** to use spaced repetition
- After viewing a card's answer, rate yourself from **1 (blackout)** to **5 (perfect)**
- The spaced repetition algorithm schedules cards further apart the better you know them
- Hover over a card to reveal **edit** and **delete** buttons
- The ease factor badge on each card shows how well it is known — green means mastered

---

## Importing flashcard decks

Momentum supports importing and exporting decks as JSON files. This makes it easy to share decks, back them up, or create them with the help of an AI. But the import system relies on exact JSON file formatting to work correctly.

### Deck JSON format

Below is the exact format Momentum expects when importing a deck. You can copy this template and use it to create your own decks manually or via an AI assistant.

```json
{
  "id": 1,
  "title": "Your Deck Title",
  "dateModified": 1714392000000,
  "cards": [
    {
      "id": 1,
      "front": "What is the question?",
      "back": "This is the answer.",
      "easeFactor": 2.5,
      "repetitions": 0,
      "interval": 0,
      "dueDate": 1714392000000
    },
    {
      "id": 2,
      "front": "Another question?",
      "back": "Another answer.",
      "easeFactor": 2.5,
      "repetitions": 0,
      "interval": 0,
      "dueDate": 1714392000000
    }
  ]
}
```

**Field reference:**

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique identifier — Momentum reassigns this on import, any number works |
| `title` | string | The name of the deck shown in the deck list |
| `dateModified` | number | Unix timestamp in milliseconds — use `Date.now()` or any recent timestamp |
| `cards` | array | Array of card objects |
| `cards[].id` | number | Unique card identifier — reassigned on import, any number works |
| `cards[].front` | string | The question or prompt shown face-up |
| `cards[].back` | string | The answer revealed when the card is flipped |
| `cards[].easeFactor` | number | SM-2 ease factor — always start new cards at `2.5` |
| `cards[].repetitions` | number | How many times the card has been reviewed — start at `0` |
| `cards[].interval` | number | Days until next review — start at `0` |
| `cards[].dueDate` | number | Unix timestamp when the card is next due — set to `Date.now()` to make it immediately available |

> **Note:** When importing, Momentum automatically reassigns all `id` values to avoid clashes with existing decks. You don't need to worry about id uniqueness across files.

---

### Using AI to create decks

You can use any AI assistant (ChatGPT, Claude, Gemini etc.) to generate/format a deck from any source material. Copy the prompt below, replace the placeholder text, and paste the output directly into a `.json` file to import.

---

**Prompt to copy:**

```
Please create a Momentum flashcard deck from the following content. 
Format the output as a single valid JSON object matching this exact structure:

{
  "id": 1,
  "title": "Deck title here",
  "dateModified": 1714392000000,
  "cards": [
    {
      "id": 1,
      "front": "Question here?",
      "back": "Answer here.",
      "easeFactor": 2.5,
      "repetitions": 0,
      "interval": 0,
      "dueDate": 1714392000000
    }
  ]
}

Rules:
- Each card should have one clear question on the front and a concise answer on the back
- Use sequential ids starting from 1
- Set easeFactor to 2.5, repetitions to 0, interval to 0, and dueDate to 1714392000000 for all cards
- Output only the raw JSON with no markdown code fences, no explanation, nothing else

Content to turn into flashcards:
[PASTE YOUR NOTES, TEXTBOOK CONTENT, OR TOPIC HERE]
```

---

Save the AI's output as a `.json` file, then in Momentum click **Import deck** on the Flashcards page and select the file.

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop framework | [Tauri 2](https://tauri.app) |
| Frontend | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite](https://vitejs.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| State management | [Zustand](https://zustand-demo.pmnd.rs) |
| Persistence | [@tauri-apps/plugin-store](https://github.com/tauri-apps/tauri-plugin-store) |
| Audio | [Howler.js](https://howlerjs.com) |
| Icons | [Font Awesome](https://fontawesome.com) |
| Spaced repetition | SM-2 algorithm |

---

## Local development

**Prerequisites:**
- [Node.js 18+](https://nodejs.org)
- [Rust](https://rustup.rs)
- [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload (Windows only)

**Setup:**

```bash
# Clone the repo
git clone https://github.com/yourusername/momentum-app.git
cd momentum-app

# Install dependencies
npm install

# Start the dev server
npm run tauri dev
```

The app window will open automatically. Changes to the React frontend hot-reload instantly. Changes to Rust code in `src-tauri` trigger a recompile.

---

## Building from source

```bash
npm run tauri build
```

The compiled binary will be in `src-tauri/target/release/bundle/`. This produces a `.exe` installer on Windows, `.dmg` on macOS, and `.AppImage` + `.deb` on Linux.

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a pull request

Please keep PRs focused — one feature or fix per PR makes review much faster.

---

## License

MIT — do whatever you want with it.

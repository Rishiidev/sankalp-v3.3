
# 📿 Sankalp v3.3

**Sankalp** is a privacy-first, Gamified Digital Spiritual Practice Application. Built as a Progressive Web App (PWA) with native mobile capabilities via Capacitor, it empowers users to maintain their daily discipline, track their progress, and immerse themselves in their Sadhana.

Sankalp blends the ancient wisdom of Vedic practices with modern, high-fidelity app mechanics—featuring physical-button mala counting, offline-first journaling, and a dynamic "Cosmic Context" engine that shifts the app's theme based on real-time astrological alignments.

---

## 🌟 Core Features

### 🤲 "God Mode" Physical Mala Counter
A fully immersive, screen-free chanting experience.
- **Hardware Integration:** Use your device's physical volume buttons to count mala beads (`@capgo/capacitor-volume-buttons`).
- **High-Fidelity Haptics:** Experience the physical sensation of a wooden bead slipping through your fingers with native tactile feedback (`@capacitor/haptics`).

### 🌌 Cosmic Context Engine
Your app lives in the celestial calendar.
- **Panchang Integration:** Uses offline `panchang-ts` to calculate the current Tithi and festivals based on your local time.
- **Dynamic Theming:** Opt into the "Cosmic (Auto)" theme to watch the UI automatically shift colors for auspicious days (e.g., pure white/silver for *Ekadashi*, deep cosmic ash for *Shivratri*, pitch black for *Amavasya*).

### 📈 Gamified Sadhana
- **XP & Leveling:** Earn XP for completing daily goals, chanting, breathing exercises, and journaling. Progress through spiritual ranks from *Balak* to *Mahaveer*.
- **Streak Tracking:** Stay disciplined with automatic streak management.

### 🧘 Practice Toolsuite
- **Focus Timer & Breathing:** Built-in tools with visual ambient ripples and soothing soundscapes for meditation.
- **Custom Audios & Mantras:** Add your own YouTube tracks, record local audio, and build a personalized library of mantra presets.
- **Chant Challenges:** Set goals (e.g., 10,000 Chants of Ram Naam by a deadline) and visually track your progress over time.

### 🔒 100% Privacy-First & Offline
- **No Cloud, No Servers:** Everything is stored securely on your device using IndexedDB. No accounts, no data harvesting.
- **Zustand State:** Lightning-fast state management combined with IndexedDB for seamless session resilience.

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Motion (for beautiful micro-animations)
- **State & Storage:** Zustand + `idb` (IndexedDB)
- **Native Bridge:** Capacitor 8
- **Astrology Engine:** `panchang-ts`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Run Locally (Web/PWA)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishiidev/sankalp-v3.3.git
   cd sankalp-v3.3
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

### 📱 Build for Mobile (Native App)
Sankalp uses Capacitor to export as a native iOS and Android application.

1. Ensure you have Xcode (for iOS) or Android Studio (for Android) installed.
2. Build the web assets:
   ```bash
   npm run build
   ```
3. Sync Capacitor plugins and assets:
   ```bash
   npx cap sync
   ```
4. Open the native IDE to compile:
   ```bash
   npx cap open ios
   # OR
   npx cap open android
   ```

---

## 🧪 Development & Quality Checks

- **Type-Check:** `npm run lint` (runs `tsc --noEmit`)
- **Unit Tests:** `npm test` (runs pure-TS validation tests)
- **Generate PWA Assets:** `npm run generate:pwa-assets`

---

*Made with devotion and discipline.* 🙏

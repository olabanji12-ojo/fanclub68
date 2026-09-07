# fanclub68

SBOBET & SV388-Style Anti-Fraud Sportsbook & Live Arena UI for Fanclub68.

Built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## 🚀 Key Features

- **Exact SBOBET Visual Theme & Palette**:
  - Royal blue header (`#0B4DA2`), light gray arena canvas (`#F0F2F5`), crisp white odds cards, and negative handicap odds highlighted in red.
  - Multi-language switcher: Tiếng Việt (default) & English with real-time reactive labels.
  - GMT+7 timezone formatting for live and scheduled matches.

- **5 Dedicated Reference Views (Screenshots WA0009 - WA0013)**:
  - **Bóng Đá Live (WA0009)**: Real-time matches with scoreboards, Handicap (HDP), Over/Under (Tài/Xỉu), 1X2, and expandable submarket accordions (Odd/Even, Correct Score, Total Corners, Fast Goals, Anytime Goalscorer).
  - **Quần Vợt ATP (WA0010 & WA0013)**: ATP US Open live match center with point-by-point live telemetry, Set 1/2/3 micro-markets, total games handicap, and locked deuce odds.
  - **Liga Portugal (WA0011)**: League-specific tournament odds board with collapsible table accordions and match-state pills.
  - **Hôm Nay Extended Sub-Markets (WA0012)**: 18 extended pre-match markets (Half-Time/Full-Time `HT/TT`, First/Last Goal `Bàn Thắng Đầu/Cuối`, Double Chance `Cơ Hội Kép`, Corners 1X2, etc.).

- **SBOBET Light Theme Live Arenas**:
  - **Đá Gà Thomo (SV388)**: Live cockpit stream arena with Meron/Wala odds table, arena logs, and bet ticket controls.
  - **Tài Xỉu MD5**: Live dice shaker bowl, MD5 hash verification, and dynamic Tai/Xiu probability bets.
  - **Xóc Đĩa 3D**: Traditional 4-coin plate shaker with Even/Odd (Chẵn/Lẻ) and four-red/four-white sub-markets.
  - **4-Grid Multi-Table Modal**: Clean light popup allowing simultaneous real-time monitoring of all 4 games.

- **Anti-Fraud & Bet Builder**:
  - **Slide-over Bet Slip Drawer**: Enforces 300-point hard cap per ticket and 8-second live anti-latency delay countdown with status badges.
  - **Trình Tạo Cược (Bet Builder)**: Quick popular combo builder with golden-yellow CTA.

- **Mobile Responsive Design**:
  - Native iOS/Android viewport with `viewport-fit=cover` and safe-area padding.
  - Mobile bottom navigation bar with Stats (📊), TV (📺), Pitch (⚽), and submarket counter pills (`[13 -]`, `[17 -]`, `[23 -]`).

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Run development server (Port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

This repository is ready for deployment on Vercel, Netlify, Cloudflare Pages, or Docker/VPS:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Node.js 18+ / 20+

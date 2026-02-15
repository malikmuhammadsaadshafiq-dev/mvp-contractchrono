<div align="center">

# ContractChrono

**Extracts critical dates, payment deadlines, and renewal clauses from contract PDFs using AI and generates timeline visualizations with automated calendar reminders.**

![Next.js](https://img.shields.io/badge/Next.js-333?style=flat-square) ![API Routes](https://img.shields.io/badge/API%20Routes-333?style=flat-square)
![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=flat-square)
![Type](https://img.shields.io/badge/Type-Web%20App-blue?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-14%2F14-brightgreen?style=flat-square)

</div>

---

## Problem

Small business owners miss contract deadlines (renewals, deliverables, payment terms) because they're buried in dense PDFs, leading to auto-renewals or late fees.

## Who Is This For?

Small business owners, freelancers, and operations managers who need to track multiple vendor contracts and client agreements without reading hundreds of pages.


## Inspiration

This product was inspired by real user discussions and pain points discovered on Reddit communities including r/SideProject, r/startups, r/SaaS, and r/AppIdeas.


## Features

- **PDF parsing server-side using pdf-parse or OCR to extract text from scanned documents**
- **LLM extraction of date entities with classification (Payment Due, Termination Window, Delivery Date) using few-shot prompting**
- **Generates interactive timeline with date math calculations (30 days before renewal) and exports .ics files to Google/Outlook Calendar**

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js | Core dependency |
| API Routes | Core dependency |
| Kimi K2.5 (NVIDIA) | AI/LLM integration |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/malikmuhammadsaadshafiq-dev/mvp-contractchrono.git
cd mvp-contractchrono
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Core Workflows

**1. PDF parsing server-side using pdf-parse or OCR to extract text from scanned documents**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time

**2. LLM extraction of date entities with classification (Payment Due, Termination Window, Delivery Date) using few-shot prompting**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time

**3. Generates interactive timeline with date math calculations (30 days before renewal) and exports .ics files to Google/Outlook Calendar**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time

### AI Features

This app uses **Kimi K2.5** via NVIDIA API for intelligent processing.

To use AI features, add your NVIDIA API key:
```bash
# Create .env.local file
echo "NVIDIA_API_KEY=nvapi-your-key" > .env.local
```

Get a free API key at [build.nvidia.com](https://build.nvidia.com)


## Quality Assurance

| Test | Status |
|------|--------|
| Has state management | ✅ Pass |
| Has form/input handling | ✅ Pass |
| Has click handlers (2+) | ✅ Pass |
| Has demo data | ✅ Pass |
| Has loading states | ✅ Pass |
| Has user feedback | ✅ Pass |
| No placeholder text | ✅ Pass |
| Has CRUD operations | ✅ Pass |
| Has empty states | ✅ Pass |
| Has responsive layout | ✅ Pass |
| Has search/filter | ✅ Pass |
| Has tab navigation | ✅ Pass |
| Has data persistence | ✅ Pass |
| No dead links | ✅ Pass |

**Overall Score: 14/14**

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   └── components/       # Reusable UI components
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — use freely for personal and commercial projects.

---

<div align="center">

**Built autonomously by [NeuraFinity MVP Factory](https://github.com/malikmuhammadsaadshafiq-dev/NeuraFinity)** — an AI-powered system that discovers real user needs and ships working software.

</div>

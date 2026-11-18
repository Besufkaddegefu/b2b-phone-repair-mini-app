# B2B Phone Repair Mini App

Telegram Mini App for the B2B Phone Repair Parts Marketplace.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **@telegram-apps/sdk** + **@telegram-apps/bridge** for Telegram integration
- **Zustand** for state management
- **Axios** for API calls
- **React Router** for navigation

## Project Structure

```
mini-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ListingCard.tsx
│   │   └── SearchBar.tsx
│   ├── pages/          # Page components
│   │   ├── Catalog.tsx
│   │   └── ListingDetail.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── index.ts
│   ├── lib/            # Utilities & API client
│   │   ├── api.ts
│   │   ├── telegram.ts
│   │   └── utils.ts
│   ├── store/          # Zustand store
│   │   └── index.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Features

- **Visual Catalog**: Grid/list view with infinite scroll
- **Search & Filter**: Category, brand, model search
- **Listing Detail**: Full-screen image gallery, seller info, contact button
- **Telegram Integration**: initData auth, haptic feedback, theme params
- **Responsive**: Mobile-first, safe area support
- **Offline-ready**: Optimistic UI updates

## Development

```bash
cd mini-app
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Telegram Integration

1. Create a bot with @BotFather
2. Set up Mini App URL in BotFather: `/setmenubutton`
3. Configure `VITE_API_BASE_URL` to point to your backend
4. The app uses `X-Telegram-Init-Data` header for authentication

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## Deployment

Deploy the `dist/` folder to any static hosting:
- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

Then update your bot's Mini App URL to the deployed URL.
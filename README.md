# Product Dashboard 🛒

A Vite + React single-page application for managing products using the DummyJSON API (https://dummyjson.com). Built to demonstrate SPA patterns, state management, forms with validation, and robust data fetching.

---

## Project Overview

This Product Dashboard is a product management SPA that showcases:

- User authentication (login/logout) using DummyJSON auth endpoints.
- Protected routes with React Router (redirects to login when unauthenticated).
- Product listing with TanStack Query (React Query) for fetching and caching.
- Add / Edit product forms using React Hook Form + Zod validation.
- Global state management with Zustand for user session, cart, and local product additions.
- Search and filter by category and price.
- Shopping cart with add/remove/update quantity and persisted cart state.
- Responsive UI using Tailwind CSS and Shadcn components.
- Smooth animations via Framer Motion.

---

## Features Implemented ✅

- **Authentication**: Login/logout using DummyJSON auth endpoints; session persisted in a Zustand store.
- **Protected Routes**: `ProtectedRoute` component redirects unauthenticated users to the login page.
- **Product Listing**: `useProducts` + TanStack Query for fetching products and categories; caching and staleTime configured.
- **Search & Filters**: Search, category filters, and price range filtering available in the dashboard.
- **Product CRUD (Local + API)**: Create/Edit product UI with validation (Zod). Local products are persisted in `productStore` (useful for demo / offline adds).
- **Product Image Upload**: Image preview support in the product form (client-side preview using FileReader).
- **Shopping Cart**: Add/remove/update quantity, totals calculation, and persisted cart using `useCartStore` with Zustand `persist`.
- **Checkout**: Checkout form with React Hook Form and Zod validation for shipping/payment (demo flow).
- **UI & Animations**: Tailwind + Shadcn UI components and Framer Motion for subtle UI transitions.

---

## Tech Stack & Libraries 🔧

- Framework: **Vite** + **React** (TypeScript)
- Data fetching: **@tanstack/react-query** (React Query)
- State management: **Zustand** (+ persist middleware)
- Forms & validation: **react-hook-form**, **zod**, **@hookform/resolvers**
- Styling & UI: **Tailwind CSS**, **Shadcn UI components**
- Animations: **Framer Motion**
- Icons: **Lucide React**

---

## Quick Start / Setup

1. Clone the repo:

```bash
git clone https://github.com/alvin-dennis/Product-Dashboard.git
cd Product-Dashboard
```

2. Install dependencies:

```bash
# bun
bun install
```

3. Set environment variables (in `.env` or your environment):

```bash
# Use API base URL
NEXT_PUBLIC_API_URL=
```

4. Run development server:

```bash
bun run dev
# then open http://localhost:5173 (Vite default)
```

5. Build / Preview:

```bash
bun run build
```

---

## Architecture & Approach 🏗️

- **Single Responsibility Components**: UI is split into small, focused components (cards, filters, forms) to keep code modular and testable.
- **Data Layer**: TanStack Query handles server state, caching, and background refetching; custom hooks (e.g., `useProducts`, `useCategories`) encapsulate fetch logic.
- **Client State**: Zustand is used for ephemeral and persisted client state (auth session, cart items, local products). Persisted stores are namespaced and partialized for privacy (tokens not exposed unnecessarily).
- **Forms**: React Hook Form provides performant uncontrolled form handling; Zod provides schema validation with helpful errors.
- **UX**: Shadcn components + Tailwind are used for consistent UI; Framer Motion adds smooth transitions.

---

## Challenges & Solutions ⚠️

- Handling form validation and file preview: solved by combining React Hook Form with Zod for deterministic validation and FileReader for image previews.
- Auth + persistent session: used a persisted Zustand store to keep the user session across reloads while keeping API calls centralized.
- Balancing client-only product additions with server-sourced products: local products are stored in the `productStore` and merged client-side with server data where appropriate for the UI.

---

## Assumptions & Areas for Improvement 💡

- Assumes DummyJSON is available and stable (would add retry/backoff for production resilience).
- Local product additions are client-side only; for a full Product CRUD experience, these would be synced to a backend or a mock server.
- No optimistic server updates are implemented for cart operations—this would be a good next step to improve perceived performance.
- Add integration and e2e tests (Cypress / Playwright) and CI checks before deployment.

---

## Deployment 🚀

- Deploy to Vercel (recommended) or any static hosting that supports Vite builds.
- After deploying, update this README with your Vercel URL and the GitHub repo link used for submission.

---

## Scripts

- `bun run dev` – Start dev server
- `bun run build` – Build for production
- `bun run preview` – Preview production build locally
- `bun run lint` – Run ESLint

---

### License

This project is open source and available under the MIT License.

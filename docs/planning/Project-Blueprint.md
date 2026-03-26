# Project Blueprint - E-Commerce Product Explorer

## Objective

Build a complete React e-commerce frontend using Fake Store API, covering product discovery, filtering/sorting, product details, wishlist, cart, and checkout summary.

## Product Scope

- Product listing with responsive grid.
- Product details page.
- Search with debounce.
- Category tabs and filters.
- Price range filters.
- Sorting options.
- Wishlist management.
- Cart management with quantity updates.
- Checkout summary (subtotal, tax, total).

## Tech Stack

- React + Vite
- React Router DOM
- Axios
- React Icons
- React Toastify
- React Hook Form + Yup
- Swiper
- Framer Motion
- UUID

## App Architecture

- `context/CartContext` for cart and wishlist global state.
- `hooks/useProducts` for product fetching and derived data.
- `hooks/useDebounce` for search optimization.
- `services/api.js` for API requests.
- Pages layer for route-level orchestration.
- Components layer for reusable UI.

## Routes

- `/` Home
- `/products` Products listing
- `/products/:id` Product details
- `/wishlist` Wishlist
- `/cart` Cart
- `/checkout` Checkout summary

## State Boundaries

- Global state:
  - cart items
  - wishlist items
  - cart totals
- Page/local state:
  - search text
  - selected category
  - selected price range
  - sort option
  - loading and error states

## Data Contracts

- Product:
  - id, title, price, description, category, image, rating
- Cart item:
  - productId, quantity, price
- Wishlist item:
  - productId

## Quality Gates

- Mobile-first responsive behavior.
- Graceful API loading/error handling.
- Persistent cart/wishlist using localStorage.
- Smooth but restrained animations.
- Basic accessibility checks (labels, focus, keyboard).

## Risks and Mitigations

- API instability:
  - add retry action and fallback empty states.
- State complexity:
  - centralize actions in context and pure utility helpers.
- UI inconsistency:
  - enforce neo-brutalist style tokens and component rules.

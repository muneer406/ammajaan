# Task Tracker

Use this checklist as the active execution tracker while building.

## Phase 0 - Setup

- [x] Initialize Vite React app
- [x] Install required packages
- [x] Create folder structure (`components`, `pages`, `context`, `hooks`, `services`, `utils`)
- [x] Create route skeleton and layout shell
- [x] Add base neo-brutalist tokens and reset styles

## Phase 1 - Products Data and Listing

- [x] Create axios API client
- [x] Create `useProducts` hook
- [x] Fetch products and categories
- [x] Add loading and error handling
- [x] Build `ProductCard`
- [x] Build `ProductGrid`
- [x] Implement responsive grid breakpoints

## Phase 2 - Search, Filters, Sort

- [x] Build `useDebounce`
- [x] Add search bar with debounce
- [x] Add category tabs
- [x] Add category filter control
- [x] Add price range filter control
- [x] Add sort control
- [x] Integrate combined filter/sort pipeline

## Phase 3 - Product Details

- [x] Create product details route and page
- [x] Fetch product by id
- [x] Build image gallery (Swiper)
- [x] Render details content
- [x] Add cart/wishlist action buttons

## Phase 4 - Cart and Wishlist State

- [x] Create `CartContext` provider
- [x] Add cart actions (add/remove/update quantity/clear)
- [x] Add wishlist actions (add/remove/toggle)
- [x] Persist state to localStorage
- [x] Build `useCart`
- [x] Build `useWishlist`

## Phase 5 - Cart and Checkout Pages

- [x] Build cart list UI and quantity controls
- [x] Build pricing summary card
- [x] Build checkout page
- [x] Add checkout form with react-hook-form + yup
- [x] Add subtotal/tax/total calculations

## Phase 6 - UX Polish and Reliability

- [ ] Add framer-motion transitions and page reveals
- [ ] Add toast feedback for actions
- [ ] Create empty states for products/cart/wishlist
- [ ] Create error fallback UI with retry
- [ ] Validate mobile, tablet, desktop layouts
- [ ] Accessibility pass (keyboard/focus/labels)

## Phase 7 - Final QA

- [ ] End-to-end feature verification against PRD
- [ ] Route validation for all required pages
- [ ] Validate persistence across refresh
- [ ] Final code cleanup
- [ ] Update docs with run/build instructions

# TODO: Implement Saved Generated Plans Feature

## 1. Extend Prisma Schema
- Add a `Plan` model linked to `User`
- Fields: id, userId (relation), title, description, workout JSON, mealPlan JSON, createdAt
- Run Prisma migration
- Generate Prisma client

## 2. Update Generate Plan API (app/api/generate-plan/route.ts)
- Extract logged-in user info from session/auth token
- After generating plan, save plan data to database with the userId
- Return generated plan as response

## 3. Create API to Fetch Saved Plans (e.g. app/api/plan/route.ts)
- Endpoint: GET /api/plan
- Identify logged-in user from session/auth token
- Fetch all saved plans from database for the user
- Return saved plans as JSON response

## 4. Update Plan Page (app/plan/page.tsx)
- Fetch saved plans from new API on page load
- Display saved plans in UI
- Optionally maintain option to generate new plan
- Show list/cards of saved plans with workout and meal details

## 5. Testing
- Test login flow redirects to /plan
- Test generated plans are saved in DB
- Test saved plans are fetched and displayed correctly
- Test UI and error handling

---

This plan enables users to see their saved generated plans after login.

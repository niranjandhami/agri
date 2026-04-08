# AgriLink Development TODO

## Priority Order
1. [ ] Install dependencies (Rust, Postgres)
2. [ ] Backend: PostgreSQL setup & migrations (users table)
3. [ ] Backend: Auth module (signup, login JWT)
4. [ ] Frontend: Auth pages (login, signup forms)
5. [ ] Backend: User dashboard endpoints
6. [ ] Frontend: Role-based dashboard
7. [ ] Backend: Marketplace (products CRUD)
8. [ ] Frontend: Marketplace UI
9. [ ] Backend: Inventory
10. [ ] Backend: Equipment
11. [ ] Backend: Bulk Orders
12. [ ] Full integration testing

## Setup Commands
1. winget install OpenJS.NodeJS.LTS
2. Restart VSCode/terminal
3. cd frontend && npm install && npm run dev
4. Install Rust: https://rustup.rs/
5. cd backend && cp .env.example .env
6. Install Postgres: winget install PostgreSQL.PostgreSQL
7. Create DB: createdb agrilink
8. sqlx migrate run (install sqlx-cli: cargo install sqlx-cli --no-default-features --features postgres)
9. cargo run

Auth flow working!

## Next Modules
Implement Marketplace next.

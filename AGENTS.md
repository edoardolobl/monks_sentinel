# Repository Guidelines

## Project Structure & Module Organization
- `core/`: FastAPI orchestrator (entry: `core/main.py`), coordinates analysis modules.
- `modules/module1/`: Python FastAPI service for associations (`modules/module1/main.py`).
- `modules/module2/`: TypeScript Fastify service for governance (`src/`, Jest tests under `src/__tests__/`).
- `docker-compose*.yml`: Multi-service local/dev orchestration. Each module has its own `Dockerfile`.
- `README.md`: High-level overview; see module READMEs for details.

## Build, Test, and Development Commands
- All services (Docker): `docker compose up --build` — builds and runs orchestrator + modules.
- Core (local): `pip install -r core/requirements.txt && python core/main.py` → http://localhost:8000/health
- Module 1 (local): `pip install -r modules/module1/requirements.txt && python modules/module1/main.py` → http://localhost:8001/health
- Module 2 (TS):
  - `cd modules/module2 && npm ci`
  - Dev: `npm run dev` (watches `src/main.ts`)
  - Build/Start: `npm run build && npm start`
  - Lint: `npm run lint` (auto-fix: `npm run lint:fix`)

## Coding Style & Naming Conventions
- Python: PEP 8, 4-space indent, `snake_case` for functions/vars, `PascalCase` for classes. Prefer type hints and Pydantic models for request/response schemas.
- TypeScript: follow ESLint rules; `camelCase` for functions/vars, `PascalCase` for types/classes. Keep code in `src/`; compiled output to `dist/`.
- Endpoints: keep consistent health (`/health`) and analysis routes (`/analyze/<module>`).

## Testing Guidelines
- Module 2: Jest tests live in `modules/module2/src/__tests__/`. Run with `npm test` or `npm run test:watch`.
- Python modules: add pytest tests under `tests/` or `<module>/tests/` using `test_*.py`. Keep tests fast and deterministic; mock network calls to other services.

## Commit & Pull Request Guidelines
- Commits: imperative present, scoped prefix when helpful (e.g., `core:`, `module1:`, `module2:`). Example: `module2: add governance summary and tests`.
- PRs: clear description, linked issues, test plan (commands + expected results), and notes on config changes. Update docs when behavior or APIs change.

## Security & Configuration Tips
- Don’t commit secrets or real GTM exports; use sample data (`modules/module2/test-payload.json`).
- Prefer `.env`/compose overrides for local settings; avoid hardcoding URLs. Verify CORS and ports align with compose files.
- Use health endpoints to validate services before end-to-end testing.

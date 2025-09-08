# Repository Guidelines

## Project Structure & Module Organization
- `core/` — Python gRPC orchestrator (default `:8080`).
- `modules/module1/` — Python gRPC analyzer (associations) on `:50051`.
- `modules/module2/` — TypeScript gRPC analyzer (governance) on `:50052` with Jest tests in `src/__tests__/`.
- `proto/` — `.proto` contracts. Edit here only; regenerate stubs via Makefile/scripts.
- `generated/` — language-specific codegen (Python/TS/Go). Do not edit.
- `scripts/` — protobuf helpers (e.g., `generate_protobuf.sh`).
- `templates/` — scaffolds for new modules in Python/Go/TS.
- `test_grpc_pipeline.py` — end-to-end pipeline test against running services.

## Build, Test, and Development Commands
- Protobuf: `make proto` (all languages), `make proto-python`, `make proto-clean`.
- Run stack: `docker-compose up --build` (orchestrator + modules).
- E2E test: after services are up, `python test_grpc_pipeline.py`.
- Module 2 (TS): `cd modules/module2 && npm ci && npm run build && npm test`.
- Lint/format TS: `npm run lint` and `npm run format` (module2).

## Coding Style & Naming Conventions
- Python: PEP 8, 4-space indent, type hints required, Google-style docstrings; model data with Pydantic.
- Naming: Classes `PascalCase`; functions/vars `snake_case`; constants `UPPER_SNAKE_CASE`.
- TypeScript: follow ESLint + Prettier rules; prefer explicit types; mirror patterns in `templates/typescript/`.
- Do not modify files in `generated/` or `proto/generated/`.

## Testing Guidelines
- Python: E2E via `python test_grpc_pipeline.py`. If adding unit tests, place as `test_*.py` and use pytest patterns.
- TypeScript (module2): Jest tests reside in `src/__tests__/` (or `*.test.ts`). Keep tests close to code; include edge cases.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(core): add streaming analysis`, `fix(module2): correct health check`.
- PRs must include: clear description, linked issues, steps to reproduce/verify, logs or screenshots of tests, and updated docs.
- Exclude generated diffs; regenerate locally with `make proto` before review.

## Protobuf & Configuration
- Change contracts in `proto/*.proto` only; regenerate with `make proto`.
- Use `.env.example` for environment variables (e.g., `GRPC_PORT`, `ASSOCIATIONS_GRPC_TARGET`, `GOVERNANCE_GRPC_TARGET`). Never commit secrets.

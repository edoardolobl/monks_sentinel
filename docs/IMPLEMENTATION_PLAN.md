# gRPC Plug-and-Play Orchestrator Implementation Plan

## Goals
- Pure gRPC communication end-to-end; no HTTP/REST coupling.
- Plug-and-play modules in any language without changing the orchestrator.
- Standardized protobuf contracts and predictable codegen/imports.
- Reliable builds (local and Docker) and green E2E tests.

## Non-Goals
- Web UI and drag-and-drop flows (out of scope for this plan).

## Current Snapshot (high level)
- Orchestrator (`core/`) is gRPC-based and calls module services via stubs.
- Modules: Python (`modules/module1`) and TypeScript (`modules/module2`) run gRPC servers.
- Some docs/scripts reference legacy HTTP/REST; imports use absolute paths in places.

## Phases

1) Codegen & Imports (Foundations)
- Unify generated code usage (use `generated/python` consistently).
- Remove absolute `sys.path.append` hacks; rely on packaged paths inside containers.
- Ensure containers include/generated stubs (run `make proto` during build or COPY `generated/`).
- Acceptance: `docker-compose up --build` succeeds; services start without path hacks.

2) Proto Evolution (Generic Module API)
- Add `ModuleAnalysisService` with `GenericAnalysisRequest` (container + options/selectors).
- Keep existing service definitions for backward compatibility.
- Regenerate stubs; update language templates to implement the generic service by default.
- Acceptance: a module can implement one RPC to integrate.

3) Orchestrator Plug-and-Play (Config-Driven)
- Introduce `config/modules.registry.json` listing modules (name, target, service_type, options, extractor profile).
- Orchestrator loads registry at startup and dispatches accordingly (prefer `generic`, fallback to specific services if declared).
- Acceptance: adding a module requires only editing the registry file.

4) Data Extraction Decoupling
- Default path: send full `GTMContainer` to `generic` services.
- Optional per-module extractor profiles (e.g., JSONPath) declared in registry to optimize payloads over time.
- Acceptance: existing modules keep working; new modules can start with full container and refine later.

5) Build & Packaging
- Update Dockerfiles to: copy `proto/` + run `make proto` (or copy `generated/`) and set `PYTHONPATH=/app`.
- Standardize tool versions; cache codegen where possible.
- Acceptance: clean builds on fresh clones; no local environment assumptions.

6) Tests & CI
- Fix `test_grpc_pipeline.py` (relative paths, use `gtm_container` message, remove absolute imports).
- Add smoke tests: health checks, ListModules, generic Analyze against a dummy service.
- CI workflow: `make proto` + build images + run smoke tests on PRs.
- Acceptance: CI green and reproducible locally.

7) Documentation & Cleanup
- Update README and module READMEs to gRPC-only; remove FastAPI/Fastify/REST references.
- Document registry schema and “add a new module” cookbook.
- Archive legacy docs sections; align memory notes.
- Acceptance: docs match reality; contributors can add modules without touching core.

## Risks & Mitigations
- Proto change ripple: keep legacy services; migrate gradually.
- Performance with full-container payloads: start simple; add extractors when needed.
- Build fragility: generate stubs inside containers; avoid absolute paths.

## Next Steps (execution order)
1. Phase 1 (imports/codegen)
2. Phase 2 (generic proto + stubs)
3. Phase 3 (registry + dynamic dispatch)
4. Phase 6 (tests/CI hardening)
5. Phase 7 (docs cleanup)
6. Phase 4/5 optimizations as follow-ups

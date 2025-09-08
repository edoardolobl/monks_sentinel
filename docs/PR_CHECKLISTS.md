# PR Checklists: gRPC Plug-and-Play Orchestrator

This document provides detailed, phase-specific PR checklists to implement the plan without surprises. Use one PR per phase (or smaller), and include verification notes and screenshots/logs.

## Phase 1: Codegen & Imports (Foundations)

Suggested title: chore(build): unify protobuf codegen and imports

Scope
- Unify generated code paths; remove absolute sys.path hacks.
- Ensure containers have generated stubs.

Checklist
- [ ] Remove absolute `sys.path.append` usages in `core/` and modules referencing local absolute paths.
- [ ] Standardize imports to use `generated/python` package path or installed module path.
- [ ] Choose container strategy:
  - [ ] EITHER run `make proto` (or `scripts/generate_protobuf.sh`) during Docker builds, OR
  - [ ] Copy committed `generated/` tree into images.
- [ ] Update `core/Dockerfile` and `modules/module1/Dockerfile` to include stubs and set `PYTHONPATH=/app`.
- [ ] Ensure `docker-compose.yml` envs include orchestrator/module targets only (no HTTP remnants).
- [ ] Manual run: `docker-compose up --build` starts all services without import errors.

Verification
- [ ] Logs show no path import hacks.
- [ ] `grpc_health_probe` health checks pass for orchestrator, module1, module2.
- [ ] E2E `python test_grpc_pipeline.py` at least imports and connects (even before its later fix).

Rollback
- [ ] Revert Dockerfile changes and restore previous imports if blocking issues arise.

## Phase 2: Proto Evolution (Generic Module API)

Suggested title: feat(proto): add generic ModuleAnalysisService for plug-and-play modules

Scope
- Add a generic service and request.

Checklist
- [ ] Edit `proto/gtm_analysis.proto`:
  - [ ] Add `service ModuleAnalysisService { rpc Analyze(GenericAnalysisRequest) returns (ModuleResult); rpc CheckHealth(HealthRequest) returns (HealthResponse); }`.
  - [ ] Add `message GenericAnalysisRequest { string request_id = 1; gtm.models.v1.GTMContainer gtm_container = 2; map<string,string> options = 3; repeated string selectors = 4; }`.
  - [ ] Preserve existing services for backward compatibility.
  - [ ] Bump comments/version annotations where appropriate.
- [ ] Run `make proto` (or script) and ensure generated code compiles for Python and TS.
- [ ] Update `templates/python` and `templates/typescript` to show implementing the generic service by default.
- [ ] Commit regenerated stubs (if repo policy is to commit generated code) or confirm Docker builds regen reliably.

Verification
- [ ] Stubs exist for all languages in `generated/`.
- [ ] No breaking field renames/removals; reserved fields untouched.

Rollback
- [ ] Revert proto changes to prior commit; regenerate stubs.

## Phase 3: Orchestrator Plug-and-Play (Config-Driven)

Suggested title: feat(core): config-driven module registry and dynamic dispatch

Scope
- Add module registry and dynamic routing.

Checklist
- [ ] Create `config/modules.registry.json` with schema:
  ```json
  [{
    "name": "associations",
    "target": "gtm-module-associations:50051",
    "service_type": "generic|associations|governance|javascript|html",
    "capabilities": ["health"],
    "options": {"include_low_severity": "true"},
    "extractor": {"mode": "full"}
  }]
  ```
- [ ] Orchestrator loads registry at startup; validate schema; fail fast on invalid entries.
- [ ] Dispatch logic:
  - [ ] Prefer `ModuleAnalysisService.Analyze` for `service_type=generic`.
  - [ ] Fallback to specific service RPCs if declared.
  - [ ] Respect per-module `options` (map->proto where applicable).
- [ ] Update `ListModules` to read registry and perform health checks against targets.
- [ ] Add env override for registry path and per-target host/port.

Verification
- [ ] Add a sample third module entry (dummy/unavailable) and confirm health reporting differentiates available vs offline.
- [ ] Add/remove a module from registry without touching orchestrator code; analyze request runs for remaining modules.

Rollback
- [ ] Keep previous static MODULE_REGISTRY path behind a feature flag to toggle off config dispatch if needed.

## Phase 4: Data Extraction Decoupling

Suggested title: feat(core): full-container default + optional declarative extractors

Scope
- Keep modules simple initially; optimize later via registry-defined extractors.

Checklist
- [ ] Default to sending full `GTMContainer` to modules implementing the generic service.
- [ ] Support optional extractor profile in registry (e.g., `{"mode":"jsonpath","paths":{"tags":"$.containerVersion.tag[*]"}}`).
- [ ] Implement minimal JSONPath engine or adapter (deferred if not urgent) with safe fallbacks.
- [ ] Ensure governance needs (folders, notes) are included by default in `_proto_to_pydantic_gtm` conversion.

Verification
- [ ] Governance module still receives folders/notes when present.
- [ ] Associations module continues to function unchanged.

Rollback
- [ ] Disable extractor profiles and fall back to full-container requests.

## Phase 5: Build & Packaging

Suggested title: build(docker): generate and package protobuf stubs reliably

Scope
- Make builds reproducible without local stubs.

Checklist
- [ ] Update `core/Dockerfile` and `modules/module1/Dockerfile` to run `make proto` (or script) during build OR copy `generated/`.
- [ ] Ensure `proto/` is copied into build context when generating in images.
- [ ] Set `PYTHONPATH=/app`; confirm imports do not rely on absolute paths.
- [ ] Optimize layers for codegen caching (copy proto/scripts before app code).

Verification
- [ ] Fresh clone build succeeds with only Docker installed.
- [ ] Image sizes reasonable; startup logs clean.

Rollback
- [ ] Revert to copying pre-generated stubs if codegen-in-image causes issues.

## Phase 6: Tests & CI

Suggested title: test(ci): fix pipeline test and add smoke tests for gRPC

Scope
- Stabilize tests and add CI coverage.

Checklist
- [ ] Update `test_grpc_pipeline.py`:
  - [ ] Remove absolute path hacks; use relative paths/resources.
  - [ ] Build proper `AnalysisRequest` with `gtm_container` proto message.
  - [ ] Make test data path configurable.
- [ ] Add smoke test script: health checks, `ListModules`, generic analyze to a mock/dummy service when available.
- [ ] Create GitHub Actions workflow:
  - [ ] Run `make proto`.
  - [ ] Build images (core, module1, module2).
  - [ ] Start `docker-compose` and wait for health.
  - [ ] Run pipeline and smoke tests; collect logs on failure.

Verification
- [ ] CI is green on PRs; artifacts/logs attached on failures.
- [ ] Local `pytest` (if added) passes.

Rollback
- [ ] Temporarily mark CI job as optional while stabilizing.

## Phase 7: Documentation & Cleanup

Suggested title: docs: update to gRPC-only architecture and registry workflow

Scope
- Align docs with current system; remove HTTP-era guidance.

Checklist
- [ ] Update root `README.md` to gRPC-only; remove FastAPI/Fastify/REST examples.
- [ ] Update `modules/module1/README.md` and `modules/module2/README.md` to gRPC servers only.
- [ ] Add `docs/REGISTRY.md` describing registry schema and “add a module” steps.
- [ ] Note deprecations and migration status; update existing plan docs where applicable.
- [ ] Cross-check AGENTS.md for contributor guidance and keep in sync.

Verification
- [ ] Docs accurately describe how to add a module without touching core.
- [ ] New contributors can follow docs to get services running.

Rollback
- [ ] Keep archived sections or a `LEGACY.md` for HTTP references if needed.

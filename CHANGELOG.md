# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Removed
 - 2025-11-29: Removed built-in AI endpoints (`/api/ai`) and removed direct integrations with LLM providers. The project no longer stores or expects provider keys for LLMs in CI or runtime by default.

### Notes
- If you need LLM functionality in the future, integrate via an external orchestrator (e.g., n8n) using secure webhooks and rotated keys. Avoid embedding secrets in the repository.

# CI/CD release workflow

A deployment pipeline can use Okatana as the human-readable work and audit surface.

Recommended sequence:

1. Build a stable release marker such as `[release:v2026.08.30]`.
2. Search tickets for the marker before creating a new release ticket.
3. Create the ticket only if reconciliation finds no match.
4. Add CI result comments as the pipeline advances.
5. Move the ticket only after the deployment reaches the required state.
6. Add a final deployment comment.

The stable marker matters because Okatana has no idempotency key. A timed-out create must be reconciled before another create attempt.

Source example: `examples/ci-cd-release.ts`.

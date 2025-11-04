# Usability Testing Report — Part 1: Usability Test Plan

## Objectives
- Primary goals: Inform iterations for missing flows. Which are listed below : 
    - Currently no way to request credits for a completed task (credit request)
    - Currently there is no recommendations algorithm for skils matching
    - Currently there is no way of reporting users
    - CSRF protection is not implemented
- Success criteria: They are:
    - High task completion 
    - Acceptable SEQ
    - Minimal errors
- Scope includes backend: Yes

## Participants (3–4)
- Profile: University students persuing Bachelors in IT, 18–25; gender not specified (n=3)
- IDs: Participant 1, Participant 2, Participant 3
- Recruitment: In-class peer review (same topic cohort; reciprocal testing)
- Ethics: Verbal consent; anonymised IDs; no sensitive data

## Tasks
1) Authenticate (invalid → valid), logout/login
   - Pages/Files: `src/index.php`, `src/js/auth.js`
   - Success: Logged-in state visible; no blocking errors (≤2 min)

2) Update profile and verify persistence
   - Pages/Files: `src/Profile.html`, `src/js/profile.js`
   - Success: Fields save; persist after refresh (≤2 min)

3) Advertise a new skill and locate a specific skill
   - Pages/Files: `src/skills.html`, `src/js/skills.js`
   - Success: Listing visible; item findable (≤3 min)

4) Send and read a message
   - Pages/Files: `src/inbox.html`, `src/js/inbox.js`
   - Success: Message delivered/received; visible in thread (≤2 min)

5) Known gap: Attempt to request credits for a completed task
   - Expected: Document pain point and user expectations (feature missing)

## Methodology
- Protocol: Intro (1m) → consent (1m) → think‑aloud during tasks (15–20m) → SEQ per task → SUS at end (3m) → debrief (2m)
- Instruments: Short demographics (age/study area); SEQ (per task, 1–7); SUS (10 items)
- Data capture: Time‑on‑task; success/partial/fail; errors/help; observer notes; quotes/screenshots (if permitted)

## Metrics for Success
- Task completion: ≥80% success
- Time‑on‑task: T1 ≤2m; T2 ≤2m; T3 ≤3m; T4 ≤2m; T5 ≤2m; T6 (n/a)
- Error rate: Low; no critical blockers
- SEQ (1–7): Median ≥5
- SUS (0–100): ≥68 baseline

## Risks & Assumptions
- Environment: PHP/MySQL running; seeded data for messaging/transactions; test accounts available
- Known limitations: 
  - No credit request flow
  - No recommendations/sorting
  - No report mechanism
  - No CSRF


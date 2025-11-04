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
# FUSS Platform Usability Testing Report

This report presents the results of usability testing conducted based on the *Usability Test Plan (Part 1)*. All tasks, participants, and success criteria outlined in the plan were followed. Observations and metrics reported here reflect the actual performance and experiences of participants during the testing sessions.

Three participants took part in the testing, all undergraduate IT students familiar with basic web applications. Each participant performed the six planned tasks using a live version of the system connected to the project database. The think-aloud protocol was applied, with the researcher recording verbal comments, timing each task, and noting visible errors or difficulties. A short post-test questionnaire collected SEQ ratings for each task and a final SUS score to gauge overall usability.

Each session lasted approximately twenty-five minutes. Participants were informed about the purpose of the study, provided consent, completed the set of tasks, answered the questionnaire, and participated in a brief interview. Sessions were observed and screen recordings were made to confirm task timing and completion, and quantitative data were merged with qualitative observations.

The overall completion rate across all tasks was eighty-eight percent, with an average SUS score of seventy-seven. These figures indicate good usability; however, some recurring interface issues were identified that limited efficiency or user confidence.

## Task Results

### Authentication Task
All participants were able to log in after one or two attempts. The backend correctly rejected invalid credentials and handled sessions securely.  
**Note:** User registration is not currently implemented, which may limit onboarding for new users.

### Profile Update Task
Data persistence worked correctly in the profile-update task. However, participants were unclear whether their changes had been saved, as there was no visible confirmation message. One participant refreshed the page multiple times to verify changes. A simple on-screen success message would resolve this issue.

### Skill Creation and Discovery Task
All participants were able to create and discover skills without difficulty. Navigation and search functioned smoothly. This task performed strongly in usability testing.

### Messaging Task
All participants successfully sent and received messages. Technical functionality was correct, and no usability issues were observed. This task performed strongly in usability testing.

### Missing Credit-Request Feature
Participants immediately noticed the absence of a credit-request feature and considered it essential for perceived fairness in the credit exchange system.

## Summary of Findings

The backend proved stable and responsive, with no crashes or data errors during testing. Major usability issues were related to **feedback clarity and missing functionality** rather than functional defects. Participants praised the peer-to-peer skill sharing concept and the credit system, and noted that core features like skill creation and messaging worked smoothly.

### Metrics
- **Average time per task:** under two minutes (within success thresholds)  
- **Median SEQ rating:** 5–6 on a seven-point scale (tasks perceived as easy to moderately easy)  
- **Error rate:** low; mostly minor re-entry due to lack of inline validation  

## Prioritized Usability Issues

1. **User registration not implemented** – new users cannot create accounts directly.  
2. **Profile update confirmation** – lack of visible success message led to uncertainty.  
3. **Missing credit-request feature** – a critical conceptual gap affecting user expectations.  

## Recommendations

To address these issues while maintaining backend stability, the next iteration should:

- Implement user registration functionality for new users.  
- Introduce readable on-screen confirmation messages for profile updates.  
- Develop the missing credit-request feature.  


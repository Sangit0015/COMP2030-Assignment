# Appendix – Flinders University Skill Share (FUSS)


This appendix includes all the usability testing evidence gathered for the FUSS platform.
It provides the original materials, questions, results, participant observations, and screenshots that support the analysis and changes described in the main report.
There is no interpretation in this section. It serves only as factual evidence of the testing process.
---

## A. Overview of Testing Sessions

- **Participants:** 3 undergraduate IT students (familiar with basic web systems).  
- **Session Length:** Approximately 25 minutes each.  
- **Testing Environment:** Live hosted version of the FUSS web application connected to the MySQL database.  
- **Method:** Think-Aloud protocol with observation, timing, SEQ (Single Ease Question), and SUS (System Usability Scale) post-test questionnaires.  

Each participant completed seven tasks covering both front-end and backend functionality.

---

## B. Test Tasks (Script Provided to Participants)

1. Register for a new account.  
2. Log in using assigned student credentials.  
3. Update profile information (name or description).  
4. Create and search for a skill listing.  
5. Send and receive a message with another user.  
6. View credits and transaction history.  
7. Attempt to request credits for completed work.


**Observer’s Role:** record time on task, visible issues, comments, and errors.  
**Goal:** Evaluate usability of both front-end (interface clarity, navigation) and back-end (form handling, feedback) features.

---

## C. Pre-Test Questionnaire

Each participant was asked the following before beginning:

1. Have you used a web-based skill-sharing or peer service website before?  
2. How confident are you using new web applications (1–5 scale)?  
3. How often do you use sites that require login and profiles?  
4. What are your first impressions of the FUSS interface?  

All participants reported familiarity with web systems but limited experience with peer-exchange or credit-based platforms.

---

## D. Post-Test Questionnaire

After completing the tasks, participants completed two short usability measures:

**Single Ease Question (SEQ):**  
> “Overall, how easy was this task to complete?”  
> *(1 = Very difficult, 7 = Very easy)*  

**System Usability Scale (SUS):**  
> Ten standard items rated from 1–5, converted to a 0–100 score.

These measures provided the quantitative data that supported the team’s analysis.

---

## E. Quantitative Results Summary

| Participant | SUS Score | SEQ Median | Completion Rate | Avg. Time | Key Issue Identified |
|--------------|------------|-------------|------------------|------------|-----------------------|
| P1 | 77 | 6 | 100% | 1 m 45 s | Registration form not working correctly |
| P2 | 74 | 5 | 85% | 2 m 10 s | No confirmation feedback on profile update |
| P3 | 79 | 6 | 85% | 1 m 50 s | Missing credit-request feature |

**Overall Results:**  
- **Average Completion:** 90%  
- **Average SUS:** 77 (“Good usability”)  
- **SEQ Median:** 5–6 (“Easy to moderately easy”)  
- **Common Frustrations:** Missing registration backend, lack of feedback, unclear next-step functions.

---

## F. Detailed Evidence by Task

| Task | Evidence Type | Description of Finding |
|------|----------------|------------------------|
| **1. Registration** | Screenshot + Observation | Registration form failed to connect to the backend and did not store data. |
| **2. Login** | Observation | Login worked but provided no descriptive feedback for errors. |
| **3. Profile Update** | Screenshot | No visible message appeared after saving — users uncertain if changes were saved. |
| **4. Skill Creation/Discovery** | Observation | Participants could add a skill but found the navigation unclear. |
| **5. Messaging** | Screenshot | Messages sent successfully but appeared out of order in conversation threads. |
| **6. Credit Viewing** | Screenshot | Displayed raw JSON data instead of formatted information. |
| **7. Credit Request** | Observation | Entirely missing feature — testers expected it to exist. |

---

## G. Participant Think-Aloud Comments

**Participant 1:**  
> “I tried to register three times and nothing happened.”  

**Participant 2:**  
> “I clicked save on my profile, but it didn’t tell me if it worked.”  

**Participant 3:**  
> “There’s no option to request credits — that’s something users will need.”  

Additional notes:  
> “It feels like a prototype — needs clearer feedback.”  
> “The credit part looks unfinished.”  

---

## H. Screenshot Evidence Collected

The screenshots below document the actual interface problems encountered by participants.  
Each one supports the analysis of issues discussed in the Usability Testing Report.  
All images are located in `/p1-p3/ux-evaluation-part3/images/` in the GitHub repository.

> **Note:** These images reflect the real current system — not fixed versions.  
> The following section also lists proposed improvements (iteration recommendations).

### 1. Registration Page – Form Not Working
![Registration Page – Not Functional](./images/register%20page.png)
> The registration page failed to connect to the backend and did not insert user data.  
> Participants could not complete account creation.  
> **Recommendation:** Rebuild `register.php` with backend connection and user input validation.
this has been  done already.0
---

### 2. Profile Page – No Confirmation Feedback
![Profile Page – No Confirmation Message](./images/profile%20page.png)
> After saving, no message appeared to confirm success.  
> Participants refreshed the page multiple times to verify changes.  
> **Recommendation:** Add success alerts or inline confirmation banners to improve task confidence.


---

### 3. Credit Request – Missing Feature
![Credit Request Feature – Missing](./images/credits%20page.png)
> The credit-request option did not exist, leaving users unable to confirm completed exchanges.  
> **Recommendation:** Develop a credit-request system using a dedicated PHP file (`request_credit.php`) and database table to handle requests and approvals.

---

### 4. Messaging Interface – Message Order Issue
![Messaging Interface – Out of Order](./images/messaging%20interface.png)
> Messages appeared in inconsistent order.  
> **Recommendation:** Adjust backend retrieval to sort messages by timestamp.

---

### 5. Dashboard – Missing Navigation Link
![Dashboard – Missing Credit Request Button](./images/dashboard.png)
> The dashboard navigation lacked a Credit Request option.  
> **Recommendation:** Add a Credit Request button for improved flow and accessibility.

---

All screenshots were verified by the observer and saved in the team’s shared evidence folder for marking and audit purposes.

---

## I. Researcher Reflection

The FUSS platform demonstrated reliable backend performance but limited user interaction feedback.  
Users successfully completed most tasks but consistently reported confusion due to missing validation, feedback, and navigation clarity.  
Testing confirmed that the platform’s foundation was sound but lacked essential interface communication cues.  

The recommendations developed through this evaluation focus on improving user confidence and flow rather than redeveloping the entire system.  
Implementing these changes would likely raise usability ratings and enhance task efficiency.

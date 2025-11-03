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

1. Log in using your assigned student account.  
2. Update your profile information (e.g., name or bio).  
3. Create a new skill listing.  
4. Search for another student’s skill.  
5. Send and receive a message with another user.  
6. View your current credit balance and transaction history.  
7. Attempt to request credits for completed work (feature may not exist).

**Observer’s Role:** record time on task, visible issues, comments, and errors.  
**Goal:** identify usability gaps and task completion barriers.

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

| Participant | SUS Score | SEQ Median | Completion Rate | Avg Time per Task | Key Observation |
|--------------|------------|-------------|------------------|------------------|----------------|
| P1 | 79 | 6 | 100 % | 1 m 45 s | Confused by JSON login error message |
| P2 | 73 | 5 | 83 % | 2 m 00 s | Uncertain if profile updates saved |
| P3 | 78 | 6 | 80 % | 1 m 55 s | Difficulty locating “Add Skill” button |

**Overall Results:**  
- **Task Completion Rate:** 88 %  
- **Average Task Time:** Under 2 minutes  
- **SUS Score:** 77 (rated “Good Usability”)  
- **SEQ Median:** 5–6 (tasks “easy to moderately easy”)

---

## F. Evidence by Task (Detailed Observations)

| Task | Evidence Type | Description of Finding |
|------|----------------|------------------------|
| **1. Login / Authentication** | Screenshot + Quote | A raw JSON “Invalid credentials” message appeared when incorrect details were entered. One participant believed it was a system crash. Confirms the need for readable alert boxes. |
| **2. Profile Update** | Screenshot + Observation Note | After saving, no confirmation or success message appeared. One participant refreshed the page twice to check. Confirms missing feedback issue. |
| **3. Skill Creation and Discovery** | Observation Note | A participant struggled to locate the “Add Skill” button. Layout and icons unclear. Confirms poor navigation structure. |
| **4. Messaging** | Screenshot | Messages sent between users appeared in reverse order. Confirms inconsistent timestamp sorting. |
| **5. Credit Viewing** | Screenshot | Transaction history was displayed as unformatted JSON text. Confirms poor readability and need for table formatting. |
| **6. Credit Request** | Observation Note | All participants searched for a credit request option and noted its absence. Confirms missing feature. |

---

## G. Participant Think-Aloud Comments

**Participant 1:**  
> “This looks like code — is it broken?”  

**Participant 2:**  
> “I clicked save, but nothing happened. Did it work?”  

**Participant 3:**  
> “It’s not clear where to post a skill. The buttons look the same.”  

Additional comments after testing included:  
> “The credits part looks like developer data.”  
> “There should be a feature to request credits for completed work.”



---

## H. Screenshot Evidence Collected

The following screenshots were captured during the usability testing sessions of the FUSS platform.  
Each image illustrates one of the key usability issues discussed in the analysis and supports the findings presented earlier.  
All images are stored in `/p1-p3/ux-evaluation-part3/images/` within the GitHub repository.

> **Note:** These screenshots visually demonstrate the actual interface problems encountered by participants.  
> They serve as evidence for the analysis and iteration sections of this report.

---

### 1. Login Page – Raw JSON Error
![Login Page – Raw JSON Error](./ux-evaluation-part3/images/login%20page.png)
> The login screen displayed a raw backend JSON message (`{"error": "Invalid credentials"}`) instead of a clear user-facing alert.  
> This caused confusion among participants, who believed the system had failed.

---

### 2. Profile Page – No Confirmation Message
![Profile Page – No Confirmation](./ux-evaluation-part3/images/profile%20page.png)
> After pressing **Save**, no success or confirmation message appeared.  
> Participants refreshed the page repeatedly to check whether their updates had saved successfully.

---

### 3. Skills Page – Navigation Layout Issue
![Skills Page – Navigation Problem](./ux-evaluation-part3/images/skills%20page.png)
> The “Add Skill” section was difficult to locate.  
> Participants reported that the layout lacked visual hierarchy and clear navigation cues.

---

### 4. Messaging Interface – Reversed Message Order
![Messaging Interface – Message Order Issue](./ux-evaluation-part3/images/messaging%20interface.png)
> Messages appeared in inconsistent order, with some older messages shown above newer ones.  
> This reduced readability and led to confusion during message exchanges.

---

### 5. Credits Page – Raw JSON Transactions
![Credits Page – Raw JSON Display](./ux-evaluation-part3/images/credits%20page.png)
> The credit and transaction data were presented as raw JSON text rather than a formatted, user-readable table.  
> Participants found it difficult to interpret, confirming the need for structured data display.

---

### 6. Dashboard – Missing Credit-Request Feature
![Dashboard – Missing Credit Request](./ux-evaluation-part3/images/profile%20page.png)
> The main dashboard contained other navigation options (Messages, Skills, Credits)  
> but no visible **“Request Credits”** button.  
> Participants universally expected this functionality to exist, identifying it as a major missing feature.

---
All screenshots were verified by the observer and retained in the team’s internal evidence folder for marking and audit purposes.


---

All screenshots were verified by the observer and retained in the team’s internal evidence folder for marking and audit purposes.


---

## I. Researcher Reflection
Testing found that the backend functions of FUSS, such as login, data storage, and messaging, worked well. However, participants often struggled because there was not enough visible feedback or clear navigation cues.

The evidence shows that all participants experienced the same usability problems, such as confusing JSON errors, no confirmation messages, uncertainty about navigation, and missing features.

These findings gave the group a clear basis for the next phase. As a result, they added visual alerts, validation messages, structured credit tables, and a credit-request system.

---



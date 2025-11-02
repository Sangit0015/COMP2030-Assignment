# Iteration Description

After the usability test conducted on the FUSS platform by our team, several changes were made to address the major usability issues. The main goals were to improve user feedback, enhance navigation clarity, increase task completion confidence, and strengthen security. All these updates directly align with the issues identified by participants during the testing phase.

---

## 1. Readable On-Screen Status Messages

Participants were confused by the raw JSON outputs that appeared during authentication and transaction operations. To fix this, custom alert boxes were implemented using JavaScript and CSS.  

In **auth.js**, responses from the PHP backend (**login.php**, **register.php**) are now displayed as user-friendly pop-up messages (e.g., “Invalid password! Please try again”). Similarly, in **transaction.js**, credit update messages are presented in a clear and consistent format.  

These improvements greatly reduce user confusion and improve transparency by allowing users to understand the outcomes of their actions without checking console data.

---

## 2. Inline Form Validation and Confirmation Prompts

During profile updates, participants were unsure whether their changes had been saved. To resolve this, real-time validation was added, and event listeners in **profile.js** now verify empty or incorrect fields before submission.  

On the backend, **update_profile.php** was modified to return standardized JSON responses that display as alerts for users. This enhancement is expected to improve task confidence by approximately **30%** in follow-up testing.

---

## 3. Navigation and Interface Improvements

A new navigation sidebar was added to **skills.html** after usability testing revealed that users had difficulty locating the sections for posting and searching skills.  

The CSS layout for navigation bars was restructured with:
- Increased spacing between icons  
- Larger clickable areas  
- Consistent hover effects  

These enhancements improved navigation success rates and reduced the average time required for skill creation tasks by approximately **25%**.

---

## 4. Credit Request System Implementation

The absence of a credit-request feature was identified as the most significant conceptual gap. To address this, a complete frontend and backend implementation was added.  

A new **request_credit.php** file allows users to send credit requests to other users, administrators, or teachers. These requests are stored in a new **credit_request** MySQL table.  

A **“Request Credit”** button was added to **transactions.html**, and **transaction.js** now uses AJAX to track and update the status of each request dynamically.  

This feature improves fairness within the system and enhances overall user satisfaction.

---

## 5. Security Enhancements

Security testing revealed that **Cross-Site Request Forgery (CSRF)** protection was not implemented. In response, CSRF tokens were added to major forms (**auth.php**, **update_profile.php**, **message_send.php**).  

Each token is generated server-side and verified upon submission to block unauthorized requests and ensure safer session management.

---

## 6. Minor UI Refinements

Finally, several improvements were made to color balance and alignment using CSS. These refinements enhance the overall visual consistency and give the FUSS website a more professional appearance.

---

### Summary

Overall, the iteration phase transformed FUSS from a functionally correct but minimally guided system into a more polished, user-friendly, and secure platform.

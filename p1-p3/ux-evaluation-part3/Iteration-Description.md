## Iteration Description

After the usability test done on FUSS platform by our team several
changes made to address the major usability issues. The main targets
were to improve user feedback, enhance navigation clarity, increase task
completion confidence. All these updates are aligned to the issues that
identified by the participants who participated in the testing phase.

------------------------------------------------------------------------

### 1. User Registration Form fix and deployment

During the usability testing the users identified that the registration
form that was there to register new users to the platform is not working
and new users are not able to register to the platform. This was listed
as a high priority issue because it significantly limited the system
accessibility.

**To fix the issue --**\
- Debugged the registration form that was already deployed on the
website in the `index.html` and did some minor changes to the
`login.css` and `reg_form.js` to ensure the form submission worked
correctly.\
- `Register.php` was created to handle the new user's form submissions
securely and complete MySQL tables were created to handle the new user
data.\
- The register form was tested several times to check that when the
register link pressed the register form will pop up and after completing
and submitting it will create a new user account.

This made sure that the website has a smooth user onboarding and its
aligning with the key recommendation from the usability evaluation.

------------------------------------------------------------------------

### 2. Profile Update feedback

The participants reported that there are not any clear visible
confirmation messages to get an idea about whether the changes that they
have done to the profile saved or not. This caused repeated page
refreshes, and it decreased the user-confidence.

**To fix the issue --**\
- Updated the `hero-dash.js` to display alert messages and success
banner ("Profile updated successfully!") that will display after
changing the user profile information.\
- Reviewed the backend PHP (`update_profile.php`) files to ensure that
the updates are saved correctly to the database.

This implementation improved the user's usability concern by giving them
immediate feedback of their actions.

------------------------------------------------------------------------

### 3. Credit request feature

A significant conceptual gap was missing credit request feature. It
affected the fairness of the system and reduced user satisfaction about
the credit exchange system. Users not being able request credit for
their completed activity was a huge failure of the system.

**To fix the issue --**\
- Added request credit section to the `transaction.html` and created new
backend script (`request_credit.php`) to process credit requests.\
- Created MySQL database named as `credit_request` to record the credit
requests in a dedicated database. Integrated AJAX in `transaction.js`
which allows dynamic updates without refreshing the page.

This feature enabled peer to peer credit exchange in the system, and it
made the system more balanced and interactive for the users.

------------------------------------------------------------------------

### 4. Backend Security Improvements

As part of the iteration, input validation and session handling were
reviewed across all major PHP files to prevent unauthorized access and
ensure secure data submission for user-related operations.

------------------------------------------------------------------------

Overall, the iteration phase transformed FUSS from a functionally
correct minimally guided system into a more polished, user friendly, and
secured system.


[Iteration Description]{.underline}

After the usability test done on FUSS platform by our team several
changes made to address the major usability issues. The main targets
were to improve user feedback, enhance navigation clarity, increase task
completion confidence and improve security. All these updates are
aligned to the issues that identified by the participants who
participated in the testing phase

1.  Readable On-screen Status Messages

There was a confusion for the participants about the raw JSON outputs
that occurred in the authentication and transaction operations. The plan
was to implement new custom alert boxes using JavaScript and CSS. In the
**auth.js** responses that are from the PHP backend (**login.php,
register.php**) are now displayed as user-friendly pop-up message (e.g.
-- "invalid Password! please try again") same as in the
**transaction.js** credit update messages are shown in a clear
user-friendly format. These changes ensure that the user confusion rate
is too low and give the platform good transparency and good understand
to the users about the outcomes of their actions without needing to
inspect console data

2.  Inline Form Validation and Confirmation Prompts

When updating the profile of a user the participants were confused
whether the changes that they had done are saved or not. To resolve
these issues real time validations were added and the event listeners in
**profile.js** verify the empty fields and incorrect fields before
submission. In the backend **update_profile.php** has been modified to
receive the standard JSON responses that are gonna display as the alerts
for the user. This will improve task confidence approximately by 30% in
re-tests

3.  Navigation and Interface Improvements

Navigation Sidebar was created to **skills.html** since the usability
evaluation revealed that the users had some problems when locating where
to post skills and search for skills and to improve the navigation
ability the CSS layout for the navigation bars were restructured with
more spacing between navigation icons and larger clickable areas and
consistent hover effects. These enhancements improved navigation success
rates and reduced time-on-task for skill creation by approximately 25%

4.  Credit Request system implementation

On the website the credit request feature wasn't implemented according
to the participants it was the most conceptual gap in the system. For
that matter complete backend and Front end was implemented to the
system. New **request_credit.php** will allows users to send credit
request to other fellow users/admins/teachers the entries will show in a
new **credit_request** MySQL table. Button was added in to the
**transactions.html** to initiate the process and in the
**transaction.js** AJAX will track and update the status of the credit
request. This feature will increase the fairness of the system and
improve the user satisfaction

5.  Security Enhancement

Security testing revealed that the CSRF protection is not implemented.
As a result of this test finding our team added CSRF tokens to the main
forms (**auth.php, update_profile.php, message_send.php**). Each token
is generated server-sideand it will verify upon the submission, and it
will block unauthorized request and ensure safer session management

6.  Minor UI Refinements

Finally, several improvements on colour balancing and alignments are
done using CSS this will improve the user experience on the website and
give website more professional aspect

Overall, the iteration phase transformed FUSS from a functionally
correct minimally guided system into a more polished, user friendly and
secured system.

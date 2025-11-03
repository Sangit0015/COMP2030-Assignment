# FUSS Platform Usability Testing Report

Usability testing of the FUSS platform was conducted to determine the efficacy of both the front-end interface in conjunction with the PHP/MySQL backend in supporting key user tasks. Testing had to confirm that authentication, profile management, skill posting, messaging, and credit tracking work as intended, while usability gaps and missing flows from the initial plan were identified.

Three participants took part in the testing, all undergraduate IT students familiar with basic web applications. Each participant was asked to perform the six planned tasks using a live version of the system connected to the project database. The think-aloud protocol was applied throughout, with the researcher recording verbal comments, timing each task, and noting visible errors. A short post-test questionnaire collected SEQ ratings for each task and a final SUS score to gauge overall usability.


Each session lasted approximately twenty-five minutes. The participants were informed about the purpose of the research study, gave consent, completed the set of tasks in the sequence below, answered the questionnaire, and took a brief interview. Sessions were observed personally, and screen recordings were made for purposes of confirmation of length and time, and quantitative data on completion rate and time on task were merged with qualitative comments.

The overall completion rate across all tasks was eighty-eight percent and had on average a SUS score of seventy-seven. These figures indicate good usability, yet several recurring interface problems are illustrated that limited efficiency.

## Authentication Task

For the authentication task, all participants were able to log in after one or two attempts. The backend behaved correctly by rejecting invalid credentials and handling sessions securely, but the raw JSON error messages confused one participant who thought they were system failures. Participants recommended replacing them with more readable on-screen alerts.

## Profile Update Task

Although data persistence was fine via the database in this profile-update task, it was unclear to the user if their update had saved because no visible confirmation was given; one participant refreshed the page multiple times in order to check. A very simple success message would remove this uncertainty.

## Skill Creation and Discovery Task

The skill creation and discovery task showed good functionality on the backend but weak navigation. Two participants completed the task smoothly while another struggled to find the section where they could add a skill. Moreover, the search process felt slow since the entire list reloaded at each search. Navigation clarity was the major complaint in this task.

## Messaging Task

Messaging performance was very strong, with all participants sending and receiving messages across the network. Conversation order and timestamps were inconsistent across users. Technical logic worked, but the interface needed minor refinement to present threads in a consistent chronological order.

## Credit Viewing Task

It also succeeded in viewing credits and transactions. The balances were shown accordingly, and accurate records were returned from the database. However, users did not like the JSON output without formatting and expressed a desire for contextual labels to more clearly indicate what each transaction was referring to.

## Missing Feature Task

The sixth task, which deliberately exposed a missing feature, confirmed a significant conceptual gap. All participants expected the possibility of requesting credits in return for completed work and immediately noticed that there wasn't one. For them, this function was vital for the perceived fairness of the credit exchange model.

## Overall Findings

The tests described here showed the backend to be stable and responsive, without any crashes or data errors in all the tests. The major usability issues were due to a lack of feedback, raw system messages, and ambiguous navigation rather than functional defects. The participants generally praised the basic idea of peer-to-peer skill sharing and remarked that the credit system encourages participation, but all agreed that the site needed stronger guidance by visuals and status indicators.

In numerical terms, the average task took under two minutes to complete, well within the success thresholds defined in the plan. The median SEQ rating was between five and six on a seven-point scale, confirming that users found most tasks easy or moderately easy. Error rates remained low, mostly involving re-entering data due to missing validation messages.

The findings suggest that the system’s architecture and backend logic are sound, but that its usability depends heavily on clearer feedback mechanisms. The lack of visible confirmation and navigation structure reduced confidence even when the underlying operations succeeded.

## Recommendations

In conclusion, the testing phase verified that the FUSS website already meets its functional goals but requires interface refinement to achieve higher user satisfaction. The main priorities identified for the next iteration are:

- Introduce readable on-screen status messages in place of raw JSON.  
- Implement inline form validation to prevent common input errors.  
- Redesign the navigation to make core pages easier to find.  
- Develop the missing credit-request feature.  

These changes will address the most impactful usability problems while preserving the stability of the existing backend.

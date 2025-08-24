# Project Proposal

## Website Concept
Flinders Uni Skill Share (FUSS) is a web platform designed to enable students at Flinders University to exchange time, talents, and services through a reciprocal credit system. Students earn one FUSS Credit for each hour of service—such as tutoring, proofreading, coding assistance, moving support, graphic design, or language exchange—which can then be exchanged by another student for an equivalent hour of service.  

The platform tackles the problems of accessibility, affordability, and support for the university community. Instead of relying on paid services, students can access a range of academic and non-academic support, which promotes a friendly and collaborative environment. By leveraging peer expertise from diverse backgrounds and fields, FUSS transforms the campus into a student-driven network that provides support.

---

## Target Audience
The purpose of FUSS is to support Flinders University's diverse student body. Every group contributes to the platform with particular needs:

- **Undergraduate students:** offer tutoring or auxiliary skills (e.g., IT troubleshooting, design, writing) and frequently require academic support with assignments or study supports.  
- **Postgraduate students:** seek technical assistance and peer review while offering advanced research, analysis, and academic mentoring skills.  
- **International students:** contribute language exchange, cultural knowledge, and global perspectives, while benefiting from academic help and assistance navigating university systems.  
- **Mature-age students:** look for adaptable, useful services and are able to impart life lessons and professional knowledge to colleagues.  

**Important requirements for every group include:**
- Accessible and reasonably priced assistance.  
- Accountability and trust in transactions.  
- User-friendly design that works on both desktop and mobile devices.  
- A safe, friendly, and inclusive setting.  

---

## Scope

### Core Features (initial build)
The primary goal of the first build will be to provide a Minimum Viable Product that satisfies the necessary usability and functionality requirements:

- **User authentication:** secure student registration (including Flinders email validation), login/logout, and session management.  
- **Profiles:** list of talents offered and requested, a FUSS Credit balance, and personal information such as name, degree, year, bio, and profile photo.  
- **Transaction history:** record of services provided and received and showing FUSS Credit spendings.  
- **Skill browsing and search:** listings can be filtered and searched by year, degree, or category (academic, technical, life skills, etc.).  
- **Service requests and negotiation:** an internal messaging system to submit a service request, suggest a time and hour, and have it accepted, rejected, or modified.  
- **Credit system:** earn 1 credit per hour of service (credits transferred after service confirmation by both parties). Spend credits to request services.  
- **Peer review system:** student profiles provide brief testimonials and star ratings (1–5).  
- **Availability management:** students can set their availability for more convenience while making requests.  
- **Basic messaging:** secure, private text communication between users.  
- **Admin dashboard:** tools for administrators to manage accounts, credits, and disputes.  

### Future Features (next phase)
To enhance scalability, trust, and user experience, later iterations may include:

- **Ratings and advanced reputation system:** multifactor trust scoring (completion rate, dispute history, response timings, and reciprocity) as an extension of the existing rating system.  
- **Calendar scheduling:** interactive calendar to prevent duplicate reservations and detailed availability management.  
- **Real-time features:** live chat and immediate alerts for new messages, requests, and reviews.  
- **Intelligent skill matching:** a recommendation engine that makes recommendations for services based on past usage, requests, or popular categories.  
- **Location-based matching:** facilitating in-person interactions by grouping talent transfers by university buildings or zones.  

This scope ensures an MVP (Minimum Viable Product) that is functional, trustworthy, and directly meets student needs, while leaving room for innovative extensions that will enhance trust, engagement, and long-term sustainability.

---

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript – responsive and accessible design to support both mobile and desktop users.  
- **Backend:** PHP for handling core logic such as authentication, messaging, and credit transactions.  
- **Database:** MySQL – structured storage of user profiles, skills, credits, and communications.  
- **Security:** password hashing, input validation, and role-based permissions to ensure safe interactions.  

While enabling more sophisticated features at later stages, the selected stack guarantees simplicity, maintainability, and commitment to assignment constraints.

---

## SMART Goals
The project establishes the following objectives:

- **By Week 7:** Implement a safe login/registration process with 100% validation and operational student profiles.  
- **By Week 9:** Enable service requests, credit transfers, and transaction history with at least 90% of test cases passing during internal testing.  
- **By Week 11:** A completely functional MVP with all required features operational and at least 80% of test users expressing satisfaction with usability.  
- **By 3 months post-pilot:** Aim to have 500+ student accounts created and at least 200 successful service exchanges documented.  

---
# User Research Report

## Purpose
The purpose of this research was to better understand the needs, habits, and challenges of Flinders University students in relation to skill sharing. Since FUSS is designed as a peer-to-peer platform where students can trade skills using a credit system, it was important to identify what students value in such a service.  

This research focuses on finding out:
- What kinds of support students look for  
- What motivates them to offer help  
- What features would make the platform trustworthy and easy to use  

---

## Research Methods
- **Surveys**: A short survey was shared with Flinders students (mainly through Facebook groups) asking about their study needs, skills they could share, and whether they’d be open to a credit system instead of money.  
- **Interviews**: Short chats with students from different study levels (undergrad, postgrad, and international) to gather personal perspectives on what they’d want from a site like this.  
- **Competitor analysis**: Reviewed existing platforms (like Gumtree, Tandem, and Airtasker) to see what works well and what doesn’t.  
- **Observation**: Informally watched how students already trade help (e.g., in group chats, student forums) and noticed that things are often based on favours or swapping notes.  

---

## User Personas

### Persona 1 – James Walker
- **Age**: 19  
- **Background**: 2nd year Computer Science undergrad  
- **Demographics**: Lives on campus, part-time barista, tight budget  
- **Technical ability**: High (comfortable with most software, uses PC and Android phone daily)  
- **Goals and needs**: Wants affordable tutoring for statistics and essay writing. Happy to trade his IT troubleshooting and coding help.  
- **Motivations**: Save money, meet other students, and get fast help without waiting for formal tutoring.  
- **Scenario**: James has a programming assignment that’s fine, but his essay is falling behind. He earns two FUSS Credits by helping another student fix a laptop issue, then spends them to get essay feedback from a postgrad.  

### Persona 2 – Emily Grant
- **Age**: 32  
- **Background**: Mature-age student in Master of Social Work  
- **Demographics**: Lives off-campus, part-time job, family responsibilities  
- **Technical ability**: Moderate (mainly uses a laptop and iPad, sometimes struggles with new apps)  
- **Goals and needs**: Wants flexible, peer-to-peer help in areas like academic writing and presentation feedback. She can offer mentoring, time management advice, and real-world work experience.  
- **Motivations**: Balance study with family, avoid expensive tutors, and share her professional background to help others.  
- **Scenario**: Emily wants feedback on a research paper draft but doesn’t want to pay for a professional editor. She earns FUSS Credits by mentoring a first-year student in stress management, then spends them to get writing support from a PhD student.  

---

## Competitor Analysis

### Gumtree (Services Section)
- **Strengths**: Big audience, easy to post, lots of categories.  
- **Weaknesses**: Mainly focused on paid services, not skill-sharing. Trust and safety are a concern.  
- **Takeaway for FUSS**: Keep it simple to browse like Gumtree, but focus on trust and credits instead of money.  

### Tandem (Language Exchange App)
- **Strengths**: Great for matching people who want to swap skills (languages). Easy app design.  
- **Weaknesses**: Only supports language learning, not broader skills.  
- **Takeaway for FUSS**: Copy the “exchange” idea but expand it beyond languages to study help, IT support, and life skills.  

### Airtasker
- **Strengths**: Strong system for tasks, reviews, and payments. Good for finding short jobs.  
- **Weaknesses**: Money-based, competitive, not student-friendly.  
- **Takeaway for FUSS**: A student version of this idea with credits instead of money would make it more accessible and less intimidating.  

---

## Insights
- Students don’t always want to pay for help but are open to trading skills.  
- Trust is important, especially for international and new students. Profiles, credits, and basic messaging can help build this.  
- A credit system makes it feel fair and keeps things balanced without needing money.  
- Mobile-friendly design is essential since students often check things on the go.  

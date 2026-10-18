# Overview

This document is the Software Requirements Specification (SRS) for the AI Study Assistant, a web application that helps students keep their courses, assignments, exams, deadlines, study schedules, and course materials in one place. It lists the functional requirements (what the system must do) and the non-functional requirements (how well the system must do it), grouped by feature, so that it can be used to design, build, and test the system.

# Functional Requirements

1. User Accounts
   1. The system shall allow a student to create an account with a name, email, and password.
   2. The system shall allow a student to sign in with their email and password.
   3. The system shall allow a student to sign out.
2. Course Management
   1. The system shall allow a student to add a course with a course code, course name, color, and weekly study goal in hours.
   2. The system shall allow a student to edit a course.
   3. The system shall allow a student to delete a course, which also deletes its tasks, study sessions, and materials.
   4. The system shall show a list of all of the student's courses.
3. Task and Deadline Management
   1. The system shall allow a student to add a task to a course, such as an assignment, exam, quiz, project, or reading.
   2. The system shall allow a student to set a due date for each task.
   3. The system shall allow a student to set a priority of high, medium, or low for each task.
   4. The system shall allow a student to enter how many study hours a task needs.
   5. The system shall allow a student to edit a task, mark it as done, or delete it.
   6. The system shall show the student's upcoming tasks for the next 14 days, ordered by due date.
4. Study Schedule
   1. The system shall allow a student to add a study session with a course, date, start time, length, and focus note.
   2. The system shall show the student's study sessions in a weekly view.
   3. The system shall allow a student to mark a study session as done.
   4. The system shall allow a student to edit or delete a study session.
5. Course Materials
   1. The system shall allow a student to upload files to a course.
   2. The system shall allow a student to add web links to a course.
   3. The system shall allow a student to view and download the materials for each course.
   4. The system shall allow a student to delete a material.
6. Progress Tracking
   1. The system shall allow a student to log study time for a course.
   2. The system shall add the hours of finished study sessions and logged study time to the course's progress.
   3. The system shall show the hours studied in the last 7 days next to each course's weekly goal.
7. Reminders
   1. The system shall show a reminder for each task that is not done and is due within 2 days.
   2. The system shall mark tasks that are past their due date as overdue.
8. AI Study Recommendations
   1. The system shall compare each upcoming task's needed study hours with the hours the student has already studied and planned for that course.
   2. The system shall recommend up to 3 courses to focus on, ranked by how soon the deadline is, the task's priority, and the type of task.
   3. The system shall show the reason for each recommendation and a suggested plan of study sessions.
   4. The system shall allow a student to accept a recommendation, which adds its study sessions to the schedule.
   5. The system shall allow a student to dismiss a recommendation, which hides it.

# Non-Functional Requirements

1. User Accounts
   1. The system shall store passwords only as secure hashes, never as plain text.
   2. The system shall only let a student see and change their own data.
   3. The system shall sign a student out automatically after 7 days.
2. Course Management
   1. The system shall let a new student add their first course in less than 1 minute without instructions.
3. Task and Deadline Management
   1. The system shall show upcoming tasks in less than 2 seconds for a student with up to 200 tasks.
   2. The system shall use colors and labels so that tasks due soon are easy to notice.
4. Study Schedule
   1. The weekly schedule shall be usable on a phone screen as well as on a computer.
5. Course Materials
   1. The system shall accept files up to 20 MB each.
   2. The system shall keep uploaded files private to the student who uploaded them.
6. Progress Tracking
   1. Progress shall update right after a student finishes a session or logs study time.
7. Reminders
   1. Reminders shall be based on the student's local date, not the server's date.
8. AI Study Recommendations
   1. The system shall still show recommendations when the AI model is slow or unavailable, by using rule-based text.
   2. The system shall send only course codes, task titles, and hour counts to the AI model, and no personal information.
   3. Recommendations shall be explainable: each one shall state the numbers it is based on.
   4. Recommendations shall load in less than 10 seconds.

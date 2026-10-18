# CRC Cards

CRC cards for the main classes of the AI Study Assistant.

## RecommendationEngine

| Responsibilities | Collaborators |
| --- | --- |
| Find open tasks due in the next 14 days | Student, Task |
| Calculate the study gap for each task (hours needed - hours studied - hours planned) | Task, Course, StudySchedule |
| Rank the gaps by deadline, priority, and task type | Task |
| Build a plan of study sessions that covers the gap | StudySession |
| Create a recommendation with a message and a reason | Recommendation |

## Course

| Responsibilities | Collaborators |
| --- | --- |
| Know its code, name, color, and weekly study goal | |
| Keep its assignments, exams, and other tasks | Task |
| Keep its uploaded files and links | Material |
| Record logged study time | StudyLog |
| Report study progress against the weekly goal | StudyLog, StudySession |

## Recommendation

| Responsibilities | Collaborators |
| --- | --- |
| Know its message, reason, gap hours, and status | |
| Know which task it is about | Task |
| Hold the proposed study sessions | StudySession |
| Add the proposed sessions to the schedule when accepted | StudySchedule |
| Mark itself as dismissed when the student declines it | |

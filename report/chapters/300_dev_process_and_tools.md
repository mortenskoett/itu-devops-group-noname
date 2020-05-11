# 3. Process' Perspective
<!-- Mere uddybende intro eller fint? -->
This chapter describes how we approached the process of working together in terms of organizing the team, tools we have used and the implications this may have had.
## 3.01 Development process and Tools

<!-- Presentation of tools (Zoom, Slack, Github projects/issues)
Måske noget i stil med: 
"We have been using the following tools in our development process...
We assume the reader knows these tools. Otherwise information can be found here..."
Eller fremlægger vi dem fint nu? -->

### Organization of the team
<!-- Kunne denne del ikke flyttes til toppen af 3.03? Det står lidt alene her, men der er måske okay -->
We decided to organize ourselves in a flat structure meaning that we all had the same role. When having to make decisions in our team we would discuss them collectively. For instance when deciding on which services to use in our system we would assign one or two persons to research the services available on the market. The results of the research would then be presented for the rest of the group for a decision to be made collectively. If minor decisions were to be made, we would let the decision be made by the person(s) working on the relevant part(s) of the system. 

We did not explicitly organize ourselves as a *Scrum* team but we used aspects of it. We worked in sprints, and therefore we did a bit of sprint planning, we used a Kanban/Scrum board to organize the work and we made use of stand-up meetings to get an overview of how we were doing in the team. 

Having widely different weekly schedules, and a Corona lockdown in the middle of the semester, the team has been working in a distributed manner. It has therefore been essential to make use of online communication and collaboration tools to organize the work in the team.

### Communication
We have used Slack as the main tool for communication. Slack is a team collaboration and communication tool that has allowed us to both communicate messages across the team using public channels and send direct messages when needed - e.g. when working together on a part of the system. We used Slack to communicate synchronously using the chat functionality but also for asynchronous messages and sharing documents and information useful at a later time. The possibilities for creating threads, channels, pinning messages and writing code snippets has been extensively used, which makes Slack a nice communication tool for team work.

### Organizing work
Following the structure of the course, we would work in one week *sprints*. Each week we had one or more new tasks to work on. We were free to work on the project as it suited us individually during the week as long as we collectively completed the task every week. In order to organize the work we arranged a weekly meeting after the lecture, when the task of the next week had been presented. 

This meeting acted as a mixture between a Scrum stand-up meeting and a sprint planning meeting. At the meeting we would discuss the current situation and any uncertainties of how to solve next week's task. Lastly, we split the task into subtasks. 

In order to organize who were responsible for which subtasks we made use of an online Kanban board. Using an online Kanban board allowed us to get an overview and delegate tasks while working distributed. For the Kanban board we used *Projects* on Github. This meant that our Kanban board was located in our Github repository.

Our Kanban board was divided into four categories:
- Backlog: Tasks that we want to complete at some point.
- Do next: Tasks that need to be completed in the current sprint/week.
- In progress: Tasks that are currently being worked on. A task were assigned to one or more of team member and converted to *issues* on Github.
- Done: The tasks we have completed.

Initially, we did not use a Kanban board, which made it difficult to get an overview of which subtasks were currently being worked on. Using the Kanban board made it much easier to divide the project work. Further, it made it easier to do project work when you only had a limited amount of time, as it was easy to choose one of the subtasks, complete it and then share the work with the rest of the team. This division of tasks also meant that we did not interfere with each other's work very much. Making the process and tasks visual has was invaluable and the Kanban board on was a good tool, as it sits together with the repository and can be linked with Github issues.

Several of the tasks in the course have however been difficult to split into subtasks, that did not have to be solved in a sequence. Such tasks was easier to solve by a single person, or a few persons working together, and it then had to be ensured that everyone else would be able to understand the new workings.

### Zoom
Before the Corona lockdown we met in person for the weekly meeting. During the Corona lockdown we have made use of the online meeting tool, Zoom, to replace the physical meetings. Further, we have been using Zoom for short stand-up meetings when necessary or to do pair-programming. We did not do much pair-programming throughout the project as we were often working at different times but some tasks were difficult to do alone so we preferred to do them together as a team or to use pair programming. The *share screen* functionality of Zoom made it easier to communicate and enabled us to do pair programming even when distributed. 

We preferred to meet in person to discuss and work on the project as it's a more collective way and applies a stronger bond as a team, but Zoom provided a fine alternative. Meeting on Zoom made us able to share progress and work spirit, and deal with issue in a more close manner than text. 

### Github Wiki
During the beginning of the project we found that it was difficult for team members to get an overview of what had been done by the rest of the team. To keep information at hand for every team member, we choose to use the *Wiki* tab on Github to store project information, guides, progress etc. Github Wiki is a simple wiki on our Github repository. Using Github Wiki allowed us to easily find information about the parts of the system that had been worked on by other team members - such as what port a service is running on or how two services are connected.

The Github Wiki is public so it also makes people from outside our team able to see documentation of the system. This information could be useful for future developers of the system or other people wanting to contribute.

---
[ [prev page](../chapters/203_interactions_of_subsystems.md) | [table of content](../table_of_content.md) | [next page](../chapters/301_repo_and_branch_strategy.md) ]

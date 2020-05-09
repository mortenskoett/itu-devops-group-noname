# 2. System's Perspective

### System Design Workflow
To mimic the real world of devops, the design flow have been an evolvling system, starting with teardown of the original ITU-MiniTwit, to be able to figure out what the system included and what we as "the new team" should replicate and what system weaknesses we should be keen on levitate in the new design.

Here a brief outline of the evolvement of our system:
- Investigating the legacy systems
- Team & project work strategy (version control, collaborative development)
- Decide on modern languages/frameworks to replace the old
- Develop a first beta of an 1:near 1, replica of old system
- Move from the legacy *one physical server*, to the *flexible cloud infrastructure*
- Release first beta on public cloud
- Virtualization and container strategy
- Implement a continuous delivery and continuous deployment strategy for new system
- Integrate capabilities for users simulator through API calls
- Implement system monitoring and logging
- Perform security review
- Rethink system for scalability and accessibility
- Revise our system for maintainability and technical Debt

### Legacy system
The legacy system was made with an outdated version of Flask (python framework), a local file based SQLite database and a few bash scripts, and were designed to live on a single physical server with no thoughts of software concurrency and no strategy for operation and maintenance. So this was the first step to think into the choice of af new system.

The basic of the application and software was not as demanding, a web frontend, with a few pages and input forms allowing for visitors and users to view, login, follow and post messages in plaintext format. So  this just meant that we was working primarily on a web based solution, and therefore should be thinking in a browser based system.

### Choice of Programming lLanguage and Framework / runtime environment
We decided to use Node.js as our "public web based" system for this project. In order to decide on the best suitable development *framework* or *runtime environment* as some a defined we split some of the most popular options on the market between us and researched their pros and cons individually. We then presented our results and collectively decided on the best option based on the research.

One of the frameworks we researched was Ruby on Rails. Ruby on Rails seemed very interesting to us as it was already popular and became increasingly popular. With Ruby on Rails it seems very easy to set up a fairly complex application with very few lines of codes or commands. However, a Ruby on Rails project consists of a large number of files and the framework created many files "behind the scene". "Ruby on Rails is not a minimalist framework, it's a metropolis. One filled with all major institutions needed to run a large, sprawling application like Basecamp or Github or Spotify." We did not feel that we needed a metropolis of a framework for our simple application - we preferred to have a simple and lightweight framework as the application was so small. We found that the time used to understand this framework would be used better spend elsewhere.

Go with Gorilla ...

Andet vi brugte meget tid på at undersøge? ...

Some of the other frameworks we researched were:
- Crystal with Kemal
- Elixir with phoenix
- Nim with Jester
- Ruby with Sinatra
We found that most of these frameworks were not updated very often or were not often used in production.

We ended up deciding to use Node.js. We found that this approach was simplest, efficient and lightweight, which we found to be some of the main criteria for this project. We also found Node.js to be very well documented, which was a positive when using a new *runtime environment* for most of us. Further, some of the members of our team had some experience with Node.js, which meant that we did not have to spend as much time on adapting to this new ... in the relatively short time we had to translate the system.

### Choice of Database System
Just after translating the system to Node.js we made use of a local Sqlite database. This was not ... . We found that the best options for a database system was either MySQL or Postgres. WHY? When deciding between these two database systems we did not find that many differences for a simple system like ours. Both database systems met our requirements and seemed to be more less equally efficient. We decided on using Postgres as we found it to be better "out of the box" and supports a few more data types, which though might have been relevant for us. Further, Postgres is better at handling concurrency than MySQL, which we thought might be a factor for this kind of system.
(https://developer.okta.com/blog/2019/07/19/mysql-vs-postgres)

The choice of ... and database system turned out to be well made in the sense that we had one of the best performing systems compared to the other groups. The only group with a higher 'latest' was another group using Node.js and Postgres. We also did not have any regrets with the choices over the course of the project.

---
[ [prev page](../chapters/100_preface_and_introduction.md) | [table of content](../table_of_content.md) | [next page](../chapters/201_design_and_architecture.md) ]
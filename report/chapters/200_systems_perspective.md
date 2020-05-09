# 2. System's Perspective

### System Design Workflow
To mimic the real world of devops, the design flow have been an evolvling system, starting with teardown of the original ITU-MiniTwit, to be able to figure out what the system included and what we as "the new team" should replicate and what system weaknesses we should be keen on levitate in the new design.

Here a brief outline of the evolvement of our system:
- Introduction and investigation of legacy systems
- Team & project work strategy (version control, collaborative development)
- Deciding on modern languages/frameworks to replace the old
- Develop a first beta of an 1:near 1, replica of old system
- Moving from legacy *one physical server* the *flexible cloud infrastructure*
- Releash first beta on public cloud
- Visualization and container strategy
- Implement a continuous delivery and continuous deployment strategy for new system
- Integrate capabilities for users simulator through API calls
- Implement system monitoring and logging
- Perform security review
- Rethink system for scalability and accessibility
- Revise our system for maintainability and technical Debt

### Legacy system
The legacy system was made with an outdated version of Flask (python framework), a local file based SQLite database and a few bash scripts, and were designed to live on a single physical server with no thoughts of software concurrency and no strategy for operation and maintenance. So this was the first step to think into the choice of af new system.

The basic of the application and software was not as demanding, a web frontend, with a few pages and input forms allowing for visitors and users to view, login, follow and post messages in plaintext format. So  this just meant that we was working primarily on a web based solution, and therefore should be thinking in a browser based system.

### Choice of Programming Language and Framework / runtime environment
We decided to use Node.js as our language of choice for the rewrite of the Minitwit application. In order to make a qualified decision on the matter, we split some of the most popular languages and frameworks for this type of implementation between us, and researched their pros and cons individually. We then presented our results and collectively decided on the best option based on the research: 

- Ruby on Rails seemed very interesting to us as it was already popular and became increasingly popular. With Ruby on Rails it seems very easy to set up a fairly complex application with very few lines of codes or commands. However, a Ruby on Rails project consists of a large number of files and the framework created many files "behind the scene". "Ruby on Rails is not a minimalist framework, it's a metropolis. One filled with all major institutions needed to run a large, sprawling application like Basecamp or Github or Spotify." We did not feel that we needed a metropolis of a framework for our simple application - we preferred to have a simple and lightweight framework as the application was so small. We found that the time used to understand this framework would be used better spend elsewhere.
- .NET/C# was also looked into. The .NET platform boast a wealth of nuget packages for everything and the dotnet package manager can handle some very sophisticated API templating straight out the box. Due to it's verbosity it was scrapped.
- Java with the Spring framework was investigated but was scrapped due to lack of java-know-how and time.
- Node.js with its npm package manager we found to be the simplest, most efficient and most lightweight language. At the time of research this was some of the most appealing qualities for the implementation language for this project. We also found Node.js to be very well documented, which was a positive thing considering that the language was new to most of us. Further, some of the members of our team had some experience with Node.js, which meant that we did not have to spend as much time on adapting to syntax and environment considering the relatively short time in which had to translate the system.

<!-- - Go with Gorilla ...  -->

Some of the other, less noteworthy frameworks we researched were:
- Crystal with Kemal
- Elixir with phoenix
- Nim with Jester
- Ruby with Sinatra

We found that most of these frameworks were not updated very often or were not often used in production.

### Choice of Database (RDBMS)
Just after translating the Minitwit application to Node.js we made use of a local Sqlite database. This was a fine choice to get a good start with not too many moving parts. We later found that the best options for a database system was either MySQL or Postgres. Sqlite is simply not a production database as it is too simple. It does not scale well and data is easily corrupted. 
It is described later on how we migrated data between databases and between servers.

When deciding between MySQL and Postgres we did not find that many differences for a simple system like ours. Both databases met our requirements and seemed to be more less equally efficient. We decided on using Postgres as we found it to be better "out of the box" and supports a few more data types such as booleans. Further, Postgres is better at handling concurrency than MySQL, which we thought might be a factor for this kind of system. 
(https://developer.okta.com/blog/2019/07/19/mysql-vs-postgres)

The choice to use Postgres as RDBMS turned out to be well made in the sense that we had one of the best performing systems compared to the other groups. The only group with a higher 'latest' was another group using Node.js and Postgres. We also did not have any regrets with the choices over the course of the project.

---
[ [prev page](../chapters/100_preface_and_introduction.md) | [table of content](../table_of_content.md) | [next page](../chapters/201_design_and_architecture.md) ]
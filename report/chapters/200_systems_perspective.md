# 2. System's Perspective

### System design workflow
To mimic the real world of devops the design flow has been an evolvling system. The project started with teardown of the original ITU-MiniTwit to be able to figure out what the system included and what we as "the new team" should replicate and what system weaknesses we should be keen on levitating in the new design.

Here is a brief outline of the evolvement of our system:
- Investigate the legacy systems
- Team & project work strategy (version control, collaborative tools)
- Decide on modern languages/frameworks to replace the old
- Develop first beta (a 1:near 1, replica of the old system)
- Move from legacy 'one physical server' to flexible cloud infrastructure
- Release first beta on public cloud
- Virtualization and container strategy
- Implement a continuous delivery and continuous deployment strategy
- Integrate capabilities for user simulator through API calls
- Implement system monitoring and logging
- Perform security review
- Rethink system for scalability and accessibility
- Revise our system for maintainability and technical debt

### Legacy system
The legacy system was made with an outdated version of Flask (python framework), a local file based SQLite database and a few bash scripts. It was designed to live on a single physical server with no thoughts of software concurrency and no strategy for operation and maintenance. This was the main parts to think into the choice of af new system.

The basics of the application and software was not very demanding. The system consisted of a web frontend, with a few pages and input forms allowing for users to view, login, follow other users and post messages in plaintext format. This meant that we were working primarily on a web based solution, and therefore should be thinking in a browser based system.

### Choice of language / runtime environment
We decided to use JavaScript and Node.js as our language and runtime environment of choice for the rewrite of the Minitwit application. In order to make a qualified decision on the matter, we split some of the most popular languages and frameworks for this type of implementation between us and researched their pros and cons individually. We then presented our results and collectively decided on the best option based on the research: 

- Ruby on Rails seemed very interesting to us as it was already popular and is becomming increasingly popular. With Ruby on Rails it seems very easy to set up a fairly complex application with very few lines of codes or commands. However, a Ruby on Rails project consists of a large number of files and the framework created many files "behind the scene". The following is stated on their official home page: "Ruby on Rails is not a minimalist framework, it's a metropolis. One filled with all major institutions needed to run a large, sprawling application like Basecamp or Github or Spotify." We did not feel that we needed a metropolis of a framework for our simple application - we preferred to have a simple and lightweight framework as the application was so small. We also found that the time used to understand this framework would be better spent elsewhere.
- .NET/C# was also looked into. The .NET platform boast a wealth of nuget packages for everything and the dotnet package manager can handle some very sophisticated API templating straight out the box. Due to it's verbosity it was scrapped.
- Java with the Spring framework was investigated while it provides good basis for configuring a web app and has a lot of pre-exisiting libraries, meaning we would not have to reinvent the wheel, but it was scrapped due to lack of java for web know-how, time and the steep learning curve that comes with java spring.
- Node.js with its npm package manager we found to be the simplest, most efficient and most lightweight language. At the time of research this was some of the most appealing qualities for the implementation language for this project. We also found Node.js to be very well documented, which was a positive thing considering that the language was new to most of us. Further, some of the members of our team had some experience with Node.js, which meant that we did not have to spend as much time on adapting to syntax and environment considering the relatively short time in which had to translate the system.

Some of the other, less noteworthy frameworks we researched were:
- Crystal with Kemal
- Elixir with phoenix
- Nim with Jester
- Ruby with Sinatra

We found that most of these frameworks were not updated very often or were not often used in production.

---
[ [prev page](../chapters/100_preface_and_introduction.md) | [table of content](../table_of_content.md) | [next page](../chapters/201_design_and_architecture.md) ]

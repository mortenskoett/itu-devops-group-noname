## 4.01 Lessons Learned Perspective

A challenge in this project has been the process of picking and using the right tools, like server provider, programming language, framework and services all of which the group had limited to none experience with. Usually the tools like version control and programming language is decided before the start of a project, but this time around we had to carefully consider and argue for choosing one over another. There exist a lot of different ways of achieving the same and choosing the best fit for a project is difficult. However, building the project in a manner that components or technologies can easily be switched out enabled us to reconsider our choices, and we learned how this could make these decision less risky and difficult.

Further, it was a big challenge to develop and improve the system while it was running in 'production' with users accessing our application at all times. This made it much more of a challenge to change parts of the system, such as migrating the database. We had to be creative in ways to solve these problems for a system in 'production'

### Continuous deployment

One of the purposes of this project was to maintain the web app while also adding new stuff to the project. Bug fixing has played a big role whenever we experienced problems with the simulator returning error codes. Whenever a problem occurred we had to fix it locally, test if the bugs was fixes and then push it to the GitHub repository, see if it passed the tests from the CI/CD pipeline and then push the changes to the release branch from where the automated deploy would take place.
A Lesson learned regards to deployment of the application was that when there are stakes at risk it could be uncomfortable to make a new deployment because of the risk of something going wrong. In this course, there was no critical risk of a deployment failure but the fact that there was a simulator testing our application and releasing the results to graphs in the course repo created stakes for the group and thus the fear of a failed deployment.

Due to this fear, we did not deploy every time a new feature was implemented, or a new service was added. Looking back now it has become clear what practices could have helped with the continuous delivery, and maybe changed it to continuous deployment. We started with continuous delivery because it required less automated testing, it gave us the extra trigger button control before deploying to the server and we could change to continues deployment later in the project. One thing the project could have benefited from and helped to reduce the fear of deployment would have been more testing. We had basic functionality testing but it did not give us enough confidence to deploy as often as we would have liked to, meaning our testing of the application could have been more thorough.

A reason we would want to update from the continuous delivery to deployment is to limit the human interaction as much as possible and making it even more automated. Another measure we could have taken towards making a continuous deployment would be setting up a test server with a production like environment and have some automated testing on the test environment, which in turn would give us greater confidence in deployment and eventually making the deployment process automated as well.
Deploying more often would have been the goal here, so we could keep updating the application with the new services and bug fixes and make sure that it would still function. It would make the troubleshooting easier because there would be less code to review for bugs. We learned that in order to have a great automated setup for both delivery and deployment great in depth automated testing is essential.

### The system went down unnoticed

One of the biggest issues we ran into were around two weeks before the simulator stopped when we noticed our system had been down for 5 days. In this period we had not been handling any of the simulator's requests. This was first discovered by a random check on the server. It turned out that there was a bug in the user interface of our application  which meant that when someone would access the UI content via the browser the app including the simulator endpoints would crash. Our Docker container did not restart itself after crashing and we realised that there were additional measures we could have taken to prevent this or at least prevent the down time. 

Before the system went down we only had a few errors in the handling of simulator requests. The down time of the system caused a large number of connection errors because our service was unavailable but it also caused other errors for later requests. We did not handle these requests as the simulator expected, because we had not processed the register requests for the users trying to post messages or follow each other.

After some discussion about what we could have done differently we decided that some measures could have prevented, or at least minimized the downtime of the app, and it came down to these three things:
- Thorough testing
- Failsafe (No single point of failure)
- Monitor alerting

Firstly, the downtime two weeks prior to the simulator stop was due to a bug in the UI this bug would most likely have been caught if our testing had been more extensive. The lack of tests also manifested fear of a failed deployment (described below). One thing we could have done would have been updating our workflow to require more testing before being able to add new services, features or visual upgrades. Of course, it would be impossible to catch all bugs of the system, but we would have found some of the more critical ones like the UI bug and reduced the risk of a system crash.

This bug also exposed a single point of failure weakness in our system. We had no scripts, services or anything to recover the faulty state of the system. One of the last things we worked on getting to work as described before, was setting up the Docker swarm on our server which could have eliminated this type of single point of failure, where a single container crashes and can’t return to a working state and no other container takes over the work. The Docker swarm would have respawned a new task with a working task and always have a working copy open. Also when updating the Docker images, the swarm could be configured to update one node at a time, to make sure there were at least one working node at all time.

Finally, as we shortly described in section [3.03](../chapters/303_monitoring_and_logging.md), if we had setup our monitoring system to notify us in the case of critical errors in the system, the system would not have been down for several days.

This experience made us realize the importance of proper testing and monitoring of our system. As the system went down very late on the project we did not write any further tests but we made the monitoring system notify us if the system would go down again. The way we made a fix were to redeploy our service to the server.

### Automation as documentation

Something that we did a lot was to automate tedious typing tasks or cluster function calls into combined functionality such as starting servers or doing backups. This proved to be very effective, to the point that it almost had a documenting effect.

Consider the following snippet taken from one of our most used scripts during this project `run.sh`:

```
./run.sh <arg> <opt>
<arg>         <opt>       <action>
app           -d          run app container
test          -d          run python test container
eslint        -d          run eslint test container
db            -d          run postgres database container
monitor       -d          run monitor aka prometheus/grafana container
logging       -d          run logging services
build                     rebuild all images
push                      push newest docker images to Dockerhub
pull                      pull latest docker images from Dockerhub
clean                     remove everything to get a clean slate
down                      take everything down
status                    show status of docker setup
setup_run_app             setup a complete running application using productiondatabase
setup_run_test            setup a complete testing setup and run python tests
setup_local_app           setup a complete running application using local db
```

Not minding the bloated condition of the script at this point in time, the interesting point is, that it succeeded in being an effective tool in handling repetitive tasks but it also succeeded in being a way to facilitate discussions about such things as deployment order or ways to deal with minor problems and inconveniences in an effective way. 

Because the implementation, the API and the documentation in this case is the one-and-same-thing, it feels like there is not a long way from developing a functionality to making others understand and use it properly. Furthermore it became clear that the more a functionality is used by others than yourself, the more potential it has.

Having several control-scripts such as this one placed throughout the code base, with the intention of automating some functionality, might feel like a hacky solution, but for our group it worked very effectively.

### Docker compose

Most of the complexity in the `run.sh` script stems from having our application split into multiple docker-compose files. The original reason for doing so, was that we found it necessary to wait for certain subsystems to be ready, when composing different subsystems. For instance, we had to wait for the database to start up completely before running the tests, as the test subsystem did not wait for the application and database to be ready. 

Having many docker-compose files also allows up to spin up the subsystems that we need, e.g. when developing and testing the application locally, you might not need to have the logging and monitoring subsystems running as well. 
On the other hand, we could no longer run the entire system using a single `docker-compose up`, and we had to create a run script to orchestrate the different compose files. 

As we have grown more clever on docker and docker-compose, we have discovered new ways of managing our difficulties. We found that each service in a docker-compose file can also be started individually, and so we believe having a single compose file would be beneficial; this would reduce the complexity in the run.sh script and the amount of files that has to be managed. 

Then we could easily spin up all services of this docker-compose file together, as well as start them individually when we needed to ([section 3.05](../chapters/305_scaling_and_load_balancing.md) describes how this setup was decided on in our scalable solution).  
We also found that a common way to manage different requirements and variables for different environments when using docker-compose, is to use overriding docker-compose files. This would have been very beneficial for defining different environment-variables in development, testing and deployment, but using the same consistent base docker setup. 

Our friend in this project has been the `run.sh` script, making it easy to spin up the desired containers when needed, but we have also seen that scripting easily becomes complex and hard to maintain and updated as the codebase evolves.

### Simple vs complex

The MiniTwit application went from a small simple (but also outdated) python based web application, to a big scoped complex project due to the added services like monitoring and scripts for automated tasks and testing.

Today we can easily boot up the development environment or a working application on any device with a single command, without having to install any dependencies or worry about differences in the environment on the different devices. This is a huge improvement compared to the amount of work that had to be done in the beginning of the course, in order to get the initial Minitwit application running on our own devices. Code analysis, monitoring and visualization of the data, enables us to be much more efficient in figuring out where the code or system needs to be improved further. The benefits of the tools that we have learned to use, for containerization, CI and CD, code analysis and monitoring are inevitable, and we believe they will be very beneficial to us in the future when developing scalable and maintainable solutions.

While these tools have greatly improved the scalability, maintainability and robustness of the initial Minitwit application, it has also introduced a lot of complexity. We started with a functioning Minitwit application, consisting of very few files all together, which has now evolved into a rather complex system of artifacts and services. This complexity should not be neglected, as it makes the code harder to understand and maintain for external developers. Even though everything is well documented, adding more tools also adds more documentation to read, understand and maintain as the system evolves. Therefore, the benefits and added complexity should be compared and considered before adding these tools to a project. Some tools, like automatic linting or code review when pushing to branches on Github, requires very little setup and adds much value to almost any project. However, if your application does not need three replicated running applications, then implementing Docker Swarm may not be the initial place to add this complexity.

It does however help to understand these tools, in order to build the initial application structure in a manner that can be scaled, if needs be. For example we had to migrate our database twice, which turned out to be a complicated and time consuming task. We now know that choosing the right database technology and having the database separate of the application from the beginning, makes a better initial design with possibility for scaling the application in the future.

---
[ [prev page](../chapters/400_current_system_state.md) | [table of content](../table_of_content.md) | [next page](../chapters/402_conclusion.md) ]

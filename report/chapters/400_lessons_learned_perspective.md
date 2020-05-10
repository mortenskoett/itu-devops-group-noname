# 4. Lessons Learned Perspective

<!-- // TODO: Describe how we tried to automate things so that -->

### More than a simple application
<!-- // TODO: **Skal nok omskrives en del** -->
<!-- // TODO: Beskriv: Complexity rises when the system is built out. We want a modifiable system which introduces complexity -->

At first MiniTwit was a small outdated python based web application that was due for an upgrade. The task of upgrading the MiniTwit consisted of rewriting scripts, create the same application with a new codebase thus making it runable on other systems than the one it origened from, and apply DevOps. This process turned out to be more complex than first anticipated, becuase many of the tools and frameworks were new to the group. The MiniTwit dows not have more functionality than it used to have yet our version has grown into a much more complex system becuase of the tools and subsystems added to the project which helped with the continuose integration and continouse delivery.

### Deploy more often
<!-- // TODO: Skriv om continous delivery vs continous deployment 
https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment -->

A Lesson learned regards to deployment of the application was that when there are stakes at risk it can be uncomfortable to make a new deployment becuase of the risk of somthing going wrong. In this course there was no critical risk of a deployment failure but the fact that there was a simulator testing our applications and releasing the results to graphs in the course repo created stakes for the group and thus the fear of risk of failure.

Due to this fear we did not deploy everytime a new feature was implemented, or a new service was added. Looking back now it has become clear what practises could have helped with the continouse delivery, and maybe changed it to continouse deployment. We started with continouse delivery because it required less automated testing, it gave us the extra trigger button control before deploying to the server and it could be updated to contionuse deployment at a later time. One thing the project could benefit from and helped to reduce the fear of deployment is more testing, we had basic functionalty testing but it did not give us enough confidence to deploy as often as we would have liked to, meaning our testing of the application could have been more thourough.
A reason we would want to update from the continuose delivery to deployment is to limit the human interaction as much as possible and making it even more automated. Another measure we could have taken towards making a continouse deployment would be setting up a test server with a production like enviroment and have some automated testing on the test enviroment, which in turn would give us greater confidence in deployment and eventually making the deployment process automated as well.

Deploying more often would have been the goal here, so we could keep updating the application with the new services and make sure that it would still function, it would make the troubleshooting easier, becuase there woul be less code to review for bugs. We learned that in order to have a great automated setup for both delivery and deployment, great in depth automated testing is essential.

### System went down unnoticed
When there was around two weeks left of the simulator running we had the second highest 'latest' of all the groups and very few errors - looking at the figures on the course Github presenting the simulator data. 

By far the majority of the simulator errors are caused by the time our system was down. Because we missed a large number of registers our system reported errors on many of the following posting of messages and following/unfollowing between users.

We discussed what we should had done differently in order to have avoided ending up in this situation. We found the three following things to be the major ones we should had looked at earlier on.
- Better testing
- Failsafe...
- Monitoring alerting

Again better testing would had helped us since it could have found the bug that made the system crashed before deploying. This could have prevented the system from being down. The bug turned out to be in our user interface which we did not have any tests for. Better testing could decrease the chances of the system crashing but we would never be sure that our system did not have any bugs, so testing alone would not be sufficient to prevent this situation from occuring again.

Using something like Docker Swarm or a loadbalancer could make another application take over the workload while the crashed application would try to restart. In our case this would have probably prevented the system for being down for very long as the bug was in the UI which we rarely used. 

Finally, as we shortly described in section 3.04, if we had setup our monitoring system to notify us in the case of critical errors with the system, the system would not have been down for several days.

This experience made us realize the importance of properly testing and monitoring our system. As the system went down very late on the project we did not write any further tests but we made the monitoring system notify us if the system would go down again and we looked at how to use Docker Swarm for our system.

### Automation as documentation
Something that we did a lot was to automate tedious typing tasks or cluster function calls into combined functionality such as starting servers or doing backups. This proved to be very effective, to the point that it can almost be described as documentation of the code base. 

Consider eg. the following snippet taken from one of our most used scripts during this project `run.sh`:

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

Not considering the bloated condition of the script at this point, it still communicates actions that are very useful, easy to understand and easy to extend by other developers. It also makes it easier to discuss and see solutions to minor problems or inconveniences because there is a starting point for everyone to work with.

Having a control-script such as this at various places throughout the code base, with the intention of automating some group of commands might feel like a hacky solution, but for this group it worked very effetively.

---
[ [prev page](../chapters/306_scaling_and_load_balancing.md) | [table of content](../table_of_content.md) | [next page](../chapters/401_current_system_state.md) ]

# 4. Lessons Learned Perspective

### More than a simple application
**Skal nok omskrives en del**
We have learned that developing and maintaining a web application consists of much more than just writing code. The system that we took over consisted of more or less three files and a database. This very simple system fulfilled the API requirements and our system does not have much more 'functionality'. Yet, our system is much larger and more complex now. This is because of the  tools and subsystems that help us in developing and maintaining our system. Without these tools these tasks would have been far more challenging.

### Deploy more often
Even though we had set up a CI/CD pipeline which allowed us to delpoy our system very easily we did not deploy as often as we would have liked to. This was because that we were often scared to deploy our code as we were uncertain whether it would crash our system. We had very good results on the simulator figures that we did not want to ruin by our server being down. One of the main reasons we were scared to deploy was that we did not have sufficient testing of our system. If we had had better testing we would be more comfortable deploying our system as the risk of crashes would be reduced.

Something that we often missed when we were about to deploy our system was a production like environment that would be close to a one-to-one copy of our production setup. In this way we could test the deployment, 'functionality' and performance of our system in an environment identical to the production environment. We often found that our system was running fine locally but we were in doubt about if it would work the same way in our production environment - for istance would the deployment itself go as planned.

Deploying more often would have ... .

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

---
[ [prev page](../chapters/306_scaling_and_load_balancing.md) | [table of content](../table_of_content.md) | [next page](../chapters/401_current_system_state.md) ]
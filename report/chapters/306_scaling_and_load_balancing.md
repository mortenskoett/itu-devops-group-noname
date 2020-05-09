## 3.06 Scaling and Load Balancing

### External Database
Orignally our system used a database running on the same server as our other subsystems. In order to have our system be scalable we wanted to have an external database server so that we could have multiple nodes with duplicates of our application use this external database. We therefore had to migrate our existing database to another server. We had to do the migration just before our system would use the new database server so that we would lose the least amount of data. 

To do this we wrote a script that would copy our existing database and transfer it to the new database server. When the database was succesfully transfered, the script would ... the database.

We made our deployment script run the migration script so that when we changed our code to use the external database, we would first migrate the database and then deploy the new code. In this way our system did not have any downtime but we lost a bit of data as it took around 30 seconds to migrate the database - we lost the data for the requests that we recieved between starting the migration and deploying our code to make use of the new database. We found the migration to be fairly smooth and succesful.

### Docker Swarm
In order to make our system scalable and ... resistent we decided to make use of Docker Swarm. We decided on Docker Swarm instead of using a load balancer because ... .

---
[ [prev page](../chapters/305_sec_assessment.md) | [table of content](../table_of_content.md) | [next page](../chapters/400_lessons_learned_perspective.md) ]
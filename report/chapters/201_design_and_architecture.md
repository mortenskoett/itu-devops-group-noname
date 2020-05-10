## 2.01 Design and Architecture
This chapter seeks to describe the overall architecture of the implementation as well as to give an understanding of how the individual subsystems are physically positioned.

### Minitwit application architecture
The following is an overview of the modules in the application. The diagram shows the layers that we used to partition the code base into layers of coherence.

![Overview of packages](../images/ch2_packet_overview.png)

The nature of node.js (javascript) happens to be such that the use of interfaces or similar constructs is not natural to use when attempting to define layers of abstraction. Instead we paritioned the modules into layers in an attempt to make a distinction between layers of abstraction in the code. 

#### Handling of a http request
The `server` is the entry point into the application and starts up services to listen on specific ports as well as making a query to the database making sure there is a connection. Whenever a request arrives eg. at an endpoint in the `Api` or through the `WebUI`, the request traverses down into the application until it reaches the `Controller` layer. Here the request is dismantled and only data needed to process the request further continues down into the `Repository` layer, which query the database through the `ORM` objects and make sure the correct data or perhaps appropriate errors are returned. When control once again goes back to the `Controller`, depending on the returned data, it makes sure that an appropriate HTTP response is created and returned to the initial sender of request.

#### Choice of database
Just after translating the Minitwit application to Node.js we made use of a local Sqlite database. This was a fine choice to get a good start with not too many moving parts. We later found that the best options for a database system was either MySQL or Postgres. Sqlite is simply not a production database as it is too simple. It does not scale well and data is easily corrupted. 
It is described later on how we migrated data between databases and between servers.
<!-- // TODO: Insert link to chapter 306 -->

When deciding between MySQL and Postgres we did not find that many differences for a simple system like ours. Both databases met our requirements and seemed to be more less equally efficient. We decided on using Postgres as we found it to be better "out of the box" and supports a few more data types such as booleans. Further, Postgres is better at handling concurrency than MySQL, which we thought might be a factor for this kind of system. 
(https://developer.okta.com/blog/2019/07/19/mysql-vs-postgres)

<!-- 
Maybe move somewhere to the end of the report.
The choice to use Node.js and Postgres as RDBMS turned out to be well made in the sense that we had one of the best performing systems compared to the other groups. The only group with a higher 'latest' was another group using Node.js and Postgres. We also did not have any regrets with the choices over the course of the project. -->


### Deployment overview
The shown deployment diagram gives an overview of where different modules of the system is deployed, and the different applications or artifacts each node is responsible for.

![Overview of deployed components](../images/ch2-component-deployment-overview.png)

The following constitutes all of the subsystems in the Minitwit application. They will be presented in depth later on:
- Minitwit(Application in the diagram) consists of our web application - both the user interface and the API
- Prometheus is used for monitoring our system
- Logstash and Elasticsearch are used to handle the log data of our system
- Grafana is used for visualizing monitoring and log data
- Postgres DB is the database running a docker container on a separate server
- db_backup.tar symbolizes the physical backup of the application database, persisted on an external server.

It can be seen that all the subsystems except for the database run on the same Digitial Ocean droplet. Each subsystem runs in its own Docker container. This makes the system or subsystems very easy to deploy elsewhere. If for instance we wanted to deploy Grafana on a separate server we would just have to specify the new address the service is running at.

<!-- We found that we did not need to distribute the subsystems on multiple nodes for the majority of this project. Our system was very efficient and performed well. From the beginning of the project we had chosen a powerful droplet so we did not have to scale our system vertically. However, having all subsystems on the same node made our system vulnerable as we had a single point of failure. + scaling, therefore later on we ... -->

### The docker setup
// TODO: Udbyg afsnit
The following component and connector diagram gives an overview of the docker network and communication paths in our system. The outer boxes are the two servers, while the inner boxes are the docker containers. The names of the containers are their respective name within the docker network. The image displays what ports on the containers are mapped to what ports on the device, and hence communicates what ports are used to access the service from the outside, and what ports are used to access the ports within the docker network.

![Overview of docker containers and the networks](../images/ch2-docker_network.png)

---
[ [prev page](../chapters/200_systems_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/202_dependencies.md) ]

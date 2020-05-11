## 4.01 Current System State
<!-- // TOOD:
    db deployment - hvad betyder det? hvad mangler?
    -->

<!-- // TODO: Kan vi sige deploy her eller indeholder det også at starte en ny server op? -->
The system is currently not running on any servers but it can be easily deployed on a server using the run.sh script. Because all subsystems run in docker containers, the only requirement is a docker installation on the machine that the system shall be deployed on.

### The Minitwit setup guide
You need Docker installed (see '[Set up your Docker environment](https://docs.docker.com/get-started/)')

To start the application with a local database container run the commands:
```
./run.sh build
./run.sh setup_local_app
```
The web application is available on `localhost:5000`  
The api is available on `localhost:5001`  
The Swagger UI is available on `localhost:5001/api-docs/`  


To also run the monitoring and logging subsystems respectively, run the commands:
```
./run.sh monitor -d
./run.sh logging -d
```
Elasticsearch log data is available on `localhost:9200`  
Grafana is available on `localhost:3000`


<!-- ### System (re)deployment
When deploying the system in production mode the system will connect to an external database. The system can also be deployed in developer mode which will use a local database container instead.

The server needs the following variables in the environment or a .env file in the project root.
DOCKER_USERNAME=<your_username>
DOCKER_PASSWORD=<your_password>

To start the application in production mode run the following command: ./run.sh setup_run_app
To start the application in developer mode run the following command: ./run.sh setup_local_app

When deploying the system it can be decided whether or not to deploy the individual subsystems used for monitoring and logging. To run the monitoring and logging subsystems respectively, run the commands:
```
./run.sh monitor -d
./run.sh logging -d
```

The tests for the system can be run using the following command: `./run.sh setup_run_test` -->

### Development & maintainability
All project documentation, credentials, source code, tests and deployment scripts are stored on our two github repositories. This means that including new members in our team only requires to add them to the project repositories. If we as a team is to be replaced all knowledge can be transferred and (commit) history can be reviewed easily.

The chosen languages and tools are all industry standards, meaning that it will all be fairly adaptable by others. Only custom scripts like /run.sh might be a challenge, but we have tried to make it fairly understandable with comments.

### Docker compose
Most of the complexity in this script stems from having our application split into multiple docker-compose files. The original reason for doing so, was that we found it easier to wait between subsystems to be ready, when composing different subsystems. For instance, we had to wait for the database to start up completely before running the tests, as the test subsystem did not wait for the application and database to be ready. Having many docker-compose files also allows up to spin up the subsystems that we need - e.g. when developing and testing the application locally, you might not need to have the logging and monitoring subsystems running as well. On the other hand, we could no longer run the entire system using a single docker-compose up commmand, and we had to create a run script to orchestrate the different compose files. As we have grown more clever on docker and docker-compose, we have discovered new ways of managing our difficulties. We found that each service in a docker-compose file can also be started individually, and so we believe having a single compose file would be beneficial; this would reduce the complexity in the run.sh script and the amount of files that has to be managed. Then we could easily spin up all services of this docker-compose file together, as well as start them individually when we needed to (section 3.06 describes how this setup was decided on in our scalable solution). We also found that a common way to manage different requirements and variables for different environments when using docker-compose files, is to have overriding docker-compose files. This would have been very beneficial for defining different environment-variables in development, testing and deployment, but using the same consistent base docker setup. Our friend in this project has been the ./run.sh script, making it easy to spin up the desired containers when needed, but we have also seen that scripting easily becomes complex and hard to maintain and updated as the codebase evolves.

### Technical debt
As our system is newly developed it should not introduce much technical debt but technical debt is forming fast, especially when using things like Node.js, where many dependencies are automatically acquired.

We have used the tool SonarCloud to analyze the software quality and technical debt of our code. The result is including only code files like JavaScript and Python and not config files like docker and vagrant. The image below shows the result.

![SonarCloud Overview](../images/ch4_sonarcloud_1.png)

The result shows that the problems are all fairly small issues. They concern some code duplication, not using https for all request and a variable that might be null. Things that are easily fixed in an upcoming commit.

SonarCloud does not analyze the tools used for continuous integration and continuous delivery. These tools can also introduce technical debt in the system. Even though using these tools simplifies and structures the overall development process it also make us depend on external companies to be present for our system to be worked on as intended. If Github is no longer an available service, then our CI/CD chain does not work and we have to deploy our code in other ways. The CI/CD chain of our system only depends on large companies and industry standard services that we do not expect to introduce technical debt in the near future.

### Overall
There are of course always many things we would like to improve, but for the most part, we feel our system is acceptable. We have a working deployment strategy, monitoring and logging in place and a fairly success in serving our users (the simulator) with only a few hiccups.

So on most fronts we have a complete system that in the eyes of continuous integration is easily maintained and able to be extended with little to no downtime.

If more development should take place, the main thing we would work on is making the system easily deployable with docker swarm for load balancing so that the system is scalable. Further, we would extend our test suite so that we could be doing continous deployment instead of delivery.

---
[ [prev page](../chapters/400_lessons_learned_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/402_conclusion.md) ]
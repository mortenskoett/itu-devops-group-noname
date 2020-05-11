## 4 Current System State

The system is currently not running on any servers but it can be deployed on a server by using the `run.sh` script. Because all subsystems run in docker containers, the only requirement is a docker installation on the machine that the system shall be deployed on.

### Starting the application
Install `docker` and `docker-compose` (see online '[Set up your Docker environment](https://docs.docker.com/get-started/)')

To start the application with a locally running database container, run the following commands from `./dockerfiles/`:
```
run.sh build
run.sh setup_local_app
```
The web application is now available on `localhost:5000`  
The API is now available on `localhost:5001`  
The Swagger UI is now available on `localhost:5001/api-docs/`  

To also run the monitoring and logging containers respectively, run the commands:
```
run.sh monitor -d
run.sh logging -d
```
Elasticsearch log data is now available on `localhost:9200`  
Grafana is now available on `localhost:3000`


#### System re-deployment
When deploying the system in production mode the system will connect to an external database using configurations set in `./server/configs.js`.

Currently the following variables are needed in the environment of the server, to be able to pull docker images from Dockerhub.
```
DOCKER_USERNAME=<your_username>
DOCKER_PASSWORD=<your_password>
```

To start the application in production mode run the following commands from `./dockerfiles/` on the production server:
```
run.sh pull
run.sh build
run.sh setup_run_app
```

This command will use a different docker-compose setup with different environment variables set, that are read by the nodejs runtime when instantiating the application.

When deploying the system it can be decided whether or not to deploy the individual containers used for monitoring and logging. 

This step could be done by the build server to facilitate deployment in the pipeline, which is what we did.

### Development & maintainability
All project documentation, credentials, source code, tests and deployment scripts are stored on our two Github repositories. This means that adding new members to our team requires to add them to the project repositories. If the current team is to be replaced, all knowledge can be transferred and (commit) history can be reviewed easily. Due to the public nature of the repository there were some hassle in trying to hide away secrets such as SSH keys etc. The solution was the separate private repository.

The chosen languages and tools are all industry standards, meaning that it will all be fairly adaptable by others. Only custom scripts like /run.sh might be a challenge, but we have tried to make it fairly understandable with comments.

#### Code quality:
It is difficult to pinpoint a single focus-point in relation code quality for this project. We believe we have focused on 3 of the 4 perspectives from the Kitchenham paper as described below. When talking about code quality in this project, it may therefore refer to any or a combination of the three perspectives. 

- **User view**, in terms of reliability and response time:
  1) making the system reliable as well as scalable for our end users 
  2) maintaining the system without any downtime or disturbance for our end users
  3) monitoring our response times to improve the quality for the end users.
- **Product view** in terms of maintainability, static code test. We introduce code analysis in order to detect technical dept in commits before it becomes technical debt in the shared code base. 
- **Manufacturing** in terms of number of defects after deployment and number of reported errors. We have introduced some tools to help us decrease rework-costs of defects, e.g. we log exceptions and errors in order to find the source of a defect faster than if we had no logging and had to debug the system manually. 

##### Summing up quality
This is an overview of the characteristics implemented that we find to heighten the code quality:
- Backups of database - we can recover from failures
- Docker containers - easy to swap components or deploy the server elsewhere
- NPM - easy to install new libraries for the code
- Monitoring/logging - (should) let us know when failures occur (or if we need to work on some problems)

Finally we have setup automated static code analysis and find that we have few warnings, nevertheless there is always room for improvement such as a better regression test suite, refactoring of some parts of the code, or making use of dependency injection, e.g. by introducing a more stricly typed language such as Typescript. 

#### Maintainability:
All in all we believe that the mailability of the system has greatly improved from the start of the project, despite that there is still great room for more improvements. 

- The next natural step would not be to put out a fire but instead to optimize and move forward into a Docker Swarm setup. 
- The code base is architected to be understandable and easy to maintain because of modularization and layers.
- Because we have strayed away from what seems to be typical Docker conventions, this might be an issue for new developers, even if the automating scripts are self-documenting.

#### Technical debt
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
[ [prev page](../chapters/305_scaling_and_load_balancing.md) | [table of content](../table_of_content.md) | [next page](../chapters/401_lessons_learned_perspective.md) ]

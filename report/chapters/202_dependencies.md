## 2.02 Dependencies
The only requirement for a machine to run a local version of our system is that Docker is installed since all our subsystems run in Docker containers. Using the run.sh script the docker images can be build and started. However, in order to develop, maintain and deploy the system, there are quite a large number of dependencies. These dependencies of the system are depicted in the directed acyclic graph below (a larger picture is appended in Appendix B).

<!-- DEPENDENCY GRAPH1 (har vi alt med?) -->
![Dependency graph 1](../images/ch2_dependencies_all.png)

The graph depicts all artifacts, installed technologies and services that we depend on to develop, run, build and deploy our code (excluding the application specific files and Node.js dependencies, which are depicted later)<!--, that is both the compiletime and runtime dependencies -->. At the root of the graph is CircleCI as this is the service that is used to start the deployment of our system - nothing else in our system it dependant on that.

CircleCI depends on the CircleCI config file and our Github repository from which it fetches the project. The CircleCI config file depends on some services in order to deploy the system. This is described in section 3.01. Further, it depends on the run.sh and backup.sh scripts. The run.sh script is the equivalent of the control.sh of the original system. With this script it is possible to build and run the subsystems via Docker. The backup.sh script is used to regularly create a backup of the production database and store it on an external server (home.oleandersen.net).

The run.sh script is dependent on a number of docker-compose files to build and run the subsystems. Our application is divided into a number of separate docker-compose files, which composes different services in the application, like logging, monitoring, tests etc. Reasoning and discussion of this can be found in section 4.01, but we believe a single docker-compose file would have been a better solution, and that is the setup we decided on in our scalable solution (see section 3.06).

Each docker-compose file is dependent on zero or more dockerfiles, which are dependent on services and/or files in order to be build and run. Base images are depicted by square-brackets, e.g. \[node:10-alpine\].

In this graph it is depicted that the package.json file, which is needed to start the Node.js application, is only dependent on the application code in server, views, and static (which are depicted together for simplicity). The package.json file describes the list of libraries that our application is dependent on. These library dependencies are shown in the figure below (a larger picture is appended in Appendix B).

![NPM library dependencies](../images/ch2_dependencies_npm.png)

This figure shows the dependencies of our Node.js application - the JavaScript code - based on the Package.json file. To run the application, the device needs to have Node.js, NPM and these libraries, which are installed by running the command "npm install". However, when deploying the code, we use a docker container with Node.js and NPM installed and then run "npm install" inside the container, before spinning up the application. Therefore, with the help of containerization, the machine itself on which the system is deployed does not need to have Node, NPM or any of the libraries installed - it only depends on Docker.

The dependency graph above helps get an overview of the libraries the code depends on. This overview is important when looking at the technical debt of the system. We can investigate these libraries and figure out the following:
- Are these libraries updated regularly or outdated?
- Are they well documented?
- Are they widely used?
- Know flaws or vulnerabilies?
<!-- Containerization help minimize the impact of the first one. Without containerization, if a library is not regularly, it might end up being incompatible with other technologies in our system. However, because we are using docker images, we know that the technologies in the environment are at a stage where they are compatible. -->

If some of the libraries our code depends on, depends on an outdated library then so does our code. This could be a library that is vulnerable to malicious attacks. These graph could be useful in detecting such libraries that our code indirectly depends on. To help mitigate this risk, we should have set up GitHub to provide warnings about deprecated dependencies in our code base, but we did not do this.

---
[ [prev page](../chapters/201_design_and_architecture.md) | [table of content](../table_of_content.md) | [next page](../chapters/203_interactions_of_subsystems.md) ]
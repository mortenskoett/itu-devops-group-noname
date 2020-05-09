## 2.02 Dependencies

### Notes from session 3:
In class, we define a software arcitecture as *a tangible machine-readable document created during software development. Examples are requirement specification documents, design documents, source code and executables.* (ISO/IEC 19506:2012 Information technology — Object Management Group Architecture-Driven Modernization (ADM) — Knowledge Discovery Meta-Model (KDM)).

Tasks:
Keep track of your dependencies. That is, all technologies, services, runtime and build-time dependencies should be logged in a corresponding file and/or visualization.
_____________________________

The following is a map of the artifacts and all dependencies for the application.

DEPENDENCY GRAPH1 (har vi alt med?)

This directed acyclic graph depicts the dependencies of our system. At the top of the graph is the config file for CircleCI as this is the file that is used to deploy our system. The graph depicts both files and services that we depend on to deploy our code - that is both the compilation of the code and running the code.

As can be seen in the graph we have multiple docker-compose files. The reason for this is that it made it easier to wait between deploying the individual subsystems. We had to wait for the database to start up completely before starting our application, which would connect to the database. Instead of having multiple different docker-compose files we should have just hade a single one and then we could have started the services of this docker-compose indivdually when we needed to. This is the setup that we have decided on in ... . This simplified the docker setup signifacantly. (skal sidste del stå her?)

DEPENDENCY GRAPH2
This figure shows the dependencies of our application - the Node.js code. This graph has been made based on our Package.json file, which contains a list of the libraries that are needed to run our code. These libraries are installed by running the command "npm install". We also found an online tool that was able to create the entire dependency graph also depicting the dependencies of the libraries shown in our dependency graph above. As this graph was huge and contained libraries we had never seen before we did not find it very helpful. We therefore chose not to include the dependencies of our dependencies. (giver det mening? eller slet de sidste sætninger)

---
[ [prev page](../chapters/201_design_and_architecture.md) | [table of content](../table_of_content.md) | [next page](../chapters/203_interactions_of_subsystems.md) ]
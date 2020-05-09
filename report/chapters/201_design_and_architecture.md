## 2.01 Design and Architecture

The following is an overview of the devices in our system, and the different applications or artifacts they are responsible for.

![Overview of deployed components](../images/ch2-component-deployment-overview.png)

The following is an overview of the docker network and communication paths in our system. The outer boxes are the two servers, while the inner boxes are the docker containers. The names of the containers are their respective name within the docker network. The image displays what ports on the containers are mapped to what ports on the device, and hence communicates what ports are used to access the service from the outside, and what ports are used to access the ports within the docker network.

![Overview of docker containers and the networks](../images/ch2-docker_network.png)

**should this be under logging and monitoring?** The following is an overview of how logging works in the system. We have the minitwit application as a subsystem, which is the nodejs application providing the web and api interfaces. Now within that system we have controllers, which handle the incomming requests, and the controller communicates with a logger, which writes the logged entrance to a file on the device. The logstash service can now read the log-file and process the entrances into the right format. It sends the entrances to the Elsatic Search service, which provides storage and fast string searches of our logs entrances. Finally, Grafana accesses elastic search and displays the content in a nice UI.
![Overview of logging subsystem](../images/ch2-logging.png)

---
[ [prev page](../chapters/200_systems_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/202_dependencies.md) ]

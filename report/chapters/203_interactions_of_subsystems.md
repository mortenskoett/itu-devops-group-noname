## 2.03 Interactions of Subsystems

Logging:
The following is an overview of how logging works in the system. We have the minitwit application as a subsystem, which is the nodejs application providing the web and api interfaces. Now within that system we have controllers, which handle the incomming requests, and the controller communicates with a logger, which writes the logged entrance to a file on the device. The logstash service can now read the log-file and process the entrances into the right format. It sends the entrances to the Elsatic Search service, which provides storage and fast string searches of our logs entrances. Finally, Grafana accesses elastic search and displays the content in a nice UI.

![Overview of logging subsystem](../images/ch2-logging.png)
---
[ [prev page](../chapters/202_dependencies.md) | [table of content](../table_of_content.md) | [next page](../chapters/300_process_perspective.md) ]
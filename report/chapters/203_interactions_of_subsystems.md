## 2.03 Interactions of Subsystems
This chapter will zoom in on some of the subsystems and their interactions with each other.

### Logging
For the logging of our system we use the following services:
- Winston, a JavaScript logger.
- Logstash, a data processing pipeline.
- Elasticsearch, an efficient search and analytics engine.

The following is an overview of how logging works in the system:
We have the minitwit application as a subsystem, which is the nodejs application providing the web and api interfaces. Now within that system we have controllers, which handle the incomming requests, and the controller communicates with a logger, which writes the logged entrance to a file on the device. The logstash service can now read the log-file and process the entrances into the right format. It sends the entrances to the Elsatic Search service, which provides storage and fast string searches of our logs entrances. Finally, Grafana accesses elastic search and displays the content in a nice UI.

![Overview of logging subsystem](../images/ch2-logging.png)

We use Winston to write logging statements in our code that will write to our logfile. The data of the logfile is collected by Logstash that will transform the data to json. This json will be sent to Elasticsearch which functions as a database for json that allows us to search in the data efficiently.

We decided to use Winston as our logger since it is a simple lightweight logger that supports our needs. We did not have many requirements for our choice of logger - we just needed to be able to output logs with different priority levels. Winston is the officially recommended setup on Loggly’s documentation for Node (https://documentation.solarwinds.com/en/Success_Center/loggly/Content/admin/node-js-logs-2.htm?cshid=loggly_node-js-logs) so we found it to be a good choice.

We decided to use Elasticsearch as it is a very efficient efficient search engine that has gained a great amount of popularity over the last few years. Elasticsearch is JSON-based and works very well for log data. Logstash is a lightweight tool that allows us to easily ingest our data into Elasticsearch. Elasticsearch and Logstash are part of the increasingly popular ELK stack that allows for collecting logdata and visualizing it. We found that these two tools were the preffered ones as the ELK stack is very modern and scalable. The tools were able to handling the logging for this project but also some tools that we wanted to have experience with as they are widely used.

To visualize the log data we make use of Grafana as for our monitoring dashboard. We initially tried to use Kibana, which is the visualization tool used in the ELK stack. However, we found that Kibana had a large amount of CPU usage. We instead looked for more lightweight solutions but found that Grafana which was already running on our server also was able to visualize data from Elasticsearch - we just had to update the version of Grafana we were using. This was done by simply updating the version number in the dockerfile for Grafana. We therefore use Grafana for visualizing both the monitoring and log data.

### Monitoring services
To monitor our system we make use of Prometheus. Prometheus is a monitoring toolkit that collects data about the machine on which our application is running. Prometheus also allows us to specify metrics in our code that should be collected. The Prometheus data is fetched by the analytics platform, Grafana, which lets us visualize the data in dashboards. 

We have chosen to use Prometheus since it is one of the leading monitoring tools on the market, used by several large IT-companies. Prometheus makes it able to monitor the application as we wanted to in an efficient way.

One of the major reasons for choosing Grafana was also that it is one of the leading tools on the market. Grafana is used by companies such as PayPal, Intel, Ebay, Booking.com and Vimeo. We thought that Grafana would be adequate for this project but also a tool that we wanted to get some experience with. Another requirement we had to the choice of visualization tool was that it supported a variety of data sources so that we could change our monitoring service if we wanted. Grafana supports different data sources and this turned out to be useful when we had to use logging for our system.

Grafana and Prometheus worked well together and it was fairly easy to set up the services as a part of our system. 

### Backing up and restoring data
Bla bla morten

<!-- **A further reason for choosing Prometheus and Grafana is that the lecture notes provided a very thorough guide on how to use the two services...** -->

<!-- Images of dashboard ... -->

---
[ [prev page](../chapters/202_dependencies.md) | [table of content](../table_of_content.md) | [next page](../chapters/300_process_perspective.md) ]
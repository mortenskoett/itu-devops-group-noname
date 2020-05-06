## 3.04 Monitoring and Logging

**Lecture notes**
- manual vs reactive vs proactive x
- whitebox vs blackbox monitoring x
- active vs passive x
- application monitoring x

### Monitoring
In order to monitor our system, we make use of whitebox application monitoring. That is, we monitor the machine on which our application is running as well as the requests the API recieves and the responses the API sends. 

We monitor the following metrics:
- Whether the system is running
- The total number of requests for each endpoint
- The rate of requests to the system
- Number of responses we send for each status code and endpoint
- Average response time for each endpoint and status code
- CPU usage
- Memory usage

The monitoring for this project has been reactive in the sense that our monitoring is autmotatic but we do not monitor our system with a focus on the business outcomes, quality of service and customer experience as is done in proactive mointoring. We mostly used monitoring for making sure our system was running as expected and to check the efficiency of each endpoint in our system. Our monitoring was, however, still manual in the sense that we had to check our monitoring dashboard to get information about the state of our system. This caused some problems that we will discuss later.

If we had actual users we would had used more energy on monitoring the business logic of our system instead of just the application. We did not feel the need to monitor business logic for this project as our only user was the simulator. In order to optimize the results for the simulator we had to ensure that our application was running efficiently which we checked with our application monitoring. 

Because of the data about our application from the simulator we did not do any blackbox monitoring - the figures on the course Github page acted as blackbox testing of our system. If we had not had the simulator data we should setup some monitoring from outside our system to see that we responded correctly to requests.

### Monitoring services
To monitor our system we make use of Prometheus. Prometheus is a monitoring toolkit that collects data about the machine on which our application is running. Prometheus also allows us to specify metrics in our code that should be collected. The Prometheus data is fetched by the analytics platform, Grafana, which lets us visualize the data in dashboards. 

We have chosen to use Prometheus since it is one of the leading monitoring tools on the market, used by several large IT-companies. Prometheus makes it able to monitor the application as we wanted to in an efficient way.

One of the major reasons for choosing Grafana was also that it is one of the leading tools on the market. Grafana is used by companies such as PayPal, Intel, Ebay, Booking.com and Vimeo. We thought that Grafana would be adequate for this project but also a tool that we wanted to get some experience with. Another requirement we had to the choice of visualization tool was that it supported a variety of data sources so that we could change our monitoring service if we wanted. Grafana supports different data sources and this turned out to be useful when we had to use logging for our system.

**A further reason for choosing Prometheus and Grafana is that the lecture notes provided a very thorough guide on how to use the two services...**

Images of dashboard ...

Grafana and Prometheus worked well together and it was fairly easy to set up the services as a part of our system. Monitoring our system did not help us that much for this project as for the majority of the project duration not many unusual things were happening to our system or the simulator sending requests. The monitoring would probably have been more useful for a *real* project, for which we could analyze the behaviour of our users and how our system would handle different amounts of load. 

Monitoring could, however, have been very helpful in the last weeks of the project when we did not realize our system had been down for days. If we had setup monitoring to notify us when the app was is down, we would have noticed much sooner. After we realized our system had been down without us noticing we made Grafana send a mail to us in case our system would not respond for some seconds.



### Logging
For the logging of our system we use the following services:
- Winston, a JavaScript logger.
- Logstash, a data processing pipeline.
- Elasticsearch, an efficient search and analytics engine.

We use Winston to write logging statements in our code that will write to our logfile. The data of the logfile is collected by Logstash that will transform the data to json. This json will be sent to Elasticsearch which functions as a database for json that allows us to search in the data efficiently.

We decided to use Winston as our logger since it is a simple lightweight logger that supports our needs. We did not have many requirements for our choice of logger - we just needed to be able to output logs with different priority levels. Winston is the officially recommended setup on Loggly’s documentation for Node (https://documentation.solarwinds.com/en/Success_Center/loggly/Content/admin/node-js-logs-2.htm?cshid=loggly_node-js-logs) so we found it to be a good choice.

We decided to use Elasticsearch as it is a very efficient efficient search engine that has gained a great amount of popularity over the last few years. Elasticsearch is JSON-based and works very well for log data. Logstash is a lightweight tool that allows us to easily ingest our data into Elasticsearch. Elasticsearch and Logstash are part of the increasingly popular ELK stack that allows for collecting logdata and visualizing it. We found that these two tools were the preffered ones as the ELK stack is very modern and scalable. The tools were able to handling the logging for this project but also some tools that we wanted to have experience with as they are widely used.

To visualize the log data we make use of Grafana as for our monitoring dashboard. We initially tried to use Kibana, which is the visualization tool used in the ELK stack. However, we found that Kibana had a large amount of CPU usage. We instead looked for more lightweight solutions but found that Grafana which was already running on our server also was able to visualize data from Elasticsearch - we just had to update the version of Grafana we were using. This was done by simply updating the version number in the dockerfile for Grafana. We therefore use Grafana for visualizing both the monitoring and log data.

We log the following:
- The requests we receive - what endpoint was requested
- The response codes we send and which endpoint the response was sent from (which endpoint was requested)
- Any exceptions that are thrown in the code
- If we receive an unauthorized request, we log the credentials used by the request - if any. This allows us to detect brute force login attacks on the system.

The logging did not help us that much for this project as we already had access to most of the data through our monitoring. We could have logged the call time of the individual functions in our code to get a better idea of exactly where to improve our system. In this way the logging would provide some data that the monitoring could not - besides exceptions and unauthorized access. 

---
[ [prev page](../chapters/303_dev_process_and_tools.md) | [table of content](../table_of_content.md) | [next page](../chapters/305_sec_assessment.md) ]

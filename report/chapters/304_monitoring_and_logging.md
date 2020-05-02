## 3.04 Monitoring and Logging

### Monitoring
To monitor our system we make use of Prometheus. Prometheus is a monitoring toolkit that collects data about the machine on which our application is running. Prometheus also allows us to specify metrics in our code that should be collected. The Prometheus data is fetched by the analytics platform, Grafana, which lets us visualize the data in dashboards. 

We monitor the following metrics:
- Whether the system is running
- The toal number of requests for each endpoint
- The rate of requests to the system
- Number of responses we send for each status code and endpoint
- Average response time for each endpoint
- CPU usage
- Memory usage

We have chosen to use Prometheus since it is one of the leading tools on the market, used by several large IT-companies. ...
- 100% open source
- works with Grafana
- efficient

Why Grafana? ...
- open source
- can be extended using plugins/dashboards
- works with multiple databases
- used by some of the largest tech companies (PayPal, intel, ebay, booking.com, vimeo)

Images of dashboard ...

Grafana and Prometheus worked well together and it was fairly easy to set up the services as a part of our system. Monitoring our system did not help us very much for this project as for the majority of the project duration not many unusual things were happening to our system or the simulator sending requests. The monitoring would probably have been more useful for a *real* project, for which we could analyze the behaviour of our users and how our system would handle different amounts of load. 

Monitoring could, however, have been very helpful in the last weeks of the project when we did not realize our system had been down for days. If we had setup active(?) monitoring to notify us, we would have noticed much sooner. After we realized our system had been down without us noticing we made Grafana send a mail to us in case our system would not respond for some seconds.


### Logging
For the logging of our system we use the following services:
- Winston, a JavaScript logger.
- Logstash, a data processing pipeline.
- Elasticsearch, an efficient search and analytics engine.

We use Winston to write logging statements in our code that will write to our logfile. The data of the logfile is collected by Logstash that will transform the data to json. This json will be sent to Elasticsearch which functions as a database for json that allows us to search in the data efficiently.

We decided to use Winston since it is a simple lightweight logger that supports our needs. We did not have many requirements for our choice of logger - we just needed to be able to output logs with different priority levels. Winston is the officially recommended setup on Loggly’s documentation for Node (https://documentation.solarwinds.com/en/Success_Center/loggly/Content/admin/node-js-logs-2.htm?cshid=loggly_node-js-logs) so we found it to be the best choice.

We decided to use Elasticsearch as it is a very efficient efficient search engine that has gained a great amount of popularity over the last few years. Elasticsearch is JSON-based and works well for log data. (DATA FRA UNDERVISNING)
Logstash allows us to easily ingest our logdata into Elasticsearch. Elasticsearch and Logstash are part of the increasingly popular ELK stack that allows for collecting logdata and visualizing it.

To visualize the log data we make use of Grafana as for our monitoring dashboard. We initially tried to use Kibana, which is the visualization tool used in the ELK stack. However, we found that Kibana had a large amount of CPU usage. We instead looked for more lightweight solutions but found that Grafana which was already running on our server also was able to visualize data from Elasticsearch. We therefore use Grafana for visualizing both the monitoring and log data.

We log the following:
- The requests we receive - what endpoint was requested
- The response codes we send and which endpoint the response was sent from (which endpoint was requested)
- Any exceptions that are thrown in the code
- If we receive an unauthorized request, we log the credentials used by the request - if any. This allows us to detect brute force login attacks on the system.

The logging did not help us that much for this project as we already had access to most of the data through our monitoring. We could have logged the call time of the individual functions in our code to get a better idea of exactly where to improve our system.  


---
[ [prev page](../chapters/302_repo_and_branch_strategy.md) | [table of content](../table_of_content.md) | [next page](../chapters/305_sec_assessment.md) ]
## 3.04 Monitoring and Logging

To monitor our system we make use of Prometheus. The Prometheus data is fetched by Grafana, which lets us visualize the data in dashboards. 

We monitor the following:
- Whether the system is up
- The toal number of requests for each endpoint
- The rate of requests to the system
- Number of responses we send for each status code and endpoint
- Average response time for each endpoint
- CPU usage
- Memory usage

Why Prometheus? ...

Why Grafana? ...

Images of dashboard ...



For the logging of our system we use the following services:
- Winston, which is a JavaScript logger.
- Logstash ...
- Elasticsearch ...

Why each of these? ...

To visualize the log data we make use of Grafana again. We initially tried to use Kibana, but we found that Kibana had a large amount of CPU usage. We instead looked for more ... solutions and found that Grafana which was already running on our server also was able to visualize data from Logstash.

We log the following:
- The requests we receive - what endpoint was requested
- The response codes we send and which endpoint the response was sent from (which endpoint was requested)
- Any exceptions that are thrown in the code
- If we receive an unauthorized request, we log the credentials used by the request - if any. This allows us to detect brute force login attacks on the system.



---
[ [prev page](../chapters/302_repo_and_branch_strategy.md) | [table of content](../table_of_content.md) | [next page](../chapters/305_sec_assessment.md) ]
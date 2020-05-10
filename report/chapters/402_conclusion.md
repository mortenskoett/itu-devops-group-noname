## 4.02 Conclusion

The journey of filling the role as the devops team for the MiniTwit system have been interesting and a great learning experience. Starting with the outdated legacy system, and at a fast pace, understanding and adopting the essen of the system from the graphical user experience to the backend functions in to a new modern system. A system based on technologies, development tactic and with an operational strategy chosen by us.

For the most part, we think as documented in this report that we made some considered decisions.
Choosing *Node.js* for the application, *PostGres* as database, and a containerized environment supported by *Docker*, lifted by a virtual infrastructure at the cloud provider *Digital Ocean*.

Side-by-side but still as an integrated part of our system, we have containerized monitoring and logging based on *Logstash* with *ElasticSearch* collected by *Prometheus* and topped up with *Grafana* for a graphical overview.

To be able to fast delivery system changes of high quality and with seamless continuous integrations we have used a development process supported by widely ack-knowledge tools.

As a centerpiece we use *Github*, concentration as much (project) relevant information in one place, while getting version control, issue tracking and interfacing releashes to automatic test and integration service though *CircleCI*, handling our virtual setup made with *Vagrant*, *Docker (swarm)* and *Ubuntu* on our cloud provider.

Sprinkled with a few bash scripts for automation, we are able to develop and deploy new releases in orderly manner according to our integration and delivery chain specification.

Incase of a catastrophic failure demanding a complete system restoration, our planned process and backup makes us able to redeploy entire server, container and system safely. 


---
[ [prev page](../chapters/401_current_system_state.md) | [table of content](../table_of_content.md) | [next page](../chapters/500_appendices.md) ]
## 4.02 Conclusion

The journy of filling the role as the devops team for the MiniTwit system have been interesting and a great learning experince. Starting with the outdated legacy system, and at a fast pace, understanding and adopting the essen of the system from the graphical user experience to the backend functions in to a new modern system. A system based on technologies, development tactic and with an operational strategi choosen by us.

For the most part, we think as documentet in this report that we made some considered decisions.
Chosing *NodeJS* for the application, *PostGres* as database, and a containerized enviroment supported by *Docker*, lifted by a virtual infrastructur at the cloud provider *Digital Ocean*.

Side-by-side but still as an integreated part of our system, we have containerized monitoring and loging based on *Logstash* with *ElasticSearch* collected by *Prometheus* and topped up with *Graphana* for a graphical overview.

To be able to fast deliever system changes of high quality and with seamless continus integrations we have used a development process supported by widely ack-knowledge tools.

As a center piece we use *Github*, concentration as much (project) relevant information in one place, while getting version control, issue tracking and interfacing releashes to automatic test and integration service thourgh *CircleCI*, handling our virtual setup made with *Vagrant*, *Docker (swarm)* and *Ubuntu* on our cloud provider.

Sprinkled with a few bash scripts for automation, we are able to develop and deploy new releases in orderly manner according to our integration and delievery chain specification.

Incase of a catastrofic failur demanding a complete system restoration, our planed process and backup makes us able to redeploy entire server, container and system safely. 


---
[ [prev page](../chapters/401_current_system_state.md) | [table of content](../table_of_content.md) | [next page](../chapters/500_appendices.md) ]
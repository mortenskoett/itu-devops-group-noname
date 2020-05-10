## 4.02 Conclusion

The journey of filling the role as the devops team for the MiniTwit system has been interesting and a great learning experience. We have learned first hand what the challenges of developing a maintainable and scalable system are. Starting with the outdated legacy system we had to quickly understand and adopt the essence of the system, from the graphical user interface to the backend functions, into a new modern system. A system based on technologies, development tools and with an operational strategy chosen by us.

For the most part we think, as documented in this report, that we made some considered decisions. Choosing *Node.js* for the application, *PostGres* as database, and a containerized environment supported by *Docker*, lifted by a virtual infrastructure at the cloud provider *Digital Ocean*.

Side-by-side, but still as an integrated part of our system, we have containerized monitoring and logging based on *Prometheus* and *Logstash* with *ElasticSearch* topped up with *Grafana* for a graphical overview of the data.

<!-- Forstår ikke den sidste del her -->
To be able to quickly deliver system changes of high quality and with seamless continuous integrations we have used a development process supported by widely acknowledged tools. As a centerpiece we use *Github*, concentration as much (project) relevant information in one place, while getting version control, issue tracking and interfacing releashes to automatic test and integration service though *CircleCI*, handling our virtual setup made with *Vagrant*, *Docker (swarm)* and *Ubuntu* on our cloud provider.

Supported by a few bash scripts for automation, we are able to develop and deploy new releases in orderly manner according to our integration and delivery chain specification.

In case of a catastrophic failure demanding a complete system restoration, our planned process and backup makes us able to redeploy the entire server, containers and system safely. 

---
[ [prev page](../chapters/401_current_system_state.md) | [table of content](../table_of_content.md) | [next page](../chapters/500_appendices.md) ]
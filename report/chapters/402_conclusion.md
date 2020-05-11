## 4.02 Conclusion

The journey of filling the role as the devops team for the Minitwit system has been interesting and a great learning experience. We have learned first hand what the challenges of developing a maintainable and scalable system are. Starting with the outdated legacy system we had to quickly understand and adopt the essence of the system, from the graphical user interface to the backend functions, into a new modern system. A new system based on technologies, development tools and with an operational strategy chosen by us.

For the most part we think, as documented in this report, that we made some considered decisions. Choosing *Node.js* for the application, *Postgres* as database, and a containerized environment supported by *Docker*, lifted by a virtual infrastructure at the cloud provider *Digital Ocean*, and continuous delivery with *CircleCI*.

Side-by-side, but still as an integrated part of our system, we have containerized monitoring and logging based on *Prometheus* and *Logstash* with *ElasticSearch* topped up with *Grafana* for a graphical overview of the data.

To be able to quickly deliver system changes of high quality and with seamless continuous integrations we have used a development process supported by widely acknowledged tools. As a centerpiece we use *Github*, for keeping all project relevant information collected in one place, getting version control and issue tracking. We integrate Guthub releases with automatic testing, integration and deployment service *CircleCI*, and lastly we handle our virtual setup with *Vagrant*, *Docker (swarm)* and *Ubuntu* on our cloud provider.

Today we can easily boot up the development environment or a working application on any device with a single command, without having to install any dependencies or worry about differences in the environment on the different devices. Comparing this to the hassle of getting the initial Minitwit application running on our own devices, as well as all the 'it works on my machine' struggles that any developer has experienced, we find this super awesome and useful in our future developer workings.

Supported by a few bash scripts for automation, we are able to develop and deploy new releases in orderly manner according to our integration and delivery chain specification.

In case of a catastrophic failure demanding a complete system restoration, our planned process and backup makes us able to redeploy the entire server, containers and system safely.

We have also learned to compare the benefits and complexity costs that these tools bring with it, and analyze when each of them provides value to a given project. All in all we believe we have learned a lot from this course, providing us wih building blocks that provides for a better development experience, improved software quality and enables us to build better software systems.

---
[ [prev page](../chapters/401_lessons_learned_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/500_appendices.md) ]

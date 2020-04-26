FROM docker.elastic.co/elasticsearch/elasticsearch:7.6.0

ENV ES_JAVA_OPTS="-Xmx256m -Xms256m"
ENV ELASTIC_PASSWORD="changeme"
ENV discovery.type="single-node"

COPY ./elasticsearch/config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Add your elasticsearch plugins setup here
# Example: RUN elasticsearch-plugin install analysis-icu

FROM docker.elastic.co/logstash/logstash:7.6.0

ENV LS_JAVA_OPTS="-Xmx256m -Xms256m"

COPY ./logstash/config/logstash.yml /usr/share/logstash/config/logstash.yml
COPY ./logstash/pipeline/ /usr/share/logstash/pipeline

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
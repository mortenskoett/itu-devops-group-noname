#!/usr/bin/env bash
# Script used by circleci to afiliate itself with the already
# provisioned nodes on Digital Ocean.
#
# Remember to add proper private SSH key to circleci.

 docker-machine create \
  --driver generic \
  --generic-ip-address=165.22.67.27 \
  node-0

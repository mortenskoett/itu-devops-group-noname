#!/usr/bin/env bash
# Not to be used locally.
# 
# Script used by circleci to afiliate itself with the already
# provisioned nodes on Digital Ocean.
#
# Remember to add proper private SSH key of main manager node to circleci.

 docker-machine create \
  --driver generic \
  --generic-ip-address=104.248.128.201 \
  noname-0

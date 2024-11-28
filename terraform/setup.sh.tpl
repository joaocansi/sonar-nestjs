#!/bin/bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo chkconfig docker on
docker ps -q --filter "ancestor=joaocansi/nestjs-app" | xargs -r docker stop | xargs -r docker rm
docker pull joaocansi/nestjs-app:${COMMIT}
docker run -p 80:3000 -d joaocansi/nestjs-app:${COMMIT}
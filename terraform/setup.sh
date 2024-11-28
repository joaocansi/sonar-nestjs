#!/bin/bash
yum install -y docker
systemctl enable docker
systemctl start docker
sudo chown $USER /var/run/docker.sock
docker ps -q --filter "ancestor=joaocansi/nestjs-app" | xargs -r docker stop | xargs -r docker rm
docker run -p 80:3000 -d joaocansi/nestjs-app:$COMMIT
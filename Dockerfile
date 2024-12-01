FROM node:18

RUN useradd -ms /bin/bash appuser

WORKDIR /usr/src/app
RUN chown -R appuser:appuser /usr/src/app

COPY --chown=appuser:appuser package*.json ./

RUN npm install --ignore-scripts

COPY --chown=appuser:appuser . .

RUN chmod -R a-w /usr/src/app

EXPOSE 80

CMD [ "npm", "start" ]
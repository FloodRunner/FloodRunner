FROM buildkite/puppeteer
WORKDIR '/app'
COPY ./package.json ./
RUN npm install 
COPY . .
#define environment variable defaults for build overides
ARG NodeEnvironment="Production"
ENV NODE_ENV=$NodeEnvironment

ARG MaxRetries=3
ENV MAX_RETRIES=$MaxRetries

CMD ["npm","run","start"]
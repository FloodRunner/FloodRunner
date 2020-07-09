## FloodRunner - Web

---

This is the web front-end for the FloodRunner ecosystem. The front-end allows users to interactively schedule and monitor tests run through the FloodRunner ecosystem

### Building docker image

The image can be built using the Dockerfile with `docker build -f Dockerfile -t jellydock/floodrunner-web .`

### Pushing docker image

The image can be pushed to DockerHub using the command `docker push jellydock/floodrunner-web`

### Running the project locally

The project can be run in development using `npm run start` this will start up the project. Note that you will have to rename the config file in the config directory from `.env.bak` to `.env` and populate the required settings.

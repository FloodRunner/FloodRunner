## FloodRunner - SandboxRunner

---

Docker container setup to run flood element tests. This container is used within the FloodRunner eco-system to run individual tests and then upload the results.

Currently the container only supports downloading the test script and uploading the results to Azure Blob Storage. The file schema of the storage account is:

- Storage Account
  - Container Name
    - floodtest-[testId]
      - testscript\_[testId].ts
      - 04_16_2020-16_10
        - app.log
        - screenshot1.png
        - screenshot2.png
      - ...
    - ...

### Building docker image

The image can be built using the Dockerfile with `docker build -f Dockerfile -t jellydock/floodrunner-sandboxrunner .` . This will build the container with default environment variables:

- NODE_ENV = "Production"
- MAX_RETRIES = 3

To override these values you can pass the build arguments `NodeEnvironment` and `MaxRetries`, eg:
`docker build --build-arg NodeEnvironment=Development --build-arg MaxRetries=3 -f Dockerfile -t jellydock/floodrunner-sandboxrunner .`

### Pushing docker image

The image can be pushed to DockerHub using the command `docker push jellydock/floodrunner-sandboxrunner`

### Running docker container (standalone mode)

The container can be run using the `docker-compose.yml` file where you will have to specify the required environment variables.

### Running the project

The project can be run in development using `npm run dev` this will start up the project using nodemon and watch for changes to the source code. Note that you will have to rename the config file in the config directory from `default.yml.bak` to `default.yml` and populate the required settings.

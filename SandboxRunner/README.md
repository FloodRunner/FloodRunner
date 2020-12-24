## FloodRunner - SandboxRunner

---

Azure Function setup to run browser tests (Flood's [Element](https://element.flood.io/) and [Puppeteer](https://pptr.dev/)). This function is used within the FloodRunner eco-system to run individual tests and then upload the results to a file storage (eg. Azure Blob Storage)

Currently the function only supports downloading the test script and uploading the results to Azure Blob Storage. The file schema of the storage account is:

- Storage Account
  - Container Name
    - floodtest-[testId]
      - testscript\_[testId].ts
      - 04_16_2020-16_10
        - app.log (contains the logs written by the test script)
        - system.log (contains the logs written by the SandboxRunner for debugging purposes)
        - screenshots
          - screenshot1.png
          - screenshot2.png
      - ...
    - ...

### Running the project

The project can be run in development using `npm run start:func` this will start up the project using azure functions runtime and typescript in watch mode which will watch for changes to the source code.

The browser test function can be called by making a `POST` request to `http://localhost:7071/api/Puppeteer` and sending a json payload in the form:

```
{
    "isDevelopment": true,
    "testSettings":{
        "id": "develop-puppeteer-second",
        "type": "puppeteer",
        "maximumRetries": 1,
        "maximumAllowedScreenshots": 10
    },
    "azureStorage": {
        "uploadResults": true,
        "accountName": "floodstorage",
        "accountAccessKey": "azure storage key",
        "containerFolderName": "containerFolderName"
    }
}
```

### Debugging

You can run debug the project in Visual Studio Code by starting the debugger with the `SandboxRunner Debug` profile.

Before you debug the project, first build the project using `npm run build` then run `npm run watch` this will incrementally build any changes you make allow you to always debug the latest code changes.

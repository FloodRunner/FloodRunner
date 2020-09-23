import React, { useContext, createContext, Component } from "react";
import axios, { AxiosInstance } from "axios";
import { Auth0Context } from "./auth0-context";
import {
  FloodTest,
  FloodTestResultSummary,
  CreateFloodTest,
} from "../Models/Api/FloodTest";
import { Config } from "../Config/config";

interface ContextValueType {
  getAllTests?: () => Promise<FloodTest[]>;
  getTestResultSummariesById?: (
    testId: string
  ) => Promise<FloodTestResultSummary[]>;
  getTestById?: (testId: string) => Promise<FloodTest>;
  getTestLogs?: (logUri: string) => Promise<string>;
  setTestLogs?: (logs: string) => void;
  setScreenshotUris?: (screenshotUris: string[]) => void;
  downloadTestScript?: (testId: string) => Promise<string>;
  downloadTestFile?: (testName: string, testUri: string) => void;
  deleteTestById?: (testId: string) => Promise<void>;
  createTest?: (createTestDto: CreateFloodTest) => Promise<void>;
}

//create the context
export const FloodRunnerContext: any = createContext<ContextValueType | null>(
  null
);
export const useFloodRunner: any = () => useContext(FloodRunnerContext);

interface IState {
  tests: any;
  screenshotUris: string[];
  appLogs: string;
}

//create a provider
export class FloodRunnerProvider extends Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tests: null,
      screenshotUris: [],
      appLogs: null,
    };
  }
  static contextType = Auth0Context;

  componentDidMount() {
    this.initializeFloodRunner();
  }

  createFloodRunnerClient = async (): Promise<AxiosInstance> => {
    var authToken = null;
    if (this.context.isAuthenticated)
      authToken = await this.context.getTokenSilently();

    // console.log({ authToken });
    return axios.create({
      baseURL: Config.floodrunner_api_url,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  };

  initializeFloodRunner = async () => {
    try {
      //sample set
      this.setState({ tests: { a: 1 } });
    } catch {}
  };

  getAllTests = async (): Promise<FloodTest[]> => {
    try {
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.get<FloodTest[]>("/floodtest");
      const floodTests = response.data;
      return floodTests;
    } catch (err) {
      console.error(err);
    }
  };

  getTestResultSummariesById = async (
    testId: string
  ): Promise<FloodTestResultSummary[]> => {
    try {
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.get<FloodTestResultSummary[]>(
        `/floodtest/results/${testId}`
      );
      const floodTestResultSummaries = response.data;
      console.log(floodTestResultSummaries);
      return floodTestResultSummaries;
    } catch (err) {
      console.error(err);
    }
  };

  getTestById = async (testId: string): Promise<FloodTest> => {
    try {
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.get<FloodTest>(
        `/floodtest/${testId}`
      );
      const floodTest = response.data;
      return floodTest;
    } catch (err) {
      console.error(err);
    }
  };

  getTestLogs = async (logUri: string): Promise<string> => {
    try {
      const response = await axios.get<string>(logUri);
      const logs = response.data;
      return logs;
    } catch (err) {
      console.error(err);
    }
  };

  setTestLogs = (logs: string): void => {
    this.setState({ appLogs: logs });
  };

  setScreenshotUris = (screenshotUris: string[]): void => {
    this.setState({ screenshotUris: screenshotUris });
  };

  downloadTestScript = async (testId: string): Promise<string> => {
    try {
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.get<string>(
        `/floodtest/downloadtest/${testId}`
      );
      const floodTestScript = response.data;
      return floodTestScript;
    } catch (err) {
      console.error(err);
    }
  };

  deleteTestById = async (testId: string): Promise<void> => {
    try {
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.delete<string>(
        `/floodtest/${testId}`
      );
      const isDeleted = response.status;
      return;
    } catch (err) {
      console.error(err);
    }
  };

  downloadTestFile = (testName: string, testUri: string): void => {
    axios({
      url: testUri,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${testName}.ts`); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  createTest = async (createTestDto: CreateFloodTest): Promise<void> => {
    try {
      var formData = new FormData();
      formData.append("name", createTestDto.name);
      formData.append("description", createTestDto.description);
      formData.append("interval", createTestDto.interval.toString());
      formData.append("testScript", createTestDto.testScript);
      formData.append("type", createTestDto.type);
      const floodRunnerClient = await this.createFloodRunnerClient();
      const response = await floodRunnerClient.post(`/floodtest`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const isDeleted = response.status;
      return;
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { tests, appLogs, screenshotUris } = this.state;
    const { children } = this.props;

    const configObject = {
      appLogs,
      screenshotUris,
      getAllTests: () => this.getAllTests(),
      getTestResultSummariesById: (testId: string) =>
        this.getTestResultSummariesById(testId),
      getTestById: (testId: string) => this.getTestById(testId),
      getTestLogs: (logUri: string) => this.getTestLogs(logUri),
      setTestLogs: (logs: string) => this.setTestLogs(logs),
      setScreenshotUris: (screenshotUris: string[]) =>
        this.setScreenshotUris(screenshotUris),
      downloadTestScript: (testId: string) => this.downloadTestScript(testId),
      downloadTestFile: (testName: string, testUri: string) =>
        this.downloadTestFile(testName, testUri),
      deleteTestById: (testId: string) => this.deleteTestById(testId),
      createTest: (createTestDto: CreateFloodTest) =>
        this.createTest(createTestDto),
    };

    return (
      <FloodRunnerContext.Provider value={configObject}>
        {children}
      </FloodRunnerContext.Provider>
    );
  }
}

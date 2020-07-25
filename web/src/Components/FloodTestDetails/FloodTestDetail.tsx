import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../Contexts/auth0-context";
import { useFloodRunner } from "../../Contexts/floodrunner-context";
import {
  FloodTest,
  FloodTestResultSummary,
  TestType,
} from "../../Models/Api/FloodTest";
import { Label, Segment, Header } from "semantic-ui-react";
import { Card, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import LoadingPlaceholder from "../Shared/Loader/LoadingPlaceholder";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Text,
  Cell,
} from "recharts";
import _ from "lodash";
import Modal from "../Shared/Modal/Modal";
import history from "../../Utils/history";
import "./floodtestdetails-style.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { UnControlled as CodeMirror } from "react-codemirror2";
import TestImageCarousel from "./TestImageCarousel";
require("codemirror/mode/javascript/javascript");

function FloodTestDetail(props) {
  const { testId } = props.match.params;
  const { isLoading } = useAuth0();
  const {
    getTestById,
    getTestResultSummariesById,
    getTestLogs,
    downloadTestScript,
    downloadTestFile,
    deleteTestById,
  } = useFloodRunner();
  const [floodTestResultSummaries, setfloodTestResultSummaries] = useState<
    FloodTestResultSummary[]
  >([]);
  const [screenshotUris, setScreenshotUris] = useState<string[]>([]);
  const [floodTest, setfloodTest] = useState<FloodTest>();
  const [appLogs, setAppLogs] = useState<string>();
  const [highlightedIndex, setHighlightedIndex] = useState<Number>(0);
  const [showScriptViewModal, setShowScriptViewModal] = useState<boolean>(
    false
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [testScript, setTestScript] = useState<string>(null);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  useEffect(() => {
    async function test() {
      let floodTest = await getTestById(testId);
      let floodTestResultSummaries = await getTestResultSummariesById(testId);
      setfloodTest(floodTest);
      setfloodTestResultSummaries(floodTestResultSummaries);
    }
    if (!isLoading) test();
  }, [isLoading]);

  const onViewTestScriptClick = async () => {
    if (!testScript) {
      setTestScript(await downloadTestScript(testId));
    }
    setShowScriptViewModal(true);
  };

  const onDeleteButtonClick = async () => {
    setShowDeleteModal(true);
  };

  const onDeleteScriptClick = async () => {
    await deleteTestById(floodTest._id);
    history.push("/");
  };

  const renderDeleteActions = () => {
    return (
      <>
        <Button negative floated="right" onClick={onDeleteScriptClick}>
          <Icon name="trash" />
          Yes
        </Button>
        <Button
          primary
          floated="right"
          onClick={() => setShowDeleteModal(false)}
        >
          <Icon name="cancel" />
          No
        </Button>
      </>
    );
  };

  const renderDeleteModal = () => {
    if (showDeleteModal) {
      return (
        <Modal
          title="Are you sure you want to delete this test?"
          content={null}
          actions={renderDeleteActions()}
          onDismiss={() => setShowDeleteModal(false)}
        />
      );
    }
  };

  const renderTestActionButtons = () => {
    return (
      <>
        <Button negative floated="right" onClick={onDeleteButtonClick}>
          <Icon name="trash" /> Delete
        </Button>
        <Button positive floated="right" onClick={onViewTestScriptClick}>
          <Icon name="info" />
          View Script
        </Button>
        {/* <Button disabled positive floated="right">
          <Icon name="edit" /> Edit
        </Button> */}
      </>
    );
  };

  const renderTestStatus = (isPassing: boolean) => {
    return (
      <Label
        color={isPassing === null ? "grey" : isPassing ? "green" : "red"}
        id="overallTestStatus"
      >
        {isPassing === null ? "Incomplete" : isPassing ? "Passing" : "Failing"}
      </Label>
    );
  };

  const renderLastTimeRan = (lastTimeRan?: string) => {
    return moment(lastTimeRan).format("HH:mm DD/MM/YYYY");
  };

  const renderTestType = (testType: TestType) => {
    return testType.charAt(0).toUpperCase() + testType.slice(1);
  };

  const renderTooltip = ({ payload, label, active }) => {
    const toolTipDataPayload: any = _.first(payload);
    if (!toolTipDataPayload) return;

    const toolTipData: Data = toolTipDataPayload.payload;

    if (active) {
      return (
        <Segment className="customTooltip">
          <Header>
            <Header.Subheader>Time: {toolTipData.date}</Header.Subheader>
            <Header.Subheader>
              Status: {renderTestStatus(toolTipData.isSuccessful)}
            </Header.Subheader>
            <Header.Subheader>
              Execution Time (s): {toolTipData.value}
            </Header.Subheader>
          </Header>
        </Segment>
      );
    }

    return null;
  };

  interface Data {
    date: string;
    value: string;
    isSuccessful: boolean;
    appLogUri: string;
    screenshotUris: string[];
  }

  const onBarClick = async (data, index: number) => {
    var payload: Data = data.payload;
    setHighlightedIndex(index);
    if (payload.appLogUri) setAppLogs(await getTestLogs(payload.appLogUri));
    else setAppLogs("No data");

    if (payload.screenshotUris) setScreenshotUris(payload.screenshotUris);
  };

  const calculateBarFillColor = (
    index: number,
    isSuccessful?: boolean
  ): string => {
    const highlightedColor = "#03045E"; //take these to a file -> colors.ts
    const successfulColor = "#0096C7";
    const failureColor = "#ff6938";
    const incompleteColor = "#E0E1E2";

    const color =
      index == highlightedIndex
        ? highlightedColor
        : isSuccessful === null
        ? incompleteColor
        : isSuccessful
        ? successfulColor
        : failureColor;
    return color;
  };

  const renderLogs = () => {
    return (
      <Segment.Group>
        {!_.isEmpty(screenshotUris) ? (
          <>
            <Segment>Screenshots</Segment>
            <Segment.Group>
              <Segment textAlign="center">
                <TestImageCarousel screenshotsUris={screenshotUris} />
              </Segment>
            </Segment.Group>
          </>
        ) : (
          ""
        )}

        <Segment>Logs</Segment>
        <Segment.Group>
          <Segment className="log-segment">
            <pre>{appLogs}</pre>
          </Segment>
        </Segment.Group>
      </Segment.Group>
    );
  };

  const onChartAnimationEnd = (data: Data, index: number) => {
    if (isInitialRender) {
      onBarClick({ payload: data }, index);
      setIsInitialRender(false);
    }
  };

  const renderGraph = (summaries: FloodTestResultSummary[]) => {
    //transform summaries
    var data: Data[] = summaries.map((summary) => {
      return {
        date: moment(summary.runOn.toString()).format("HH:mm"),
        value: "2", //hard coding execution time for now
        isSuccessful: summary.isSuccessful,
        appLogUri: _.find(summary.logFileUris, function (f) {
          return f.includes("app.log");
        }),
        screenshotUris: summary.screenShotUris,
      };
    });

    //reverse data because the latest results would be first (as returned by api)
    data = _.reverse(data);

    return (
      <ResponsiveContainer width="95%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={40} />
          <YAxis
            label={
              <Text x={0} y={0} dx={20} dy={225} angle={-90}>
                Execution Time (sec)
              </Text>
            }
          />
          <Tooltip content={renderTooltip} />
          <Bar
            dataKey="value"
            fill="#0096C7"
            onClick={onBarClick}
            onAnimationEnd={() => onChartAnimationEnd(_.first(data), 0)}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell
                fill={calculateBarFillColor(index, entry.isSuccessful)}
                key={index}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderScriptViewContent = (testScript: string) => {
    return (
      <CodeMirror
        value={testScript}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
        }}
        onChange={(editor, data, value) => {}}
      />
    );
  };

  const onDownloadTestScriptClick = () => {
    downloadTestFile(floodTest.name, floodTest.uri);
  };

  const renderScriptViewActions = () => {
    return (
      <>
        <Button positive floated="right" onClick={onDownloadTestScriptClick}>
          <Icon name="download" />
          Download Script
        </Button>
      </>
    );
  };

  const renderScriptViewModal = () => {
    if (showScriptViewModal) {
      return (
        <Modal
          title="Test Script"
          content={renderScriptViewContent(testScript)}
          actions={renderScriptViewActions()}
          onDismiss={() => setShowScriptViewModal(false)}
        />
      );
    }
  };

  if (!floodTest || !floodTestResultSummaries) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      <Card fluid>
        <Card.Content>
          {renderTestActionButtons()}
          <Card.Header>Name: {floodTest.name}</Card.Header>
          <Card.Meta>Description: {floodTest.description}</Card.Meta>
          <Card.Description>
            Current Status: {"   "}
            {renderTestStatus(floodTest.resultOverview.isPassing)}
          </Card.Description>
          <Card.Description>
            Interval: <strong>{floodTest.interval} minutes</strong>
          </Card.Description>
          <Card.Description>
            Last Run:{" "}
            <strong>
              {renderLastTimeRan(floodTest.resultOverview?.lastRun?.toString())}
            </strong>
          </Card.Description>
          <Card.Description>
            Test Type: <strong>{renderTestType(floodTest.type)}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content>{renderGraph(floodTestResultSummaries)}</Card.Content>
        <Card.Content>{renderLogs()}</Card.Content>
      </Card>
      {renderScriptViewModal()}
      {renderDeleteModal()}
    </>
  );
}

export default FloodTestDetail;

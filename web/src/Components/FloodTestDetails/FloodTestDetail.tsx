import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../Contexts/auth0-context";
import { useFloodRunner } from "../../Contexts/floodrunner-context";
import { Card, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import _ from "lodash";

import {
  FloodTest,
  FloodTestResultSummary,
  TestType,
} from "../../Models/Api/FloodTest";
import LoadingPlaceholder from "../Shared/Loader/LoadingPlaceholder";
import Modal from "../Shared/Modal/Modal";
import history from "../../Utils/history";

import TestGraph from "./TestGraph";
import TestLogs from "./TestLogs";
import TestScriptModal from "./TestScriptModal";
import "./floodtestdetails-style.css";
import TestStatus from "./TestStatus";

function FloodTestDetail(props) {
  const { testId } = props.match.params;
  const { isLoading } = useAuth0();
  const {
    getTestById,
    getTestResultSummariesById,
    downloadTestScript,
    deleteTestById,
  } = useFloodRunner();
  const [floodTestResultSummaries, setfloodTestResultSummaries] = useState<
    FloodTestResultSummary[]
  >([]);
  const [floodTest, setfloodTest] = useState<FloodTest>();
  const [showScriptViewModal, setShowScriptViewModal] = useState<boolean>(
    false
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [testScript, setTestScript] = useState<string>(null);

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

  const renderLastTimeRan = (lastTimeRan?: string) => {
    return moment(lastTimeRan).format("HH:mm DD/MM/YYYY");
  };

  const renderTestType = (testType: TestType) => {
    return testType.charAt(0).toUpperCase() + testType.slice(1);
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
            <TestStatus isPassing={floodTest.resultOverview.isPassing} />
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
        <Card.Content>
          <TestGraph summaries={floodTestResultSummaries} />
        </Card.Content>
        <Card.Content>
          <TestLogs />
        </Card.Content>
      </Card>
      <TestScriptModal
        testScript={testScript}
        testName={floodTest.name}
        testUri={floodTest.uri}
        showScriptModal={showScriptViewModal}
        dismissFunc={() => setShowScriptViewModal(false)}
      />
      {renderDeleteModal()}
    </>
  );
}

export default FloodTestDetail;

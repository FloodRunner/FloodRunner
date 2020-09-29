import React, { useEffect, useState } from "react";
import { useAuth0 } from "../../Contexts/auth0-context";
import { useFloodRunner } from "../../Contexts/floodrunner-context";
import { FloodTest, createFloodTestDto } from "../../Models/Api/FloodTest";
import FloodTestCard from "./FloodTestCard";
import "./floodtest-overview-style.css";
import { Button, Icon, Segment, Message } from "semantic-ui-react";
import LoadingPlaceholder from "../Shared/Loader/LoadingPlaceholder";
import FloodCreateForm from "./FloodCreateForm";

interface FloodOverviewState {
  floodTests: FloodTest[];
}

function FloodOverview() {
  const { isLoading, getIdTokenClaims, getTokenSilently } = useAuth0();
  const { getAllTests } = useFloodRunner();
  const [floodTests, setFloodTests] = useState<FloodTest[]>([]);
  const [showCreateTestModal, setshowCreateTestModal] = useState<boolean>(
    false
  );
  const _maximumFloodTests = 20;

  useEffect(() => {
    async function test() {
      let floodTests = await getAllTests();
      setFloodTests(floodTests);
    }
    if (!isLoading) test();
  }, [isLoading]);

  const renderFloodTests = (floodTests: FloodTest[]) => {
    return floodTests.map((floodTest) => {
      return <FloodTestCard {...floodTest} />;
    });
  };

  const renderCreateFloodTestButton = () => {
    return (
      <Button
        floated="right"
        primary
        className="addTestBtn"
        onClick={() => setshowCreateTestModal(true)}
      >
        <Icon name="add" />
        Create Test
      </Button>
    );
  };

  const renderCreateTestModal = () => {
    if (showCreateTestModal) {
      return (
        <FloodCreateForm
          closeModal={() => setshowCreateTestModal(false)}
          createFloodTest={createFloodTestDto()}
          maximumTestsReached={floodTests.length === _maximumFloodTests}
        />
      );
    }
  };

  return (
    <>
      {!floodTests ? (
        <LoadingPlaceholder />
      ) : (
        <>
          {renderCreateFloodTestButton()}
          {renderFloodTests(floodTests)}
          {renderCreateTestModal()}
        </>
      )}
    </>
  );
}

export default FloodOverview;

import React from "react";
import { Segment } from "semantic-ui-react";
import _ from "lodash";

import { useFloodRunner } from "../../Contexts/floodrunner-context";
import TestImageCarousel from "./TestImageCarousel";

const TestLogs: React.FC = ({}) => {
  const { appLogs, screenshotUris } = useFloodRunner();

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

export default TestLogs;

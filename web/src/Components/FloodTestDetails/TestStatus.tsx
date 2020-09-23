import React from "react";
import { Label } from "semantic-ui-react";

interface TestStatusProps {
  isPassing: boolean;
}

const TestStatus: React.FC<TestStatusProps> = ({ isPassing }) => {
  return (
    <Label
      color={isPassing === null ? "grey" : isPassing ? "green" : "red"}
      id="overallTestStatus"
    >
      {isPassing === null ? "Incomplete" : isPassing ? "Passing" : "Failing"}
    </Label>
  );
};

export default TestStatus;

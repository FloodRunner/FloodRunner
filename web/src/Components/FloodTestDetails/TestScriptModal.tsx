import React, { Dispatch, SetStateAction } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { Button, Icon } from "semantic-ui-react";

import { useFloodRunner } from "../../Contexts/floodrunner-context";
import Modal from "../Shared/Modal/Modal";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
require("codemirror/mode/javascript/javascript");

interface TestScriptModalProps {
  testScript: string;
  testName: string;
  testUri: string;
  showScriptModal: boolean;
  dismissFunc: Dispatch<SetStateAction<boolean>>;
}

const TestScriptModal: React.FC<TestScriptModalProps> = ({
  testScript,
  testName,
  testUri,
  showScriptModal,
  dismissFunc,
}) => {
  const { downloadTestFile } = useFloodRunner();

  const onDownloadTestScriptClick = () => {
    downloadTestFile(testName, testUri);
  };

  const renderScriptContent = (testScript: string) => {
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

  const renderScriptActions = () => {
    return (
      <>
        <Button positive floated="right" onClick={onDownloadTestScriptClick}>
          <Icon name="download" />
          Download Script
        </Button>
      </>
    );
  };

  if (showScriptModal) {
    return (
      <Modal
        title="Test Script"
        content={renderScriptContent(testScript)}
        actions={renderScriptActions()}
        onDismiss={dismissFunc}
      />
    );
  } else {
    return <></>;
  }
};

export default TestScriptModal;

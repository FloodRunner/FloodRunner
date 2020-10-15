import React, { useState } from "react";
import { Form, Button, Icon, Message, Image } from "semantic-ui-react";
import { Formik } from "formik";
import { UnControlled as CodeMirror } from "react-codemirror2";
import * as yup from "yup";
import _ from "lodash";
import { useFloodRunner } from "../../Contexts/floodrunner-context";
import Modal from "../Shared/Modal/Modal";
import {
  CreateFloodTest,
  TestType,
  TestUploadType,
} from "../../Models/Api/FloodTest";
import {ScriptPlaceholders} from "./Placeholders";
import history from "../../Utils/history";
import elementLogo from "../../images/script_types/flood_element.png";
import puppeteerLogo from "../../images/script_types/puppeteer.png";
import "./floodtest-overview-style.css";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
require("codemirror/mode/javascript/javascript");
require('codemirror/addon/display/placeholder')

interface IProps {
  createFloodTest: CreateFloodTest;
  closeModal: () => void;
  maximumTestsReached: boolean;
}

const FILE_SIZE = 50000;
const SUPPORTED_FORMATS = ["text/plain", "video/mp2ts"];
const SUPPORED_EXT = ["ts"];

const FloodCreateForm = ({
  createFloodTest,
  closeModal,
  maximumTestsReached,
}: IProps) => {
  const { createTest } = useFloodRunner();
  const [selectedTestType, setSelectedTestType] = useState<string>(
    createFloodTest.type
  );
  const [selectedUploadType, setSelectedUploadType] = useState<string>(
    TestUploadType.Script
  );
  const [scriptPlaceholder, setScriptPlaceholder] = useState<string>(ScriptPlaceholders.puppeteerPlaceholder);

  const renderBetaWarning = () => {
    return (
      <Message warning>
        <Icon name="warning" />
        During the Beta you can only schedule 1 Flood Element Test. Please
        delete your other test in order to create a new test.
      </Message>
    );
  };

  const testTypeButtons = (
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const field = "type";
    return (
      <div className="test-type-container">
        <Button
          id={`${TestType.Puppeteer}Btn`}
          className={
            selectedTestType === TestType.Puppeteer ? "test-type-active" : ""
          }
          basic
          required
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSelectedTestType(TestType.Puppeteer);
            setScriptPlaceholder(ScriptPlaceholders.puppeteerPlaceholder);
            setFieldValue(field, TestType.Puppeteer);
          }}
        >
          <Image src={puppeteerLogo} size="tiny" />
        </Button>
        <Button
          id={`${TestType.Element}Btn`}
          className={
            selectedTestType === TestType.Element ? "test-type-active" : ""
          }
          basic
          required
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSelectedTestType(TestType.Element);
            setScriptPlaceholder(ScriptPlaceholders.elementPlaceholder);
            setFieldValue(field, TestType.Element);
          }}
        >
          <Image src={elementLogo} size="small" />
        </Button>
      </div>
    );
  };

  const upperCaseFirstLetter = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <Formik
      initialValues={{
        name: createFloodTest.name,
        description: createFloodTest.description,
        interval: createFloodTest.interval,
        type: createFloodTest.type,
        testFile: null,
        testScript: null, //might want to take this in from the model later for editing
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .required("Name cannot be empty")
          .max(50, "Maximum characters cannot exceed 50"),
        description: yup
          .string()
          .max(100, "Maximum characters cannot exceed 100")
          .required("Description cannot be empty"),
        interval: yup
          .number()
          .min(60, "Minimum interval is 60 minutes during Beta")
          .test(
            "interval-multiple",
            "Interval must be a multiple of 10 minutes",
            function (value) {
              return value % 10 === 0;
            }
          )
          .required("Interval is required"),
        testFile: yup
          .mixed()
          .test(`testFile-required`, `Please upload a test file`, (value) => {
            return selectedUploadType != TestUploadType.File
              ? true
              : value != null;
          })
          .test(
            "testFile-fileSize",
            `File size too large (max size is 50Kb)`,
            (value) => {
              return selectedUploadType != TestUploadType.File
                ? true
                : value == null
                ? false
                : value.size <= FILE_SIZE;
            }
          )
          .test("testFile-fileExt", "Unsupported file type", (value) => {
            return selectedUploadType != TestUploadType.File
              ? true
              : value == null
              ? false
              : SUPPORED_EXT.includes(value.name.split(".").pop());
          }),
        testScript: yup
          .string()
          .test(
            `testScript-required`,
            `Please insert your test script`,
            (value) => {
              return selectedUploadType != TestUploadType.Script
                ? true
                : value != null;
            }
          )
          .nullable(),
      })}
      onSubmit={async (values, actions) => {
        var createTestDto: CreateFloodTest = {
          name: values.name,
          description: values.description,
          interval: values.interval,
          testFile: values.testFile,
          testScript: values.testScript,
          type: values.type,
          userId: null,
        };
        await createTest(createTestDto);
        actions.setSubmitting(false);
        closeModal();
        history.go(0); //reload page to show new test
      }}
      render={({
        errors,
        handleSubmit,
        isSubmitting,
        dirty,
        setFieldValue,
        getFieldProps,
        touched,
        values,
      }) => (
        <Modal
          title="Create browser test"
          content={
            maximumTestsReached ? (
              renderBetaWarning()
            ) : (
              <>
                {touched.name && errors.name && (
                  <Message error content={errors.name} />
                )}
                {touched.description && errors.description && (
                  <Message error content={errors.description} />
                )}
                {touched.interval && errors.interval && (
                  <Message error content={errors.interval} />
                )}
                {touched.testFile && errors.testFile && (
                  <Message error content={errors.testFile} />
                )}
                {touched.testScript && errors.testScript && (
                  <Message error content={errors.testScript} />
                )}

                <Form loading={isSubmitting} onSubmit={handleSubmit}>
                  <Form.Input
                    required
                    id="name"
                    label="Name"
                    fluid
                    {...getFieldProps("name")}
                  />
                  <Form.TextArea
                    required
                    label="Description"
                    id="description"
                    {...getFieldProps("description")}
                    rows={1}
                  />
                  <Form.Input
                    required
                    label="Interval (minutes)"
                    id="interval"
                    fluid
                    {...getFieldProps("interval")}
                  />
                  <Form.Field
                    required
                    name="type"
                    label="Script Type"
                    control={() => testTypeButtons(setFieldValue)}
                  />

                  <Form.Field>
                    <label>Upload a test file?</label>
                    <Form.Checkbox
                      name="uploadType"
                      toggle
                      onChange={(event, data) => {
                        //switching between file upload back and script upload
                        setFieldValue("testFile", null, false);
                        setFieldValue("testScript", null, false);

                        setSelectedUploadType(
                          data.checked
                            ? TestUploadType.File
                            : TestUploadType.Script
                        );
                      }}
                    />
                  </Form.Field>

                  {selectedUploadType === TestUploadType.File ? (
                    <Form.Input
                      //required
                      label={`Select your ${upperCaseFirstLetter(
                        selectedTestType
                      )} Script (.ts file) *`}
                      fluid
                      type="file"
                      name="testFile"
                      onChange={(event) => {
                        setFieldValue("testFile", event.currentTarget.files[0]);
                      }}
                    />
                  ) : (
                    ""
                  )}

                  {selectedUploadType === TestUploadType.Script ? (
                    <Form.Field>
                      <label>{`Paste in your ${upperCaseFirstLetter(
                        selectedTestType
                      )} script *`}</label>
                      <CodeMirror
                        value={values.testScript}
                        options={{
                          mode: "javascript",
                          theme: "material",
                          lineNumbers: true,
                          placeholder: scriptPlaceholder
                        }}
                        onChange={(editor, data, value) => {
                          setFieldValue("testScript", value);
                        }}
                      />
                    </Form.Field>
                  ) : (
                    ""
                  )}

                  <Button
                    primary
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting || !_.isEmpty(errors) || !dirty}
                    floated="right"
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => (dirty ? closeModal() : closeModal())}
                    floated="right"
                  >
                    Cancel
                  </Button>
                </Form>
              </>
            )
          }
          onDismiss={closeModal}
        />
      )}
    />
  );
};

export default FloodCreateForm;

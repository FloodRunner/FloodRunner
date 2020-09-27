import React from "react";
import { useFloodRunner } from "../../Contexts/floodrunner-context";
import { Form, Button, Message } from "semantic-ui-react";
import { Formik } from "formik";
import * as yup from "yup";
import Modal from "../Shared/Modal/Modal";
import { CreateFloodTest } from "../../Models/Api/FloodTest";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { Config } from "../../Config/config";

// const Welcome = ({ createFloodTest, closeModal }: IProps) => {
const Welcome = () => {
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const authState = query.get("state");

  const renderTermsLabel = () => {
    return (
      <label>
        Accept FloodRunner's{" "}
        <a target="_blank" href="/legal/termsofservice">
          terms of service
        </a>{" "}
        and{" "}
        <a target="_blank" href="/legal/privacypolicy">
          privacy policy
        </a>
      </label>
    );
  };

  const renderTitle = () => {
    return "Welcome to FloodRunner!";
  };

  return (
    <Formik
      initialValues={{
        name: "",
        terms: false,
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .required("Please enter a username")
          .max(20, "Maximum characters cannot exceed 50"),
        terms: yup
          .bool()
          .oneOf([true], "The terms and conditions must be accepted."),
      })}
      onSubmit={async () => {
        window.location.href = `https://${Config.auth0_domain}/continue?state=${authState}`;
      }}
      render={({
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        dirty,
      }) => (
        <Modal
          title={renderTitle()}
          content={
            <>
              <p>
                Thank you for signing up to the <strong>Beta</strong>:{" "}
              </p>
              {errors.name && <Message error content={errors.name} />}

              <Form loading={isSubmitting} onSubmit={handleSubmit}>
                <Form.Input
                  required
                  label="What should we call you by?"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name !== undefined}
                />
                <Form.Checkbox
                  name="terms"
                  value={"true"}
                  onChange={handleChange}
                  required
                  id="terms"
                  label={renderTermsLabel()}
                />
                <Button
                  primary
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || !_.isEmpty(errors) || !dirty}
                  floated="right"
                >
                  Continue
                </Button>
              </Form>
            </>
          }
          onDismiss={() => console.log("tried to dismiss")}
        />
      )}
    />
  );
};

export default Welcome;

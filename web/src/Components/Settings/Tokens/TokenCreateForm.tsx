import React, { useRef, useState } from "react";
import { Form, Button, Icon, Message, Image, Input } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import * as moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { useFloodRunner } from "../../../Contexts/floodrunner-context";
import Modal from "../../Shared/Modal/Modal";
import { CreateAccessToken } from "../../../Models/Api/FloodTest";
import history from "../../../Utils/history";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

interface IProps {
  closeModal: () => void;
}

const TokenCreateForm = ({ closeModal }: IProps) => {
  const { createToken } = useFloodRunner();
  const [currentDate, setNewDate] = useState(null);
  const [showAccessTokenModal, setShowAccessTokenModal] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const renderAccessTokenModal = () => {
    if (showAccessTokenModal) {
      return (
        <Modal
          title="Successfully created personal access token"
          content={
            <>
              <p>
                The value of this access token is only available now. Please
                save it somewhere as you will not be able to access it after
                this.
              </p>

              <Input
                disabled
                action={{
                  color: "teal",
                  icon: "copy",
                  onClick: () => {
                    navigator.clipboard.writeText(accessToken);
                  },
                }}
                defaultValue={accessToken}
              />
            </>
          }
          actions={null}
          onDismiss={() => {
            closeModal();
            history.go(0); //reload page to show new token
          }}
        />
      );
    }
  };

  const renderDatePicker = (
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const field = "expiresAt";
    return (
      <SemanticDatepicker
        onChange={(event, data) => {
          setFieldValue(field, data.value, false);
          setNewDate(data.value);
        }}
        value={currentDate}
        format="DD/MM/YYYY"
        minDate={moment.utc().toDate()}
        maxDate={moment.utc().add(10, "years").toDate()}
        showToday={false}
        required={true}
      />
    );
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          description: "",
          expiresAt: null,
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
        })}
        onSubmit={async (values, actions) => {
          var createTokenDto: CreateAccessToken = {
            name: values.name,
            description: values.description,
            expiresAt: values.expiresAt,
          };
          const accessTokenValue = await createToken(createTokenDto);
          setAccessToken(accessTokenValue);
          setShowAccessTokenModal(true);
          actions.setSubmitting(false);
        }}
        render={({
          errors,
          handleSubmit,
          isSubmitting,
          dirty,
          getFieldProps,
          touched,
          setFieldValue,
        }) => (
          <Modal
            title="Create personal access token"
            content={
              <>
                {touched.name && errors.name && (
                  <Message error content={errors.name} />
                )}
                {touched.description && errors.description && (
                  <Message error content={errors.description} />
                )}
                {touched.expiresAt && errors.expiresAt && (
                  <Message error content={errors.expiresAt} />
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

                  <Form.Field
                    required
                    id="expiresAt"
                    name="expiresAt"
                    label="Expires at"
                    control={() => renderDatePicker(setFieldValue)}
                  />

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
            }
            onDismiss={closeModal}
          />
        )}
      />
      {renderAccessTokenModal()}
    </>
  );
};

export default TokenCreateForm;

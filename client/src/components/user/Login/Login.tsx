import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import ContainedButton from "../../common/ContainedButton";
import AuthLayout from "../../common/AuthLayout/AuthLayout";
import { shallowEqual } from "recompose";
import { login } from "../../../auth";
import { useHistory } from "react-router-dom";

interface Values {
  email: string;
  password: string;
}

interface State {
  error: string | undefined;
  success: string | undefined;
  lastSubmission: Values;
}

const initialValues: Values = {
  email: "",
  password: "",
};

const validate = (values: Values) => {
  const errors: Partial<Values> = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      values.email
    )
  ) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const Login: React.FC = () => {
  const history = useHistory();

  const [state, setState] = useState<State>({
    error: undefined,
    success: undefined,
    lastSubmission: { ...initialValues },
  });

  const onSubmit = (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>
  ) => {
    login(values)
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setState({
          ...state,
          success: "Authentication successfull",
          error: undefined,
          lastSubmission: {
            ...values,
          },
        });
        resetForm();
        setSubmitting(false);
        history.push("/home");
      })
      .catch((err) => {
        setState({
          ...state,
          error: err.response.data.error,
          success: undefined,
          lastSubmission: {
            ...values,
          },
        });
        setSubmitting(false);
      });
  };

  return (
    <AuthLayout
      authType="login"
      headline="Log in to your account"
      footer="Don't have an account?"
      error={state.error}
      success={state.success}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting, isValid, dirty, values }) => (
          <Form>
            <Box mb="5vh">
              <Field
                component={TextField}
                variant="outlined"
                name="email"
                type="email"
                label="Email"
                fullWidth
              />
            </Box>
            <Box mb="5vh">
              <Field
                component={TextField}
                variant="outlined"
                name="password"
                type="password"
                label="Password"
                fullWidth
              />
            </Box>
            <Box mb="5vh" display="flex" justifyContent="flex-end">
              <ContainedButton
                disabled={
                  isSubmitting ||
                  !(dirty && isValid) ||
                  shallowEqual(state.lastSubmission, values)
                }
                isSubmitting={isSubmitting}
                onClick={submitForm}
              >
                log in
              </ContainedButton>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;

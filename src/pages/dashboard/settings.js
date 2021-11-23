import {
  Form,
  Button,
  Card,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  Label,
  Alert,
} from "reactstrap";
import Dashboard from "../../layouts/dashboard";
import * as yup from "yup";
import { Field, Formik } from "formik";

export default function Settings() {
  const initialValues = {
    distributionValue: 1,
  };
  const validationSchema = yup.object({
    distributionValue: yup.number().required().label("Distribution Value"),
  });
  const onSubmit = async (values) => {
    console.log({ values });
  };
  return (
    <Dashboard>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          isSubmitting,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label>Distribution Value (per second token rate)</Label>
                  <Field as={Input} type="number" name="distributionValue" />
                  {touched["distributionValue"] && errors["distributionValue"] && (
                    <Alert color="danger" className="my-1">
                      {errors["distributionValue"]}
                    </Alert>
                  )}
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving" : "Save"}
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </Dashboard>
  );
}

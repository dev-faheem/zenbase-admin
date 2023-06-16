import { useState } from "react";
import { Field, Formik } from "formik";
import config from "../config";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";
import swal from "sweetalert";

function UserField({ label, name, ...props }) {
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Field
        as={Input}
        placeholder={`Enter your ${name}`}
        name={name}
        {...props}
      />
    </FormGroup>
  );
}

export default function AdminCreator({ refetch }) {
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (values, formikProps) => {
    if(!values.password || !values.email || !values.name){
        console.log(`in false scenerio`)
        swal({
            title: "Warning",
            text: "All fields are required!",
            icon: "warning",
          });
        return false;
    }
    await axios.post(config.api + "/auth", {
      ...values,
      dontAutoGenerateName: true,
    });
    formikProps.resetForm();
    refetch?.();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(props) => (
        <Card className="card-bordered">
          <Form onSubmit={props.handleSubmit}>
            <CardHeader
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <h5>Register an Admin</h5>
            </CardHeader>
            {isOpen && (
              <>
                <CardBody>
                  <UserField name="name" label="Name" />
                  <UserField name="email" label="Email" type="email" />
                  <UserField name="password" label="Password" type="password" />
                </CardBody>
                <CardFooter>
                  <Button type="submit">Register</Button>
                </CardFooter>
              </>
            )}
          </Form>
        </Card>
      )}
    </Formik>
  );
}

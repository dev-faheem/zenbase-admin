import Dashboard from "../../layouts/dashboard";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useState, useEffect } from "react";
import DataTable from "../../components/datatable";
import axios from "axios";
import { Field, Formik } from "formik";
import config from "../../config";
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

function UserCreator({ refetch }) {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  };

  const onSubmit = async (values, formikProps) => {
    await axios.post(config.app + "/auth/register", values);
    formikProps.resetForm();
    refetch?.();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(props) => (
        <Card className="card-bordered">
          <Form onSubmit={props.handleSubmit}>
            <CardHeader>
              <h5>Register a User</h5>
            </CardHeader>
            <CardBody>
              <UserField name="name" label="Name" />
              <UserField name="email" label="Email" type="email" />
              <UserField name="phone" label="Phone" />
              <UserField name="username" label="Username" />
              <UserField name="password" label="Password" type="password" />
            </CardBody>
            <CardFooter>
              <Button type="submit">Register</Button>
            </CardFooter>
          </Form>
        </Card>
      )}
    </Formik>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Username",
      selector: (row) => row.username,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Options",
      selector: (row) => (
        <div>
          <Button
            color="danger"
            onClick={() => {
              swal({
                title: "Are you sure?",
                text: "Once deleted, user wont be able to login or access their accounts.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then(async (willDelete) => {
                if (willDelete) {
                  await axios.delete(`/users/${row._id}`);
                  await fetchData();
                }
              });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    const { data } = await axios.get("/users");
    setUsers(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dashboard>
      <Row>
        <Col md={8}>
          <DataTable
            onSearch={setSearch}
            showPagination={false}
            columns={columns}
            rows={users.filter((user) => {
              if (search !== "") {
                return Object.keys(user).some((key) =>
                  user[key].includes(search)
                );
              }
              return true;
            })}
          />
        </Col>
        <Col md={4}>
          <UserCreator refetch={fetchData} />
        </Col>
      </Row>
    </Dashboard>
  );
}

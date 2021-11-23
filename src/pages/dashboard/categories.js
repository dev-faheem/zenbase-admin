import {
  Alert,
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
import Dashboard from "../../layouts/dashboard";
import DataTable from "../../components/datatable";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react/cjs/react.development";
import swal from "sweetalert";

function CategoryAdd({ refetch }) {
  const initialValues = {
    name: "",
    artwork: null,
    isPremium: true,
  };

  const validationSchema = yup.object({
    name: yup.string().required().label("Name"),
  });

  const onSubmit = async (values) => {
    setFileError();
    if (artworkFileRef.current.files.length !== 1) {
      setFileError("Please attach an artwork image.");
      return;
    }

    const payload = new FormData();

    payload.append("name", values.name);
    payload.append("isPremium", values.isPremium);
    payload.append("artwork", artworkFileRef.current.files[0]);

    await axios.post("/categories", payload);

    swal({
      title: "Success",
      icon: "success",
      text: "Category successfully created.",
    });

    refetch?.();

    formikProps.resetForm();
  };

  const formikProps = useFormik({ initialValues, validationSchema, onSubmit });

  const artworkFileRef = useRef();

  const [fileError, setFileError] = useState();

  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <Card className="mt-5">
        <CardHeader>
          <h5>Add New Category</h5>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formikProps.values.name}
              onChange={(e) =>
                formikProps.setFieldValue("name", e.target.value)
              }
            />
          </FormGroup>
          {formikProps.errors.name && (
            <Alert color="danger">{formikProps.errors.name}</Alert>
          )}

          <FormGroup>
            <Label>Artwork</Label>
            <input className="form-control" type="file" ref={artworkFileRef} />
          </FormGroup>
          {fileError && <Alert color="danger">{fileError}</Alert>}
        </CardBody>
        <CardFooter>
          <Button
            type="submit"
            color="primary"
            className="mr-2"
            disabled={formikProps.isSubmitting}
          >
            {formikProps.isSubmitting ? "Uploading" : "Submit"}
          </Button>

          <Button
            type="reset"
            color="warning"
            className="btn-dim"
            onClick={() => {
              formikProps.resetForm();
              setFileError();
            }}
          >
            Clear
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);

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
      name: "Artwork",
      selector: (row) => <img className="category-artwork" src={row.artwork} />,
    },
    {
      name: "Options",
      selector: (row) => (
        <div>
          <Button color="danger" onClick={() => onClickDeleteCategory(row._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    const { data } = await axios.get("/categories");
    setCategories(data.data);
  };

  const onClickDeleteCategory = async (id) => {
    await axios.delete("/categories/" + id);
    swal({
      title: "Success",
      icon: "success",
      text: "Category successfully deleted.",
    });

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dashboard>
      <DataTable
        showSearch={false}
        showPagination={false}
        columns={columns}
        rows={categories}
      />
      <CategoryAdd refetch={fetchData} />
    </Dashboard>
  );
}

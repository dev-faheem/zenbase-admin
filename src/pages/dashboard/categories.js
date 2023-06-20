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
import { useFormik } from "formik";
import { useRef, useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

function CategoryAdd({
  artworkFileRef,
  editCategory,
  formikProps,
  fileError,
  editCategoryData,
  updating,
  clear,
  setUpdating,
}) {
  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <Card className="mt-5">
        <CardHeader>
          <h5>{editCategory ? "Edit Category Name" : "Add New Category"}</h5>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formikProps.values.name}
              onChange={(e) => {
                formikProps.setFieldValue("name", e.target.value);
                setUpdating(false);
              }}
            />
          </FormGroup>
          {formikProps.errors.name && (
            <Alert color="danger">{formikProps.errors.name}</Alert>
          )}

          <Fragment>
            <FormGroup>
              <Label>Artwork</Label>
              <input
                className="form-control"
                type="file"
                ref={artworkFileRef}
              />
            </FormGroup>
            {fileError && <Alert color="danger">{fileError}</Alert>}
          </Fragment>
        </CardBody>
        <CardFooter>
          {editCategory ? (
            <Button
              color="primary"
              className="mr-2"
              disabled={updating && formikProps.isValid}
              onClick={() => editCategoryData()}
            >
              {updating && formikProps.isValid ? "Uploading" : "Update"}
            </Button>
          ) : (
            <Button
              type="submit"
              color="primary"
              className="mr-2"
              disabled={formikProps.isSubmitting && formikProps.isValid}
            >
              {formikProps.isSubmitting && formikProps.isValid
                ? "Uploading"
                : "Submit"}
            </Button>
          )}

          <Button
            type="reset"
            color="warning"
            className="btn-dim"
            onClick={() => clear()}
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
  const [cloneCategories, setCloneCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(false);
  const [id, setId] = useState("");
  const [updating, setUpdating] = useState(false);
  const initialValues = {
    name: "",
    artwork: null,
    isPremium: true,
  };
  const validationSchema = yup.object({
    name: yup.string().required().label("Name"),
  });

  const artworkFileRef = useRef();
  const [fileError, setFileError] = useState();

  const clear = () => {
    formikProps.resetForm();
    setFileError();
    artworkFileRef.current.value = "";
  };

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
      selector: (row) => (
        <img
          className="category-artwork"
          src={row.artwork}
          alt={row.originalName}
        />
      ),
    },
    {
      name: "Options",
      selector: (row) => (
        <div>
          <Button color="primary" onClick={() => onClickEditCategory(row._id)}>
            Edit
          </Button>
          &nbsp;
          <Button color="danger" onClick={() => onClickDeleteCategory(row._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

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

    await axios.post("/categories", payload).then((res) => {
      if (res.data) {
        swal({
          title: "Success",
          icon: "success",
          text: "Category successfully created.",
        });

        fetchData?.();
        clear()
      }
    });
  };

  const formikProps = useFormik({ initialValues, validationSchema, onSubmit });

  const fetchData = async () => {
    const { data } = await axios.get("/categories");

    setCategories(data.data);
    setCloneCategories(data.data);
  };
  const updateRow = (rows) => {
    rows.map((item,index) => item["order"] = ++index )
    setCategories(rows);
  };
  const onClickEditCategory = async (id) => {
    setId(id);
    let values = categories
      .map((i, index, element) => {
        let data = "";
        if (i._id === id) {
          data = element[index];
        }
        return data;
      })
      .filter((n) => n);

    setEditCategory(true);
    formikProps.setFieldValue("name", values[0]?.name);
  };

  const editCategoryData = async () => {
    setUpdating(true);
    const payload = new FormData();
    payload.append("name", formikProps.values.name);
    payload.append("artwork", artworkFileRef.current.files[0]);
    if (formikProps.isValid) {
      await axios.put(`/categories/${id}`, payload).then((res) => {
        if (res.data.data) {
          swal({
            title: "Success",
            icon: "success",
            text: "Category successfully updated.",
          });
          fetchData();
          clear()
          setEditCategory(false);
          setUpdating(false);
        }
      });
    }
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
    // eslint-disable-next-line
  }, []);

  const resetCategories = () => setCategories(cloneCategories);

  const updateCategories = async () => {
    await axios.post("/categories/updateOrder", {categories}).then((res) => {
      if (res.data) {
        swal({
          title: "Success",
          icon: "success",
          text: "Category updated successfully.",
        });
        fetchData?.();
        clear();
      }
    });
  };

  return (
    <Dashboard>
      <DataTable
        showSearch={false}
        showPagination={false}
        columns={columns}
        rows={categories}
        updateRow={updateRow}
        isDraggable={true}
      />
      <>
        {JSON.stringify(categories) !== JSON.stringify(cloneCategories) && (
          <div className="pt-3">
            <button
              className="btn btn-primary btn-sm mr-1"
              onClick={updateCategories}
            >
              Update
            </button>
            <button className="btn btn-danger btn-sm" onClick={resetCategories}>
              Reset
            </button>
          </div>
        )}
      </>
      <CategoryAdd
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        formikProps={formikProps}
        setFileError={setFileError}
        fileError={fileError}
        artworkFileRef={artworkFileRef}
        editCategoryData={editCategoryData}
        updating={updating}
        setUpdating={setUpdating}
        clear={clear}
      />
    </Dashboard>
  );
}

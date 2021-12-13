import { Formik, useField, useFormik, useFormikContext } from "formik";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input as RInput,
} from "reactstrap";
import Dashboard from "../../layouts/dashboard";
import * as yup from "yup";
import { useEffect, useState } from "react/cjs/react.development";
import RSelect from "react-select";
import axios from "axios";
import { useRef } from "react";
import Creatable from "react-select/creatable";
import { useHistory } from "react-router";

function Select({ values, label, name, ...props }) {
  const [field, meta, helpers] = useField({ name });
  const formik = useFormikContext();
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <RSelect
        options={values}
        {...field}
        {...props}
        onChange={(items) => {
          formik.setFieldValue(name, items);
        }}
        value={field.value}
      />

      {meta.touched && meta.error && (
        <Alert color="danger" className="mt-2">
          {meta.error}
        </Alert>
      )}
    </FormGroup>
  );
}

function Input({ type = "text", label, placeholder, id, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <RInput
        type={type}
        placeholder={placeholder}
        id={id}
        name={id}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <Alert color="danger" className="mt-2">
          {meta.error}
        </Alert>
      )}
    </FormGroup>
  );
}

export default function SongUpload() {
  const [fileError, setFileError] = useState();
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [duration, setDuration] = useState();
  const artworkFileRef = useRef();
  const sourceFileRef = useRef();
  const history = useHistory();

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(data.data);
  };

  const fetchUsers = async () => {
    const { data } = await axios.get("/users");
    setUsers(data.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const initialValues = {
    name: "",
    artist: "",
    tags: [],
    categories: [],
  };

  const validationSchema = yup.object({
    name: yup.string().required().label("Name"),
  });

  const onSubmit = async (values) => {
    setFileError();
    if (artworkFileRef.current.files?.length !== 1) {
      setFileError("Please attach artwork file.");
      return;
    }

    if (sourceFileRef.current.files?.length !== 1) {
      setFileError("Please attach source file.");
      return;
    }

    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("artist", values.artist.value);

    payload.append("tags", values.tags.map((tag) => tag.value).join(","));
    payload.append(
      "categories",
      values.categories.map((category) => category.value).join(",")
    );
    payload.append("source", sourceFileRef.current.files[0]);
    payload.append("artwork", artworkFileRef.current.files[0]);
    payload.append("duration", duration || 0);
    await axios.post("/songs", payload);
    history.push("/songs");
  };

  function computeDuration(file) {
    return new Promise((resolve) => {
      var objectURL = URL.createObjectURL(file);
      var mySound = new Audio([objectURL]);
      mySound.addEventListener(
        "canplaythrough",
        () => {
          URL.revokeObjectURL(objectURL);
          resolve(mySound.duration);
        },
        false
      );
    });
  }

  async function onChangeSource(e) {
    try {
      const _duration = await computeDuration(e.target.files[0]);
      setDuration(Math.floor(_duration));
    } catch (e) {
      alert("Cant compute duration of the song.");
    }
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <Dashboard>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <h4>Upload a New Song</h4>
              </CardHeader>
              <CardBody>
                <div>
                  <button
                    className="btn btn-sm btn-primary btn-floater"
                    type="button"
                    onClick={() => {
                      setFieldValue("name", toTitleCase(values.name));
                    }}
                  >
                    Title Case
                  </button>
                  <Input
                    name="name"
                    label="Song Name"
                    placeholder="Enter song name..."
                    id="name"
                  />
                </div>

                <Select
                  label="Category"
                  values={categories.map((category) => {
                    return {
                      label: category.name,
                      value: category._id,
                    };
                  })}
                  name="categories"
                  isMulti
                />

                <Select
                  label="Artist"
                  values={users.map((user) => {
                    return {
                      label: user.name,
                      value: user._id,
                    };
                  })}
                  name="artist"
                />

                <FormGroup>
                  <Label>Tags (used in search)</Label>
                  <Creatable
                    isMulti
                    options={values.tags}
                    value={values.tags}
                    onChange={(items) => {
                      setFieldValue("tags", items);
                    }}
                    onCreateOption={(option) => {
                      setFieldValue("tags", [
                        ...values.tags,
                        { label: option, value: option },
                      ]);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Artwork</Label>
                  <input
                    className="form-control"
                    type="file"
                    ref={artworkFileRef}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Source</Label>
                  <input
                    className="form-control"
                    type="file"
                    ref={sourceFileRef}
                    onChange={onChangeSource}
                  />
                  <p className="text-muted text-xs">
                    {duration && `Detected ${duration} seconds`}
                  </p>
                </FormGroup>

                {fileError && (
                  <Alert color="danger" className="mt-3">
                    {fileError}
                  </Alert>
                )}
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading" : "Upload"}
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </Dashboard>
  );
}

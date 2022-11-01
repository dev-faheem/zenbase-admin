import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Formik, useField, useFormikContext } from "formik";
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
import axios from "axios";
import { useHistory } from "react-router";
import sweetInfo from "../../services/sweetInfo";

function Input({ type = "text", label, placeholder, id, ...props }) {
  const [field, meta] = useField(props);
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
  const params = useLocation();
  const [fileError, setFileError] = useState();
  const [fileArtworkError, setArtworkFileError] = useState();
  const [fileBackgroundError, setBackgroundFileError] = useState();

  const [duration, setDuration] = useState();
  const artworkFileRef = useRef();
  const backgroundFileRef = useRef();
  const sourceFileRef = useRef();
  const history = useHistory();

  const initialValues = {
    name: params.state?.name || "",
    artist:
      params.state?.artist?.map((i) => {
        let options = { label: i.name, value: i._id };
        return options;
      }) || "",
    tags:
      params.state?.tags?.map((option) => {
        let options = { label: option, value: option };
        return options;
      }) || [],
    categories:
      params.state?.categories?.map((i) => {
        let options = { label: i.name, value: i._id };
        return options;
      }) || [],
  };

  const validationSchema = yup.object({
    name: yup.string().required().label("Name"),
  });

  //const onSubmit = async (values) => {
  const onSubmit = async (values, formikProps) => {
    if (params.search) {
      const payload = new FormData();
      payload.append("name", values.name);
      payload.append("duration", duration || 0);

      if (artworkFileRef.current.files[0]) {
        let isArtworkValid = fileArtworkValidations(
          artworkFileRef.current.files[0]
        );
        if (isArtworkValid) {
          payload.append("artwork", artworkFileRef.current?.files[0]);
        }
      }
      if (backgroundFileRef.current.files[0]) {
        let isBackgroundValid = fileBackgroundValidations(
          backgroundFileRef.current.files[0]
        );
        if (isBackgroundValid) {
          payload.append("background", backgroundFileRef.current?.files[0]);
        }
      }

      if (sourceFileRef.current.files[0]) {
        let isSourceValid = fileSourceValidations(
          sourceFileRef.current.files[0]
        );

        if (isSourceValid) {
          payload.append("source", sourceFileRef.current.files[0]);
        }
      }
      if (params.state?._id) {
        await axios.put(`/topcards/update/${params.state._id}`, payload);
        history.push("/search-topcard");
      } else {
        await axios.post("/topcards", payload);
        history.push("/search-topcard");
      }
    } else {
      let isArtworkValid = fileArtworkValidations(
        artworkFileRef.current.files[0]
      );
      let isBackgroundValid = fileBackgroundValidations(
        backgroundFileRef.current.files[0]
      );

      let isSourceValid = fileSourceValidations(sourceFileRef.current.files[0]);
      if (isArtworkValid && isSourceValid && isBackgroundValid) {
        const payload = new FormData();
        payload.append("name", values.name);
        payload.append("source", sourceFileRef.current.files[0]);
        payload.append("artwork", artworkFileRef.current?.files[0]);
        payload.append("background", backgroundFileRef.current?.files[0]);
        payload.append("duration", duration || 0);

        if (params.state?._id) {
          await axios.put(`/topcards/update/${params.state._id}`, payload);
          history.push("/topcards/create");
        } else {
          await axios.post("/topcards", payload);
          history.push("/search-topcard");
        }
        sweetInfo("Successfully uploaded top card song");
        formikProps.resetForm();
      }
    }
  };

  function computeDuration(file) {
    fileSourceValidations(file);
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

  const fileSourceValidations = (file) => {
    let files = ["mp3", "mp4", "mov", "gif", "webm"];

    if (!file) {
      setFileError("Please attach source file.");
      return false;
    } else if (!files.includes(file.name.split(".").pop())) {
      setFileError(
        "Invalid Source format.(Only MP3, MP4, MOV, GIF, WEBM allowed.)"
      );
      return false;
    } else {
      setFileError("");
      return true;
    }
  };

  const fileArtworkValidations = (file) => {
    let files = ["png", "jpg", "jpeg"];
    if (!file) {
      setArtworkFileError("Please attach artwork file.");
      return false;
    } else if (!files.includes(file.name.split(".").pop())) {
      setArtworkFileError(
        "Invalid Artwork format. (Only JPG, JPEG, PNG allowed.)"
      );
      return false;
    } else {
      setArtworkFileError("");
      return true;
    }
  };

  const fileBackgroundValidations = (file) => {
    let files = ["png", "jpg", "jpeg"];
    if (!file) {
      setBackgroundFileError("Please attach Background file.");
      return false;
    } else if (!files.includes(file.name.split(".").pop())) {
      setBackgroundFileError(
        "Invalid Background format. (Only JPG, JPEG, PNG allowed.)"
      );
      return false;
    } else {
      setBackgroundFileError("");
      return true;
    }
  };

  async function onChangeSource(e) {
    try {
      const _duration = await computeDuration(e.target.files[0]);
      setDuration(Math.floor(_duration));
    } catch (e) {
      alert("Cant compute duration of the song.");
    }
  }

  async function onChangeArtwork(e) {
    fileArtworkValidations(e.target.files[0]);
  }

  async function onChangeBackground(e) {
    fileBackgroundValidations(e.target.files[0]);
  }

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split("")
      .map((char, index) => {
        if (index === 0) return char.toUpperCase();
        return char;
      })
      .join("");
    // Title Case
    // return str.replace(/\w\S*/g, function (txt) {
    //   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    // });
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
                <h4>
                  {params.state?._id
                    ? "Update a Top Card Songs"
                    : "Upload a New Top Card Songs"}
                </h4>
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
                    Sentence Case
                  </button>
                  <Input
                    name="name"
                    label="Song Name"
                    placeholder="Enter song name..."
                    id="name"
                  />
                </div>

                <FormGroup>
                  <Label>Artwork</Label>
                  <input
                    className="form-control"
                    type="file"
                    ref={artworkFileRef}
                    onChange={onChangeArtwork}
                  />
                </FormGroup>
                {fileArtworkError && (
                  <Alert color="danger" className="mt-3">
                    {fileArtworkError}
                  </Alert>
                )}

                <FormGroup>
                  <Label>Background</Label>
                  <input
                    className="form-control"
                    type="file"
                    ref={backgroundFileRef}
                    onChange={onChangeBackground}
                  />
                </FormGroup>
                {fileBackgroundError && (
                  <Alert color="danger" className="mt-3">
                    {fileBackgroundError}
                  </Alert>
                )}

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
                  {params.state?._id ? "Update" : "Upload"}
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </Dashboard>
  );
}

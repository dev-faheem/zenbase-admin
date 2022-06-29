import Dashboard from "../../layouts/dashboard";
import {
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
import { Country, State } from "country-state-city";
import moment from "moment";
import { subscribeCheckBoxArr } from "../../mockData";

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
    country: "",
    state: "",
  };

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (values, formikProps) => {
    await axios.post(config.app + "/auth/register", {
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
              <h5>Register a User</h5>
            </CardHeader>
            {isOpen && (
              <>
                <CardBody>
                  <UserField name="name" label="Name" />
                  <UserField name="email" label="Email" type="email" />
                  <UserField name="phone" label="Phone" />
                  <UserField name="username" label="Username" />
                  <UserField name="password" label="Password" type="password" />

                  <FormGroup>
                    <Label>Country</Label>
                    <select
                      className="form-control"
                      name="country"
                      value={props.values.country}
                      onChange={(e) => {
                        props.setFieldValue("country", e.target.value);
                      }}
                    >
                      <option selected>Choose a country</option>
                      {Country.getAllCountries().map((country) => {
                        return (
                          <option value={country.isoCode}>
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                  </FormGroup>
                  {props.values.country && props.values.country !== "" && (
                    <FormGroup>
                      <Label>State</Label>
                      <select
                        className="form-control"
                        name="state"
                        value={props.values.state}
                        onChange={(e) => {
                          props.setFieldValue("state", e.target.value);
                        }}
                      >
                        {State.getStatesOfCountry(props.values.country).map(
                          (state) => {
                            return (
                              <option value={state.isoCode}>
                                {state.name}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </FormGroup>
                  )}
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

export default function Users() {
  const [users, setUsers] = useState([]);
  console.log('userss', users);
  const [filterUsers, setFilterUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedState, setCheckedState] = useState(
    new Array(subscribeCheckBoxArr.length).fill(false)
  );
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    previous: 2,
    next: 0,
    limit: 10,
  });

  const calculateDays = (startDate, EndDate) => {
    const days = Math.ceil(
      Math.abs(moment(new Date(startDate)) - moment(new Date(EndDate))) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };
  const onPaginate = (pageNumber) =>  setPagination({
    ...pagination,
    page: pageNumber,
  });

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1
    },
    {
      name: "Name",
      selector: (row) => row.name
    },
    {
      name: "Email",
      selector: (row) => row.email
    },
    {
      name: "Username",
      selector: (row) => row.username
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Location",
      selector: (row) =>
        `${Country.getCountryByCode(row.country)?.name}, ${
          State.getStateByCodeAndCountry(row.state, row.country)?.name
        }`,
    },
    {
      name: "Account Type",
      selector: (row) =>
        row.isArtist ? "Artist" : row.isPremium ? "Premium" : "General",
    },
    {name: "Subscription start",
      selector: (row) =>
        row.subscription
          ? moment(row.subscription.createdAt).format("DD/MM/yyyy")
          : ""
    },
    {
      name: "Subscription end",
      selector: (row) =>
        row.subscription
          ? moment(row.subscription.expiresAt).format("DD/MM/yyyy")
          : ""
    },
    {
      name: "Zenbase Premium",
      selector: (row) =>
        row?.isPremium &&
        calculateDays(
          row?.subscription?.expiresAt,
          row?.subscription.createdAt
        ) >= 7
          ? "Premium"
          : "General",
    },
    {
      name: "Meditated Time(hrs)",
      selector: (row) => row.hours
    },
    {
      name: "CreatedAt",
      selector: (row) =>
        row.createdAt ? moment(row.createdAt).format("DD/MM/yyyy") : ""
    },
    {
      name: "Zentokens",
      selector: (row) => (row.zentokens ? row.zentokens : "~")
    },
    {
      name: "Account",
      selector: (row) =>
        row.isPremium ? (
          <Button
            onClick={async () => {
              try {
                await axios.put(`users/downgrade-premium`, {
                  user: row,
                });
              } catch (e) {
                console.log(e);
              }
            }}
          >
            Downgrade Premium
          </Button>
        ) : ( <Button onClick={async () => {
          try {
            await axios.post(`users/upgrade-premium`, {
              _id: row?._id,
            });
          } catch (e) {
            console.log(e);
          }
        }}>Upgrade Premium</Button> ),
    },
    {
      name: "Options",
      selector: (row) => (
        <div>
          {!row.isArtist && (
            <Button
              color="warning"
              className="mr-2 btn-sm"
              onClick={async () => {
                try {
                  await axios.patch(`/users/${row._id}`, {
                    isArtist: true,
                  });
                  window.location.reload();
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              Make Artist
            </Button>
          )}
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
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `users?limit=10&page=${page}&search=${search}`
        );
      const { results, pagination } = data.data;
      setLoading(false);
      setUsers(results);
      setPagination(pagination);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination?.page);
  }, [pagination?.page]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        fetchData(1);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const onChangeNext = () => {
    if (pagination.page < pagination.total) {
      setPagination({
        ...pagination,
        page: pagination.next,
      });
    }
  };

  const onChangePrevious = () => {
    if (pagination.previous >= 0) {
      setPagination({
        ...pagination,
        page: pagination.previous,
      });
    }
  };
  const handleOnChange = (position) => {
    let updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    if (checkedState[0] && checkedState[1]) {
      checkedState[2] = true;
      setFilterUsers(users);
    } else if (
      (checkedState[0] && checkedState[2]) ||
      (checkedState[1] && checkedState[2])
    ) {
      setFilterUsers(users);
    } else if (checkedState[0]) {
      const subscribeFilter = users.filter(
        (item) => item.subscription === null
      );
      setFilterUsers(subscribeFilter);
    } else if (checkedState[1]) {
      const unSubscribeFilter = users.filter(
        (item) => item.subscription !== null
      );
      setFilterUsers(unSubscribeFilter);
    } else {
      setFilterUsers(users);
    }
  }, [checkedState]);

  let isFilter = checkedState.some((item) => item === true);
  return (
    <Dashboard>
      <Row>
        <Col md={12} className="mb-4">
          <UserCreator refetch={fetchData} />
        </Col>
        <Col md={12}>
          <DataTable
            checked={checkedState}
            onChangeCheckBox={handleOnChange}
            onSearch={setSearch}
            showPagination={true}
            columns={columns}
            rows={
              isFilter
                ? filterUsers.filter((user) => {
                    if (search !== "") {
                      return Object.keys(user).some((key) =>
                        user[key]?.toString()?.toLowerCase()?.includes(search)
                      );
                    }
                    return true;
                  })
                : users?.filter((user) => {
                    if (search !== "") {
                      return Object.keys(user).some((key) =>
                        user[key]?.toString()?.toLowerCase()?.includes(search)
                      );
                    }
                    return true;
                  })
            }
            pagination={pagination}
            onChangeNext={onChangeNext}
            onChangePrevious={onChangePrevious}
            pageCount={pagination?.total}
            onPaginate={onPaginate}
          />
        </Col>
        {loading && (
          <Col md={12}>
            <h4>Loading Users...</h4>
          </Col>
        )}
      </Row>
    </Dashboard>
  );
}

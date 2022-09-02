import Dashboard from "../../layouts/dashboard";
import { Button } from "reactstrap";
import { useState, useEffect } from "react";
import DataTable from "../../components/datatable";
import axios from "axios";
import swal from "sweetalert";

export default function Admins() {
  const [users, setUsers] = useState([]);

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
      name: "Options",
      selector: (row) => (
        <div>
          <Button
            color="danger"
            onClick={() => {
              swal({
                title: "Are you sure?",
                text: "Once deleted, the admin wont be able to login or access their account data.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  onClickDelete(row._id);
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
    const { data } = await axios.get("/users/admins");
    setUsers(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function onClickDelete(id) {
    await axios.delete(`/users/admins/${id}`);
    await fetchData();
  }

  return (
    <Dashboard>
      <DataTable
        showSearch={false}
        showPagination={false}
        columns={columns}
        rows={users}
      />
    </Dashboard>
  );
}

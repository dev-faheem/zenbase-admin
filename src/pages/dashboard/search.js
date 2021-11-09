import Dashboard from "../../layouts/dashboard";
import DataTable from "react-data-table-component";
import { useEffect } from "react/cjs/react.development";
import sweetError from "../../services/sweetError";
import { useState } from "react";
import axios from "axios";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Artist",
    selector: (row) => row.artist.name,
  },
];

export default function Search() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("/songs");
      console.log(response);
      setSongs(response.data.data.results);
    } catch (e) {
      sweetError(e);
    }
  };

  return (
    <Dashboard>
      <DataTable columns={columns} data={songs} pagination />
    </Dashboard>
  );
}

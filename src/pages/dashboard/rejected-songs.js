import React, { useState, useEffect } from "react";
// import { Button } from "reactstrap";
import Dashboard from "../../layouts/dashboard";
import DataTable from "../../components/datatable";
import axios from "axios";
import useURLState from "@ahooksjs/use-url-state";

const RejectedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [queryParams, setQueryParams] = useURLState({ search: "" });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    previous: 2,
    next: 0,
    limit: 10,
  });

  const downloadAll = async () => {
    const response = await axios.get(
      `/songs/rejected?limit=${pagination.count}`
    );
    response.data.data?.results?.map((song) => {
      return fetch(song.source).then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = `${song.name}.mp3`;
          a.click();
        });
      });
    });
  };

  const search = queryParams.search;
  const setSearch = (_search) =>
    setQueryParams({
      ...queryParams,
      search: _search,
    });

  const onChangeNext = () => {
    if (pagination?.page < pagination?.total) {
      setPagination({
        ...pagination,
        page: pagination.next,
      });
    }
  };

  const onChangePrevious = () => {
    if (pagination?.previous >= 0) {
      setPagination({
        ...pagination,
        page: pagination?.previous,
      });
    }
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
        <img className="song-artwork" src={row.artwork} alt="" />
      ),
    },
    {
      name: "Artist",
      selector: (row) =>
        row?.artist
          ? row?.artist
              .map(
                (artist) =>
                  artist?.name || <i className="text-danger">Deleted User</i>
              )
              .join(", ")
          : "-",
    },
    {
      name: "Source",
      selector: (row) => {
        return <audio src={row.source} controls />;
      },
    },
    {
      name: "Creator Name",
      selector: (row) => (row.fullName ? row.fullName : "-"),
    },
    {
      name: "Creator Email",
      selector: (row) => (row.email ? row.email : "-"),
    },
    {
      name: "Description",
      selector: (row) => (row.description ? row.description : "-"),
    },
    {
      name: "Duration",
      selector: (row) => {
        return <div>{row.duration} seconds</div>;
      },
    },
    {
      name: "Status",
      selector: (row) => {
        return <div>{row.approved === "pending" ? "Pending" : "Rejected"}</div>;
      },
    },
  ];

  const fetchSongs = async (page) => {
    await axios
      .get(`/songs/rejected?limit=50&page=${page}&search=${search}`)
      .then((res) => {
        const { results, pagination } = res.data.data;
        setSongs(results);
        setPagination(pagination);
      });
  };

  useEffect(() => {
    fetchSongs(pagination?.page);

    // eslint-disable-next-line
  }, [queryParams?.search, pagination?.page]);
  return (
    <Dashboard>
      <DataTable
        columns={columns}
        rows={songs}
        search={search}
        onSearch={setSearch}
        pageCount={pagination?.total}
        pagination={pagination}
        onChangeNext={onChangeNext}
        onChangePrevious={onChangePrevious}
        downloadAll={downloadAll}
      />
    </Dashboard>
  );
};

export default RejectedSongs;

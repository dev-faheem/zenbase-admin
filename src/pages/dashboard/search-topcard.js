import React, { useState, useEffect } from "react";
import Dashboard from "../../layouts/dashboard";
import DataTable from "../../components/datatable";
import { useHistory } from "react-router-dom";
import sweetError from "../../services/sweetError";
import axios from "axios";
import useURLState from "@ahooksjs/use-url-state";
import swal from "sweetalert";
import { Button, Input } from "reactstrap";

export default function Search() {
  const history = useHistory();
  const [songs, setSongs] = useState([]);
  const [queryParams, setQueryParams] = useURLState({ search: "" });
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isSelectedId, setIsSelectedId] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    previous: 2,
    next: 0,
    limit: 10,
  });

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsSelectedId(songs.map((song) => song._id));
    if (isCheckAll) {
      setIsSelectedId([]);
    }
  };

  const handleClick = (e, id) => {
    const { checked } = e.target;
    setIsSelectedId([...isSelectedId, id]);
    if (!checked) {
      setIsSelectedId(isSelectedId.filter((item) => item !== id));
    }
  };

  // const page = parseInt(queryParams.page);
  // const setPage = (_page) => setQueryParams({ ...queryParams, page: _page });

  const search = queryParams.search;
  const setSearch = (_search) =>
    setQueryParams({
      ...queryParams,
      search: _search,
    });

  useEffect(() => {
    fetchSongs(pagination?.page);

    // eslint-disable-next-line
  }, [queryParams?.search, pagination?.page]);

  const downloadAll = async () => {
    const response = await axios.get(`/topcards?limit=${pagination.count}`);
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

  const editSong = (data) => {
    history.push({
      pathname: "/search-topcard/update",
      search: `?id=${data._id}`,
      state: data,
    });
  };

  const topcard = () => {
    history.push({
      pathname: "/topcard/create",
    });
  };

  const deleteSelectedSongs = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, user wont be able to login or access their accounts.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axios.delete(`/topcards/delete-all/${isSelectedId}`);
        setIsSelectedId([]);
        await fetchSongs();
      }
    });
  };

  const columns = [
    {
      name: (
        <Input
          type="checkbox"
          className="position-relative"
          onChange={(e) => handleSelectAll(e)}
        />
      ),
      selector: (row, index) => (
        <Input
          type="checkbox"
          className="position-relative"
          id={row._id}
          onChange={(e) => handleClick(e, row._id)}
          checked={isSelectedId.includes(row._id)}
        />
      ),
      checkBox: true,
    },
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
      name: "Background",
      selector: (row) => (
        <img className="song-artwork" src={row.background} alt="" />
      ),
    },
    {
      name: "Source",
      selector: (row) => {
        return <audio src={row.source} controls />;
      },
    },
    {
      name: "Duration",
      selector: (row) => {
        return <div>{row.duration} seconds</div>;
      },
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div className="d-flex">
            <button
              className="btn btn-primary btn-sm mr-2"
              onClick={() => editSong(row)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                swal({
                  title: "Are you sure?",
                  text: "Once deleted, you will not be able to recover this song!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    axios.delete("/topcards/" + row._id);
                    window?.location?.reload();
                  }
                });
              }}
            >
              Delete
            </button>
          </div>
        </>
      ),
    },
  ];

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

  const fetchSongs = async (page) => {
    try {
      const { data } = await axios.get(
        `/topcards?limit=50&page=${page}&search=${search}`
      );
      const { results, pagination } = data.data;
      setSongs(results);
      setPagination(pagination);
    } catch (e) {
      sweetError(e);
    }
  };

  return (
    <Dashboard>
      <button className="ml-3 btn btn-secondary" onClick={() => topcard()}>
        Add New Top Card Songs
      </button>
      <br></br>
      <br></br>
      <DataTable
        columns={columns}
        rows={songs}
        onChangeNext={onChangeNext}
        onChangePrevious={onChangePrevious}
        search={search}
        pageCount={pagination?.total}
        onSearch={setSearch}
        downloadAll={downloadAll}
        deleteSelectedSongs={deleteSelectedSongs}
        isDeleteAll={isSelectedId.length > 0}
        pagination={pagination}
      />
    </Dashboard>
  );
}

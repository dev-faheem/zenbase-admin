import Dashboard from '../../layouts/dashboard';
import DataTable from '../../components/datatable';
import { useHistory } from "react-router-dom";
import { useEffect } from 'react/cjs/react.development';
import sweetError from '../../services/sweetError';
import { useState } from 'react';
import axios from 'axios';
import useURLState from '@ahooksjs/use-url-state';
import swal from 'sweetalert';
import { Input } from 'reactstrap';
import { songActions } from '../../mockData';

export default function Search() {
  const history = useHistory();
  const [songs, setSongs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [previousPage, setPreviousPage] = useState();
  const [nextPage, setNextPage] = useState();

  const [queryParams, setQueryParams] = useURLState({ page: 1, search: '' });
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isSelectedId, setIsSelectedId] = useState([]);
  const [songActionState, setSongActionState] = useState(new Array(songActions.length).fill(false)
  );

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

  const page = parseInt(queryParams.page);
  const setPage = (_page) => setQueryParams({ ...queryParams, page: _page });

  const search = queryParams.search;
  const setSearch = (_search) =>
    setQueryParams({ ...queryParams, search: _search });

  useEffect(() => {
    fetchSongs();
  }, [queryParams]);

  const downloadAll = async () => {
    const response = await axios.get('/songs');
    response.data.data?.results?.map((song) => {

      fetch(song.source)
        .then(response => {
          response.blob().then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `${song.name}.mp3`;
            a.click();
          });
        });
    })
  }

  const editSong = (data) => {
    history.push({
      pathname: '/songs/create',
      search: `?id=${data._id}`,
      state: data
    });
  }

  const deleteSelectedSongs = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, user wont be able to login or access their accounts.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axios.delete(`/songs/delete-all?ids=${isSelectedId}`);
        await fetchSongs();
      }
    });
  }

  const columns = [
    {
      name: <Input
        type="checkbox"
        className="position-relative"
        onChange={(e) => handleSelectAll(e)}
      />,
      selector: (row, index) => <Input
        type="checkbox"
        className="position-relative"
        id={row._id}
        onChange={(e) => handleClick(e, row._id)}
        checked={isSelectedId.includes(row._id)}
      />,
      checkBox: true
    },
    {
      name: 'ID',
      selector: (row, index) => index + 1,
    },

    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Artwork',
      selector: (row) => <img className="song-artwork" src={row.artwork} />,
    },
    {
      name: 'Artist',
      selector: (row) =>
        row.artist
          ?.map(
            (artist) =>
              artist?.name || <i className="text-danger">Deleted User</i>
          )
          .join(', '),
      // row.artist?.name || <i className="text-danger">*DELETED USER*</i>,
    },
    {
      name: 'Source',
      selector: (row) => {
        return <audio src={row.source} controls />;
      },
    },
    {
      name: 'Duration',
      selector: (row) => {
        return <div>{row.duration} seconds</div>;
      },
    },
    {
      name: '',
      selector: (row) => (
        <>
          <div className='d-flex'>
            <button className="btn btn-primary btn-sm mr-2" onClick={() => editSong(row)}>Edit</button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                swal({
                  title: 'Are you sure?',
                  text: 'Once deleted, you will not be able to recover this song!',
                  icon: 'warning',
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    axios.delete('/songs/' + row._id);
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

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/songs', {
        params: {
          limit: 10,
          page,
          search,
        },
      });
      setSongs(response.data.data.results);
      setTotalCount(response.data.data.songCount);
      setPreviousPage(response.data.data.previousPage);
      setNextPage(response.data.data.nextPage);
    } catch (e) {
      sweetError(e);
    }
  };
  const onChangeSongs = (position) => {
    let updatedCheckedState = songActionState.map((item, index) =>
      index === position ? !item : item
    );
    setSongActionState(updatedCheckedState);

    if (songActionState[0] === true) {
    }
    if (songActionState[1]) {
    }
    if (songActionState[2] === true) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, user wont be able to login or access their accounts.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`/users/all/${isSelectedId}`);
        }
      });
    }
  }
  return (
    <Dashboard>
      <DataTable
        columns={columns}
        rows={songs}
        page={page}
        totalCount={totalCount}
        previousPage={previousPage}
        nextPage={nextPage}
        onChangePage={setPage}
        search={search}
        onSearch={setSearch}
        downloadAll={downloadAll}
        onChangeSongs={onChangeSongs}
        deleteSelectedSongs={deleteSelectedSongs}
        isDeleteAll={isSelectedId.length > 0}
      />
    </Dashboard>
  );
}

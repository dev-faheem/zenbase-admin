import Dashboard from '../../layouts/dashboard';
import DataTable from '../../components/datatable';
import { useEffect } from 'react/cjs/react.development';
import sweetError from '../../services/sweetError';
import { useState } from 'react';
import axios from 'axios';
import useURLState from '@ahooksjs/use-url-state';
import swal from 'sweetalert';
import { Input } from 'reactstrap';

const columns = [
  {
    name: <Input
      type="checkbox"
      onChange={(e) => console.log(e.target.value)}
    />,
    selector: (row, index) => <Input
      type="checkbox"
      onChange={(e) => console.log(e.target.value)}
    />,
    checkBox:true
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
      </>
    ),
  },
];

export default function Search() {
  const [songs, setSongs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [previousPage, setPreviousPage] = useState();
  const [nextPage, setNextPage] = useState();

  const [queryParams, setQueryParams] = useURLState({ page: 1, search: '' });

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
            document.body.appendChild(a)
            a.click();
            window.URL.revokeObjectURL(url)
          });
        });

    })

  }
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
      />
    </Dashboard>
  );
}

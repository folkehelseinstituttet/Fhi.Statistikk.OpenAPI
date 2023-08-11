import './App.css';
import {useEffect, useState} from "react";
import {getData, getQuery, getSources, getTables} from './api'

function App() {
  const sourceId = 'nokkel';
  const tableId = 1;


  const [sources, setSources] = useState([]);
  const [tables, setTables] = useState([]);
  const [modifiedTables, setModifiedTables] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [flags, setFlags] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [query, setQuery] = useState([]);
  const [data, setData] = useState('');

  useEffect(() => {
    let mounted = true;
    getSources()
      .then(items => {
        if (mounted) {
          setSources(items)
        }
      });
    getTables(sourceId)
      .then(items => {
        if (mounted) {
          setTables(items)
        }
      });
    getQuery(sourceId, tableId)
      .then(response => {
        if (mounted) {
          getData(sourceId, tableId, response)
            .then(response => {
              const subset = `${JSON.stringify(response).substring(0, 1000)}...`
              setData(subset)
            })
          setQuery(response)
        }
      })
    return () => mounted = false;
  }, []);

  return (
    <div className="App">
      <div>
        <h2>Sources</h2>
        <ul>
          {sources.map(item => (<li key={item.title}>{item.title}</li>))}
        </ul>
        <h2>Query</h2>
        <pre>{JSON.stringify(query)}</pre>
        <h2>Data</h2>
        <pre>{data}</pre>
      </div>
    </div>
  );
}

export default App;

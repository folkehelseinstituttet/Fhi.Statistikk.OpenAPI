import './App.css';
import {useEffect, useState} from "react";
import {getData, getMenu, getQuery, getSources, getTables} from './api'

function App() {
  const sourceId = 'nokkel';
  const tableId = 73;


  const [sources, setSources] = useState([]);
  const [tables, setTables] = useState([]);
  const [modifiedTables, setModifiedTables] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [flags, setFlags] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [query, setQuery] = useState([]);
  const [data, setData] = useState([]);

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
        debugger
        if (mounted) {
          console.log(response)
          getData(sourceId, tableId, response)
            .then(response => {
              setData(response)
            })

          setQuery(response)
        }
      })
    return () => mounted = false;
  }, []);

  return (
    <div className="App">
      {/*   Create a list of all sources */}
      <div>
        <h2>Sources</h2>
        <ul>
          {sources.map(item => (<li key={item.title}>{item.title}</li>))}
        </ul>
        <h2>Query</h2>
        // display query
        <div>{JSON.stringify(query)}</div>
        // display data
        <h2>Data</h2>
        <div>{JSON.stringify(data)}</div>


      </div>
    </div>
  );
}

export default App;

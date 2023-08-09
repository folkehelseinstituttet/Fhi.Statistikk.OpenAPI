import './App.css';
import {useEffect, useState} from "react";
import {getData, getMenu, getQuery, getSources, getTables} from './api'

function App() {
  const sourceId = 'nokkel';
  const tableId = 11;


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
          if(mounted) {
            setSources(items)
          }
        });
    getTables(sourceId)
        .then(items => {
            if(mounted) {
            setTables(items)
          }
        });
    getQuery(sourceId, tableId)
        .then(response => {
            if(mounted) {
            setQuery(response)
          }
        })
        .then(() => {
            console.log(query)
            if(query) {
               getData(sourceId, tableId, query)
                .then(response => {
                    if(mounted) {
                    setData(response)
                  }
                })
          }
        })

    return () => mounted = false;
  }, [])
  return (
    <div className="App">
    {/*   Create a list of all sources */}
        <div>
            <h2>Sources</h2>
            <ul>
            {sources.map(item => (<li key={item.title}>{item.title}</li>))}
            </ul>
        </div>
    </div>
  );
}

export default App;

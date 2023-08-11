const baseUrl = 'https://statistikk-data.fhi.no/api/open/v1';
const path = {
  source: 'common/source',
  table: 'Table',
  metadata: 'metadata',
  dimension: 'dimension',
  data: 'data',
  flag: 'flag',
  query: 'query',
}

const updateQueryToReturnAllMeasureTypesFilteredOnFirstCategory = (query) => {
  if (!query.hasOwnProperty("Dimension") || !query.Dimensions) return;
  query.Dimensions.forEach((dimension) => {
    if (dimension.Code === "MEASURE_TYPE") {
      dimension.Filter = "all"; //Supported filters are item, all and top
      dimension.Values = ["*"];
    } else {
      dimension.Filter = "top"; //Supported filters are item, all and top
      dimension.Values = ["1"];
    }
  });
}

export const getSources = async () => {
  const response = await fetch(`${baseUrl}/${path.source}`);
  const sources = await response.json();
  return sources;
}

export const getTables = async (sourceId, modifiedAfter) => {
  let requestUrl = `${baseUrl}/${sourceId}/${path.table}`;

  if (modifiedAfter) {
    requestUrl += `?modifiedAfter=${modifiedAfter.toISOString()}`;
  }

  const response = await fetch(requestUrl);
  const tables = await response.json();
  return tables;
}

export const getMetadata = async (sourceId, tableId) => {
  const response = await fetch(`${baseUrl}/${sourceId}/${path.table}/${tableId}/${path.metadata}`);
  const metadata = await response.json();
  return metadata;
}

export const getFlags = async (sourceId, tableId) => {
  const response = await fetch(`${baseUrl}/${sourceId}/${path.table}/${tableId}/${path.flag}`);
  const flags = await response.json();
  return flags;
}

export const getDimensions = async (sourceId, tableId) => {
  const response = await fetch(`${baseUrl}/${sourceId}/${path.dimension}/${tableId}/${path.dimension}`);
  const dimensions = await response.json();
  return dimensions;
}

export const getQuery = async (sourceId, tableId) => {
  const response = await fetch(`${baseUrl}/${sourceId}/${path.table}/${tableId}/${path.query}`);
  const query = await response.json();
  return query;
}


export const getData = async (sourceId, tableId, query) => {
  if (query["dimensions"]) {
    query.response.maxRowCount = 10000000
    const response = await fetch(`${baseUrl}/${sourceId}/${path.table}/${tableId}/${path.data}`, {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json"
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(query),
    });
    const data = await response.json();
    return data;
  }
}


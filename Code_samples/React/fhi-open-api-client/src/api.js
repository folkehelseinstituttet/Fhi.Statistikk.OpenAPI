// TODO: cannot use
const baseUrl = 'https://localhost:44388/api/open/v1';
// const baseUrl = 'https://app-allvis-api-test.azurewebsites.net/api/open/v1';
const path = {
    source: 'common/source',
    table: 'table',
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
    const query = await response;
    return query;
}


export const getData = async (sourceId, tableId, query) => {
    // if (!query?.response?.format) {
    //     query.response.format = "csv3";     //Supported formats are json-stat2, csv2 and csv3
    // }
    // updateQueryToReturnAllMeasureTypesFilteredOnFirstCategory(query);

    const dataRequest = JSON.stringify(query);

    const response = await fetch(`${baseUrl}/${sourceId}/${path.table}/${tableId}/${path.data}`, {
        headers: {
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json;charset=utf-8"
        },
        method: "POST",
        body: dataRequest,
    });
    const data = await response.json();
    return data;
}


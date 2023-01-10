# User manual FHI Statistikk Open API

## Introduction
FHI Statistikk Open API offer endpoints to get data for sources which have published their data using FHI Statistikk. Example sources ...

## Swagger
The API is documented in [Swagger](link). This page can also be used to pull data from the API.

## Endpoints
### Get sources
The endpoint `/api/open/v1/Common/source` can be used to get a list of the different sources. 

The Id field in the response from this endpoint is used as the SourceId parameter in all other endpoints in the API.
### Get tables
The endpoint `/api/open/v1/{SourceId}/table` can be used to get a list of published tables from a source. An optional parameter, modifiedAfter, can be used to only list tables modified after a specific date.

The TableId field in the response from this endpoint is used together with SourceId in all the endpoints described below.
### Get table
The endpoint `/api/open/v1/{SourceId}/table/{tableId}` can be used to get information about a specific table.

The response format is the same as for the endpoint 'Get tables'.
### Get query
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/query` can be used to get the request body that is used for the Get data endpoint. The response from this endpoint will be in JSON format, and will contain categories for all dimensions and all measures. 

Each filter choice is called a dimension and the values that a dimension can have are called categories. Examples of dimensions would be 'AAR' for years or 'GEO' for geography. Examples of categories would be '2020' or '2021' for years. Measures will be listed up under the dimension 'MEASURE_TYPE', where each measure is its own category. 

The response from this endpoint can be copied and used as the request body for the 'Get data' endpoint.
### Get dimensions
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/dimension` can be used to get information about the dimensions and the corresponding categories for a tabel. 
The response, in JSON format, contains the labels for all dimensions and categories for a table. 
### Get data
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/data` can be used to get values of the measures in a table. The request body needs to be in JSON format where each dimension in the table is specified with a filter. 

Example of a request body:
```json
{
  "dimensions": [
    {
      "code": "AAR",
      "filter": "item",
      "values": [
        "2020",
        "2021"
      ]
    },
    {
      "code": "INDIKATOR",
      "filter": "all",
      "values": [
        "A*",
        "B*"
      ]
    },
    {
      "code": "GEO",
      "filter": "top",
      "values": [
        "2"
      ]
    },
    {
      "code": "MEASURE_TYPE",
      "filter": "item",
      "values": [
        "TELLER",
        "RATE"
      ]
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}
```
#### Filters
The filters that are supported are 'item', 'top' and 'all'. All dimension must have one and only one specified filtertype, but different dimensions can use different filters in the same request. The dimension for measures, 'MEASURE_TYPE', supports the same filters as the other dimensions. 

##### Item
This filter specifies exactly which catagories to pull data for. You must list at least one category, but it is possible to list up to all categories. 

##### Top
This filter specifies the number of categories to pull data for by supplying an integer with value 1 or larger. For example, if the integer 5 is provided, data will be pulled for the first 5 categories.
##### All
With this filter one can specify matches with an asterisk '*'. By listing up multiple values, for example `["A*","B*"]`, data will be pulled for all catagories that start with 'A' or 'B'. To pull data for all categories use `["*"]`. 

#### Respons formats
##### json-stat2
Returns a JSON object that follows the [JSON-stat](https://json-stat.org/format/) standard. This is a format for showing statistical tables. 
Responses from queries in this format can be pasted into the [JSON-stat explorer](http://jsonstat.com/explorer/) to view data in a more readable format. 
##### csv2
Returns csv-file with readable lables for dimensions and measures. 
##### csv3
Returns csv-file with codes for dimensions and measures. 
### Special sympols/Flagging
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/flag` can be used to get information about the special sympols or flags which are used for certain combinations of categories where the measure values can not be shown. Typical reasons why a value is flagged are missing data, the value is not possible to calculate or it has been removed for privacy considerations. 

The response body is in JSON format which contains labels for all dimensions and categories in addition to the pulled data. 
### Metadata
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/metadata` can be used to get metadata for a table. The response contains a list of the metadata sections. Each section contains a title and contents. The sections are added by an editor for the source and describe the contents of the table or give an overview of the dimensions and categories. 
### Last updated
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/metadata/lastUpdated` can be used to get the timestamp for the last time a table was updated. 
## Status codes/Error messages
### 200 Ok
Status code 200 indicates that the request was successful executed.
### 400 Bad Request
Status code 400 indicates that there was something wrong with the request. Further details about the error can be found in the status field in the response. 
### 404 Not Found
Status code 404 indicates that the data that was requested does not exist. Further details about the error can be found in the status field in the response.
# Fhi.Statistikk.OpenAPI
## Table of contents
- [Fhi.Statistikk.OpenAPI](#fhistatistikkopenapi)
  - [Table of contents](#table-of-contents)
- [User Guide FHI Statistikk Open API](#user-guide-fhi-statistikk-open-api)
  - [Introduction](#introduction)
  - [Swagger](#swagger)
  - [Endpoints](#endpoints)
    - [Get sources](#get-sources)
    - [Get tables](#get-tables)
    - [Get table](#get-table)
    - [Get query](#get-query)
    - [Get dimensions](#get-dimensions)
    - [Get data](#get-data)
      - [Filters](#filters)
        - [Item](#item)
        - [Bottom](#bottom)
        - [Top](#top)
        - [All](#all)
      - [Response](#response)
        - [MaxRowCount](#maxrowcount)
        - [Response formats](#response-formats)
          - [json-stat2](#json-stat2)
          - [csv2](#csv2)
          - [csv3](#csv3)
    - [Special sympols/flags](#special-sympolsflags)
    - [Get metadata](#get-metadata)
  - [Status codes/Error messages](#status-codeserror-messages)
    - [200 Ok](#200-ok)
    - [400 Bad Request](#400-bad-request)
    - [404 Not Found](#404-not-found)
- [Code samples](#code-samples)
  - [Swagger](#swagger-1)
  - [Postman](#postman)
  - [C#](#c)
  - [Kotlin](#kotlin)
  - [Python](#python)
  - [React](#react)
  - [Excel](#excel)





# User Guide FHI Statistikk Open API

## Introduction
FHI Statistikk Open API offer endpoints to get data for sources which have published their data using FHI Statistikk. A full list of sources with published data may be found by querying the `source`-endpoint as described below.

## Swagger
The API is documented in [Swagger](https://statistikk-data.fhi.no/swagger/index.html?urls.primaryName=Allvis%20Open%20API). This page can also be used to pull data from the API, but note that the Swagger interface have limitations when handling large data sets as response objects. 

## Endpoints
### Get sources
The endpoint `/api/open/v1/Common/source` can be used to get a list of the different sources that have published data. 

The Id field in the response from this endpoint is used as the SourceId parameter in all other endpoints in the API.
### Get tables
The endpoint `/api/open/v1/{SourceId}/table` can be used to get a list of published tables from a source. An optional parameter, modifiedAfter, can be used to only list tables modified after a specific date. A table is considered modified if there have been any changes to data, metadata or labels. Note that this is different from the updated property in the data endpoint, which represents the publication date of the data.

The TableId field in the response from this endpoint is used together with SourceId as parameters in all the endpoints described below.
### Get table
The endpoint `/api/open/v1/{SourceId}/table/{tableId}` can be used to get information about a specific table.

The response format is the same as for the endpoint 'Get tables'.
### Get query
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/query` can be used to get the request body for getting data from the table (Get data endpoint). The response from this endpoint will be in JSON format, and will contain categories for all dimensions and all measures. 

Each filter choice is called a dimension and the values that a dimension can have are called categories. Examples of dimensions would be 'AAR' for years or 'GEO' for geography. Examples of categories would be '2020' or '2021' for years. Measures will be listed up under the dimension 'MEASURE_TYPE', where each measure is its own category. 

The response from this endpoint can be copied and used as the request body for the 'Get data' endpoint to get the whole dataset (all values of the measures in the table), or adjusted to contain just subset of categories and measures and used to get the subset of the whole dataset. 
### Get dimensions
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/dimension` can be used to get information about the dimensions and the corresponding categories for a table. 
The response, in JSON format, contains the labels for all dimensions and categories for a table, as well as the frequencies of the categories and the expected frequency of the categories for a dimension.
### Get data
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/data` can be used to get values of the measures in a table. The request body needs to be in JSON format where each dimension in the table is specified with a filter. 

<details>
  <summary>Example of a request body</summary>

  ```json
  {
    "dimensions": [
      {
        "code": "AAR",
        "filter": "item",
        "values": [
          "2020_2020",
          "2021_2021"
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
      "format": "json-stat2",
      "maxRowCount": 50000
    }
  }
  ```
</details>

#### Filters
The supported filters are 'item', 'top' and 'all'. All dimension must have one and only one specified filter type, but different dimensions can use different filters in the same request. The dimension for measures, 'MEASURE_TYPE', supports the same filters as the other dimensions. 

##### Item
This filter specifies exactly which catagories to pull data for. You must list at least one category, but it is possible to list up to all categories. 
##### Bottom
This filter specifies the number of categories to pull data for by supplying an integer with value 1 or larger. For example, if the integer 5 is provided, data will be pulled for the last 5 categories.
##### Top
This filter specifies the number of categories to pull data for by supplying an integer with value 1 or larger. For example, if the integer 5 is provided, data will be pulled for the first 5 categories.
##### All
With this filter one can specify matches with wildchar '*'. By listing up multiple values, for example `["A*","B*"]`, data will be pulled for all catagories that start with 'A' or 'B'. To pull data for all categories use `["*"]`. 

#### Response
##### MaxRowCount
The data-endpoint will return an error if the number of values to be returned is more than specified by maxRowCount. To succesfully retrieve data from the endpoint either adjust category filters to reduce the number of rows to return, or increase the maxRowCount to be able to return more rows. Removing the maxRowCount from the request, will set it to infinite.
##### Response formats
###### json-stat2
Returns a JSON object that follows the [JSON-stat](https://json-stat.org/format/) standard. This is a format for showing statistical tables. 
Responses from queries in this format can be pasted into the [JSON-stat explorer](http://jsonstat.com/explorer/) to view data in a more readable format. 

Each dimension, has both a code, e.g. "GEO" or "AAR", and a more readable label, e.g. "Geografi" or "År". Dimension has a category section with an index list and label list. The index list contains codes for the categories returned, e.g. "03" or "2020_2020". The label list contains readable labels for the categories returned, e.g. "Oslo" and "2020". Note that the "Updated" field in the response indicates the publication date of the data and not when data itself was last modified.

<details>
  <summary>Example of a jsonstat response</summary>

  ```json
  {
      "class": "dataset",
      "version": "2.0",
      "href": null,
      "label": "Befolkningsvekst (B)",
      "updated": "2022-12-20T11:44:58.7706326+00:00",
      "source": null,
      "id": [
          "GEO",
          "AAR",
          "KJONN",
          "ALDER",
          "MEASURE_TYPE"
      ],
      "size": [
          2,
          2,
          1,
          1,
          1
      ],
      "role": {
        "time": null,
        "geo": null,
        "metric": [
            "MEASURE_TYPE"
        ]
    },
      "dimension": {
          "GEO": {
              "label": "Geografi",
              "category": {
                  "index": [
                      "03",
                      "30"
                  ],
                  "label": {
                      "03": "Oslo",
                      "30": "Viken"
                  }
              }
          },
          "AAR": {
              "label": "År",
              "category": {
                  "index": [
                      "2020_2020",
                      "2021_2021"
                  ],
                  "label": {
                      "2020_2020": "2020",
                      "2021_2021": "2021"
                  }
              }
          },
          "KJONN": {
              "label": "Kjønn",
              "category": {
                  "index": [
                      "0"
                  ],
                  "label": {
                      "0": "Kjønn samlet"
                  }
              }
          },
          "ALDER": {
              "label": "Alder",
              "category": {
                  "index": [
                      "0"
                  ],
                  "label": {
                      "0": "Alle aldre"
                  }
              }
          },
          "MEASURE_TYPE": {
              "label": "Måltall",
              "category": {
                  "index": [
                      "BEFVEKST_ANT"
                  ],
                  "label": {
                      "BEFVEKST_ANT": "antall"
                  },
                  "unit": {
                    "BEFVEKST_ANT": {
                        "decimals": null,
                        "label": "antall",
                        "symbol": null,
                        "position": null
                    }
                 }
              }
          }
      },
      "value": [
          3516,
          2817,
          11219,
          16846
      ],
      "status": ""
  }
  ```
</details>

###### csv2
Returns csv-file with readable lables for dimensions and measures. 
###### csv3
Returns csv-file with codes for dimensions and measures. 
### Special sympols/flags
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/flag` can be used to get information about the special sympols or flags which are used for certain combinations of categories where the measure values can not be shown. Typical reasons why a value is flagged are missing data, the value is not possible to calculate or it has been removed for privacy considerations.
### Get metadata
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/metadata` can be used to get metadata for a table. The response contains a list of the metadata sections. Each section contains title and content. 
The sections are added by an editor for the source and describe the contents of the table. The list will also contain sections for the dimensions of the table with categories for the dimension as content. 
## Status codes/Error messages
### 200 Ok
Status code 200 indicates that the request succeded.
### 400 Bad Request
Status code 400 indicates that there was something wrong with the request. Further details about the error can be found in the status field in the response. 
### 404 Not Found
Status code 404 indicates that the data that was requested does not exist. Further details about the error can be found in the status field in the response.

# Code samples
## Swagger
[Swagger definition for FHI Statistikk Open API](https://statistikk-data.fhi.no/swagger/index.html)

## Postman
Import [FHI_Statistikk_Open_API.postman_collection.json](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/Postman/FHI_Statistikk_Open_API.postman_collection.json) into a workspace in [Postman](https://web.postman.co/). 
Add variables:
 - BaseUrl (https://statistikk-data.fhi.no/)
 - SourceId (e.g. nokkel) 
 - TableId (e.g. 175) 

to be able to send all the requests in the sample.

## C#
[FHI.OpenApiClient](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/C%23/Fhi.OpenApiClient)

## Kotlin
[FhiOpenApiClient](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/Kotlin/FhiOpenApiClient)

## Python
[fhi_open_api_client.py](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/Python/fhi_open_api_client.py)

## React
[fhi-open-api-client](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/React/fhi-open-api-client/)

## Excel
[README.md](https://github.com/folkehelseinstituttet/Fhi.Statistikk.OpenAPI/tree/main/Code_samples/Excel)
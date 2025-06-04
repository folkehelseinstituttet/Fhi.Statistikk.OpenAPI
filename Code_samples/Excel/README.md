## Fetch data from Fhi Statistikk Open API in Excel
Follow the steps below to fetch data from the Open API.

1. Open a new file in Excel
2. Under "Data", click the option "Get Data" > "From Other Sources" > "Blank Query"
![Step 1](image.png)
3. A new window will open. Choose "Advanced Editor"
![Step 2](image-1.png)
4. Write Power Query code and run the query. Example queries can be fetched using the open API endpoint `api/open/v1/{sourceId}/Table/{tableId}/query`. Please refer to the [Swagger](../../README.md#swagger) and [Endpoints](../../README.md#endpoints) documentation for more information on fetching data and queries from the open API. If prompted for credentials, select "Anonymous" and click "Connect". The API does not require authentication.

Example code for select data in table "Nemdbehandla aborter i pr.tusen (promille)". Use this as a template and modify the `URL` and `jsonBody` as needed. Note the required double quotes in the JSON body. Response format should be `csv2`.:
```
let
    url="https://statistikk-data.fhi.no/api/open/v1/abr/Table/280/data",
    jsonBody= "{
        "dimensions":
        [
            {
                "filter": "item",
                "code": "AARGANG"
                "values":
                [
                    "2022",
                    "2023",
                    "2024"
                ],
            },
            {
                "filter": "item",
                "code": "UTFORT_K"
                "values":
                [
                    "99",
                    "1",
                    "2"
                ],
            },
            {
                "filter": "item",
                "code": "TYPE_BEGJARING_K"
                "values":
                [
                    "99"
                ],
            },
            {
                "filter": "item",
                "code": "SVLEN_K"
                "values":
                [
                    "99"
                ],
            },
            {
                "filter": "item",
                "code": "MEASURE_TYPE"
                "values":
                [
                    "ANTALL"
                ],
            }
        ],
        "response": {
            "format": "csv2",
            "maxRowCount": 50000
        }
    }",
    
    WebCall = Web.Contents(url, [Headers=[#"Content-Type"="application/json"], Content=Text.ToBinary(jsonBody)]),
    
    LinesFromBinary = Lines.FromBinary(WebCall),
    ConvertToTable = Table.FromList(LinesFromBinary, Splitter.SplitTextByDelimiter(";"), null, null, ExtraValues.Error)  
in  
    ConvertToTable
```
5. Click "Use First Row as Headers" under the "Transform" tab
![Step 3](image-2.png)
6. Click "Close & Load"
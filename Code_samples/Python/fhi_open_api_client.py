import json
import csv
import asyncio
import aiohttp

async def get_data_from_api_async(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            data = await response.json()
            return data

async def get_data_from_post_endpoint_async(url, query):
        query = update_query_to_return_all_measure_types_filtered_on_first_category(query)
        query["response"]["format"] = "csv3"
        headers = {"Content-Type": "application/json"}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=json.dumps(query), headers=headers) as response:
                response.raise_for_status()
                csv_data = await response.text()
                reader = csv.reader(csv_data.splitlines())
                data_list = list(reader)
                return data_list
    
def update_query_to_return_all_measure_types_filtered_on_first_category(query):
    dimensions = query["dimensions"]
    query["dimensions"] = []    
    for dimension in dimensions:
        if dimension:
            if dimension["code"] == "MEASURE_TYPE":
                dimension["filter"] = "all";    #Supported filters are item, all and top
                dimension["values"] = ["*"]                
            else:
                dimension["filter"] = "top"; 
                dimension["values"] = ["1"]
            
            query["dimensions"].append(dimension)
    
    return query

async def main():
    try:
        base_url = "https://statistikk-data.fhi.no/api/open/v1/"

        # Get a list of all sources
        sources = await get_data_from_api_async(base_url + "Common/source")

        source_id = "nokkel"

        # Get a list of all tables
        tables = await get_data_from_api_async(base_url + source_id + "/table")

        # Get a list of all tables modified after a specified datetime. This can be used to check if any tables are updated since last time data was read
        from datetime import date
        last_poll_time = date(2023, 6, 20)
        modified_tables = await get_data_from_api_async(base_url + source_id + "/table?modifiedAfter=" + last_poll_time.strftime("%Y-%m-%d"))

        # Get metadata for a table
        table_id = 175
        metadata = await get_data_from_api_async(base_url + source_id + "/table/" + str(table_id) + "/metadata")

        # Get flag values for a table
        flags = await get_data_from_api_async(base_url + source_id + "/table/" + str(table_id) + "/flag")

        # Get dimensions for a table
        dimensions = await get_data_from_api_async(base_url + source_id + "/table/" + str(table_id) + "/dimension")

        # Get a sample query for a table. The sample will ask for all data for a table
        query = await get_data_from_api_async(base_url + source_id + "/table/" + str(table_id) + "/query")

        # Get data for a table.
        if query:    
            data = await get_data_from_post_endpoint_async(base_url + source_id + "/table/" + str(table_id) + "/data", query)
    except aiohttp.ClientResponseError as e:
        print(f"Request failed with status {e.status}: {e.message}")
    except aiohttp.ClientError as e:
        print(f"Error occurred: {e}")    

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
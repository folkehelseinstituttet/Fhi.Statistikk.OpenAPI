import requests
import json
import csv

def get_data_from_api(url):
    try:
        response = requests.get(url)
        response.raise_for_status()     
        data = response.json()          
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error occurred: {e}")
        return None

def get_data_from_post_endpoint(url, query):
    try:        
        query = update_query_to_return_all_measure_types_filtered_on_first_category(query)
        query["response"]["format"] = "csv3"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, data=json.dumps(query), headers=headers)
        response.raise_for_status()
        csv_data = response.text
        reader = csv.reader(csv_data.splitlines())
        data_list = list(reader)
        return data_list
    except requests.exceptions.RequestException as e:
        print(f"Error occurred: {e}")
        return None
    
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

base_url = "https://statistikk-data.fhi.no/api/open/v1/"

# Get a list of all sources
sources = get_data_from_api(base_url + "Common/source")

source_id = "nokkel"

# Get a list of all tables
tables = get_data_from_api(base_url + source_id + "/table")

# Get a list of all tables modified after a specified datetime. This can be used to check if any tables are updated since last time data was read
from datetime import date
last_poll_time = date(2023, 6, 20)
modified_tables = get_data_from_api(base_url + source_id + "/table?modifiedAfter=" + last_poll_time.strftime("%Y-%m-%d"))

# Get metadata for a table
table_id = 1
metadata = get_data_from_api(base_url + source_id + "/table/" + str(table_id) + "/metadata")

# Get flag values for a table
flags = get_data_from_api(base_url + source_id + "/table/" + str(table_id) + "/flag")

# Get dimensions for a table
dimensions = get_data_from_api(base_url + source_id + "/table/" + str(table_id) + "/dimension")

# Get a sample query for a table. The sample will ask for all data for a table
query = get_data_from_api(base_url + source_id + "/table/" + str(table_id) + "/query")

# Get data for a table.
if query:    
    data = get_data_from_post_endpoint(base_url + source_id + "/table/" + str(table_id) + "/data", query)


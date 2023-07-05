using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Net.Http.Headers;
using Fhi.OpenApiClient;

var apiUrl = "https://statistikk-data.fhi.no";

var serializerOptions = new JsonSerializerOptions()
{
    PropertyNameCaseInsensitive = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    DictionaryKeyPolicy = JsonNamingPolicy.CamelCase
};
serializerOptions.Converters.Add(new JsonStringEnumConverter());

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddTransient<FhiOpenApiService>();
        services.AddHttpClient("FHI-Open-API", c =>
        {
            //c.Timeout = new TimeSpan(0, 0, 0, 10);
            c.BaseAddress = new Uri(apiUrl);
            c.DefaultRequestHeaders.Accept.Clear();
            c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        });
        services.AddSingleton(_ => serializerOptions);
    })
    .Build();

var fhiOpenApiService = host.Services.GetRequiredService<FhiOpenApiService>();

//Get a list of all sources
var sources = await fhiOpenApiService.GetSourcesAsync();

var sourceId = "nokkel";

//Get a list of all tables for a source
var tables = await fhiOpenApiService.GetTablesAsync(sourceId);

//Get a list of all tables for a source modified after a specified datetime. This can be used to check if any tables are updated since last time data was read
var lastPollTime = new DateTime(2023, 6, 14);
var modifiedTables = await fhiOpenApiService.GetTablesAsync(sourceId, lastPollTime);

//Get metadata for a table
var tableId = 1;
var metadata = await fhiOpenApiService.GetMetadataAsync(sourceId, tableId);

//Get flag values for a table
var flags = await fhiOpenApiService.GetFlagsAsync(sourceId, tableId);

//Get dimensions for a table
var dimensions = await fhiOpenApiService.GetDimensionsAsync(sourceId, tableId);

//Get a sample query for a table. The sample will ask for all data for a table
var query = await fhiOpenApiService.GetQueryAsync(sourceId, tableId);

//Get data for a table.
if (query != null)
{
    var data = await fhiOpenApiService.GetDataAsync(sourceId, tableId, query);
}


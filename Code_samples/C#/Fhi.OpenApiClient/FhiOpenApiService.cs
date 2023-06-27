using System.Text;
using System.Text.Json;
using Fhi.OpenApiClient.Models;

namespace Fhi.OpenApiClient
{
    internal class FhiOpenApiService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        private const string FhiOpenApiClient = "FHI-Open-API";

        public FhiOpenApiService(IHttpClientFactory httpClientFactory, JsonSerializerOptions jsonSerializerOptions)
        {
            _httpClientFactory = httpClientFactory;
            _jsonSerializerOptions = jsonSerializerOptions;
        }

        public async Task<IList<SourceOpenResponse>?> GetSourcesAsync(CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.GetAsync("/api/open/v1/Common/source", cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;
            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var sources = JsonSerializer.Deserialize<List<SourceOpenResponse>?>(responseData, _jsonSerializerOptions);
            return sources;
        }

        public async Task<IList<TableOpenResponse>?> GetTablesAsync(string sourceId, DateTime? modifiedAfter = null, CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var requestUri = $"/api/open/v1/{sourceId}/table";

            if (modifiedAfter != null)
            {
                requestUri += "?modifiedAfter=" + modifiedAfter.Value.ToString("O");
            }

            var httpResponseMessage = await httpClient.GetAsync(requestUri, cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;
            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var tables = JsonSerializer.Deserialize<List<TableOpenResponse>>(responseData, _jsonSerializerOptions);

            return tables;
        }

        public async Task<MetadataOpenResponse?> GetMetadataAsync(string sourceId, int tableId, CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.GetAsync($"/api/open/v1/{sourceId}/table/{tableId}/metadata", cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;

            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var metadata = JsonSerializer.Deserialize<MetadataOpenResponse?>(responseData, _jsonSerializerOptions);

            return metadata;
        }

        public async Task<IList<FlagOpenResponse>?> GetFlagsAsync(string sourceId, int tableId, CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.GetAsync($"/api/open/v1/{sourceId}/table/{tableId}/flag", cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;

            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var flags = JsonSerializer.Deserialize<List<FlagOpenResponse>>(responseData, _jsonSerializerOptions);

            return flags;
        }

        public async Task<DimensionsOpenResponse?> GetDimensionsAsync(string sourceId, int tableId, CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.GetAsync($"/api/open/v1/{sourceId}/table/{tableId}/dimension", cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;

            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var dimensions = JsonSerializer.Deserialize<DimensionsOpenResponse>(responseData, _jsonSerializerOptions);

            return dimensions;
        }

        public async Task<DataRequest?> GetQueryAsync(string sourceId, int tableId, CancellationToken cancellationToken = default)
        {
            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.GetAsync($"/api/open/v1/{sourceId}/table/{tableId}/query", cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode) return null;

            var responseData = await httpResponseMessage.Content.ReadAsStringAsync(cancellationToken);
            var query = JsonSerializer.Deserialize<DataRequest>(responseData, _jsonSerializerOptions);

            return query;
        }

        public async Task<IList<string[]>?> GetDataAsync(string sourceId, int tableId, DataRequest query, CancellationToken cancellationToken = default)
        {
            if (query.Response == null || query.Dimensions == null) return null;

            query.Response.Format = "csv3";     //Supported formats are json-stat2, csv2 and csv3
            UpdateQueryToReturnAllMeasureTypesFilteredOnFirstCategory(query);

            var dataRequest = JsonSerializer.Serialize(query);
            var requestContent = new StringContent(dataRequest, Encoding.UTF8, "application/json");

            using var httpClient = _httpClientFactory.CreateClient(FhiOpenApiClient);
            var httpResponseMessage = await httpClient.PostAsync($"/api/open/v1/{sourceId}/table/{tableId}/data", requestContent, cancellationToken );

            if (!httpResponseMessage.IsSuccessStatusCode) return null;

            var csvData = new List<string[]>();
            await using var contentStream = await httpResponseMessage.Content.ReadAsStreamAsync(cancellationToken);

            using var streamReader = new StreamReader(contentStream);
            while (!streamReader.EndOfStream)
            {
                var line = await streamReader.ReadLineAsync(cancellationToken);
                if (line == null) continue;
                var row = line.Replace("\"","").Split(',');
                csvData.Add(row);
            }

            return csvData;
        }

        private void UpdateQueryToReturnAllMeasureTypesFilteredOnFirstCategory(DataRequest query)
        {
            if (query.Dimensions == null) return;
            foreach (var dimension in query.Dimensions)
            {
                if (dimension.Code == "MEASURE_TYPE")
                {
                    dimension.Filter = "all"; //Supported filters are item, all and top
                    dimension.Values = new[] {"*"};
                }
                else
                {
                    dimension.Filter = "top"; //Supported filters are item, all and top
                    dimension.Values = new[] {"1"};
                }
            }
        }
    }
}

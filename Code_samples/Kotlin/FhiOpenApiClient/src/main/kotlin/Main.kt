import java.time.LocalDate

suspend fun main(args: Array<String>) {
    val fhiOpenApiService = FhiOpenApiService()

    //Get a list of all sources
    val sources = fhiOpenApiService.getSourcesAsync()

    val sourceId = "nokkel";

    //Get a list of all tables for a source
    var tables = fhiOpenApiService.getTablesAsync(sourceId)

    //Get a list of all tables for a source modified after a specified datetime. This can be used to check if any tables are updated since last time data was read
    val lastPollTime = LocalDate.of(2023, 6, 14)
    var modifiedTables = fhiOpenApiService.getTablesAsync(sourceId, lastPollTime)

    //Get metadata for a table
    var tableId = 1
    var metadata = fhiOpenApiService.getMetadataAsync(sourceId, tableId)

    //Get flag values for a table
    var flags = fhiOpenApiService.getFlagsAsync(sourceId, tableId)

    //Get dimensions for a table
    var dimensions = fhiOpenApiService.getDimensionsAsync(sourceId, tableId)

    //Get a sample query for a table. The sample will ask for all data for a table
    val query = fhiOpenApiService.getQueryAsync(sourceId, tableId)

    //Get data for a table.
    if (query != null)
    {
        var data = fhiOpenApiService.getDataAsync(sourceId, tableId, query)
    }
}
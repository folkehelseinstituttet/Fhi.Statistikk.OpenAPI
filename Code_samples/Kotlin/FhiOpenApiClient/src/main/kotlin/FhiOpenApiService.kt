
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.future.await
import kotlinx.coroutines.withContext
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import models.*
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse.BodyHandlers
import java.time.LocalDate

internal class FhiOpenApiService {
    private val baseURI = "https://statistikk-data.fhi.no"
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun getSourcesAsync(): List<SourceOpenResponse>? = withContext(Dispatchers.IO) {
        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/Common/source"))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val sources = json.decodeFromString<List<SourceOpenResponse>>(response.body())

        return@withContext sources
    }

    suspend fun getTablesAsync(sourceId: String, modifiedAfter: LocalDate? = null): List<TableOpenResponse>? = withContext(Dispatchers.IO) {
        var requestUrl = "$baseURI/api/open/v1/$sourceId/table"
        if (modifiedAfter != null)
        {
            requestUrl += "?modifiedAfter=$modifiedAfter"
        }

        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create(requestUrl))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val tables = json.decodeFromString<List<TableOpenResponse>>(response.body())

        return@withContext tables
    }

    suspend fun getMetadataAsync(sourceId: String, tableId: Int): MetadataOpenResponse? = withContext(Dispatchers.IO){
        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/$sourceId/table/$tableId/metadata"))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val metadata = json.decodeFromString<MetadataOpenResponse>(response.body())

        return@withContext metadata
    }

    suspend fun getFlagsAsync(sourceId: String, tableId: Int): List<FlagOpenResponse>? = withContext(Dispatchers.IO){
        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/$sourceId/table/$tableId/flag"))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val flags = json.decodeFromString<List<FlagOpenResponse>>(response.body())

        return@withContext flags
    }

    suspend fun getDimensionsAsync(sourceId: String, tableId: Int): DimensionsOpenResponse? = withContext(Dispatchers.IO){
        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/$sourceId/table/$tableId/dimension"))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val dimensions = json.decodeFromString<DimensionsOpenResponse>(response.body())

        return@withContext dimensions
    }

    suspend fun getQueryAsync(sourceId: String, tableId: Int): DataRequest? = withContext(Dispatchers.IO){
        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/$sourceId/table/$tableId/query"))
            .GET()
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val query = json.decodeFromString<DataRequest>(response.body())

        return@withContext query
    }

    suspend fun getDataAsync(sourceId: String, tableId: Int, query: DataRequest): List<List<String>>? = withContext(Dispatchers.IO){
        if (query.response == null || query.dimensions == null) return@withContext null

        query.response!!.format = "csv3" //Supported formats are json-stat2, csv2 and csv3
        updateQueryToReturnAllMeasureTypesFilteredOnFirstCategory(query)

        val body = json.encodeToString(query)

        val httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("$baseURI/api/open/v1/$sourceId/table/$tableId/data"))
            .headers("Content-Type", "application/json;charset=UTF-8")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .version(HttpClient.Version.HTTP_2)
            .build()

        val response = HttpClient.newBuilder()
            .build()
            .sendAsync(httpRequest, BodyHandlers.ofString())
            .await()

        if (response.statusCode() != 200) return@withContext null

        val data = response.body()

        val csvData = mutableListOf<List<String>>()

        val inputStream = data.byteInputStream()
        val reader = BufferedReader(InputStreamReader(inputStream))

        while (true) {
            val line = reader.readLine() ?: break
            if (line.isEmpty()) continue

            val lineSplit = line.replace("\\", "").split(",")
            csvData.add(lineSplit)
        }
        reader.close()

        return@withContext csvData
    }

    private fun updateQueryToReturnAllMeasureTypesFilteredOnFirstCategory(query: DataRequest) {
        if (query.dimensions == null) return
        for (dimension in query.dimensions!!) {
            if (dimension.code == "MEASURE_TYPE") {
                dimension.filter = "all" // Supported filters are item, all and top
                dimension.values = arrayOf("*")
            } else {
                dimension.filter = "top" // Supported filters are item, all and top
                dimension.values = arrayOf("1")
            }
        }
    }
}
package models

import kotlinx.serialization.Serializable

@Serializable
internal class DataRequest {
    var dimensions: Array<Dimension>? = null
    var response: ResponseClass? = null

    @Serializable
    internal class Dimension {
        var code: String? = null
        var filter: String? = null
        var values: Array<String>? = null
    }

    @Serializable
    internal class ResponseClass {
        var format: String? = null
        var maxRowCount: Int? = null
    }
}
package models

import kotlinx.serialization.Serializable

@Serializable
internal class TableOpenResponse {
    var tableId: Int = 0
    var title: String? = null
    var publishedAt: String? = null
    var modifiedAt: String? = null
}
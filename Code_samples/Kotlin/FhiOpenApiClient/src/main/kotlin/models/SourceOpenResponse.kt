package models

import kotlinx.serialization.Serializable

@Serializable
internal class SourceOpenResponse {
    var id: String = "";
    var title: String? = null;
    var description: String? = null;
    var aboutUrl: String? = null;
}
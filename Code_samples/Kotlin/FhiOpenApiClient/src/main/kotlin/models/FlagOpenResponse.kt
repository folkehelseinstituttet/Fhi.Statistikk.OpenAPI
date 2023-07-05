package models

import kotlinx.serialization.Serializable

@Serializable
internal class FlagOpenResponse {
    var title: String? = null;
    var text: String? = null;
}
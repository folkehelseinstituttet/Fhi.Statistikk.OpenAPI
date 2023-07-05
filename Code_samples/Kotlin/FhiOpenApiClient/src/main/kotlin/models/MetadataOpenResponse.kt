package models

import kotlinx.serialization.Serializable

@Serializable
internal class MetadataOpenResponse {
    var name: String? = null;
    var paragraphs: Array<MetadataOpenParagraph>? = null;

    @Serializable
    internal class MetadataOpenParagraph {
        var header: String? = null;
        var content: String? = null;
    }
}
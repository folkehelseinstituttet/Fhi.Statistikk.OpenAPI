package models

import kotlinx.serialization.Serializable

@Serializable
internal class DimensionsOpenResponse {
    var dimensions: Array<Dimension>? = null;

    @Serializable
    internal class Dimension
    {
        var code: String? = null;
        var label: String? = null;
        var categories: Array<Category>? = null;
    }

    @Serializable
    internal class Category
    {
        var label: String? = null;
        var value: String? = null;
        var children: Array<Category>? = null;
    }
}
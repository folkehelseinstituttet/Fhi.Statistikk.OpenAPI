namespace Fhi.OpenApiClient.Models
{
    internal class MetadataOpenResponse
    {
        public string? Name { get; set; }

        public MetadataOpenParagraph[]? Paragraphs { get; set; }
    }

    internal class MetadataOpenParagraph
    {
        public string? Header { get; set; }
        public string? Content { get; set; }
    }
}

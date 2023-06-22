namespace Fhi.OpenApiClient.Models
{
    internal class DimensionsOpenResponse
    {
        public Dimension[]? Dimensions { get; set; }
    }

    internal class Dimension
    {
        public string? Code { get; set; }
        public string? Label { get; set; }
        public IEnumerable<Category>? Categories { get; set; }
    }

    public class Category
    {
        public string? Label { get; set; }
        public string? Value { get; set; }
        public IEnumerable<Category>? Children { get; set; }
    }
}

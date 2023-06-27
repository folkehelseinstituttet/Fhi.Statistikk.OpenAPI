namespace Fhi.OpenApiClient.Models
{
    internal class DataRequest
    {
        public Dimension[]? Dimensions { get; set; }
        public ResponseClass? Response { get; set; }

        internal class Dimension
        {
            public string? Code { get; set; }

            public string? Filter { get; set; }

            public string[]? Values { get; set; }
        }

        internal class ResponseClass
        {
            public string? Format { get; set; }

            public int? MaxRowCount { get; set; }
        }
    }
}

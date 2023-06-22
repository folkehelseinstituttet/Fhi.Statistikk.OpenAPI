namespace Fhi.OpenApiClient.Models
{
    internal class TableOpenResponse
    {
        public int TableId { get; set; }
        public string? Title { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}

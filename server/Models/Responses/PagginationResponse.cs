namespace App.Responses
{
    public class PagginationResponse<T>
    {
        public List<T> Data { get; set; } = new List<T>();
        public int Total { get; set; }
        public int Page { get; set; }
        public int Pages { get; set; }

    }
}
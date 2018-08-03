namespace DatingApp.API.Helpers
{
    public class UserQueryParamsBase
    {
        private int _pageSize = 10;
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }

        public int CurrentUserId { get; set; }
    }

    public class UserQueryParams : UserQueryParamsBase
    {
        public string Gender { get; set; }

        public int MinAge { get; set; } = 18;

        public int MaxAge { get; set; } = 99;

        public string OrderBy { get; set; }
    }

    public class LikesQueryParams : UserQueryParamsBase
    {
        public bool Likees { get; set; }

        public bool Likers { get; set; }
    }
}

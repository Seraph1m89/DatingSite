namespace DatingApp.API.Services
{
    public interface ITokenService
    {
        string GenerateToken(int id, string name);
    }
}
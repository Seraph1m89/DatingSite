using System.Linq;
using AutoMapper;
using DatingApp.API.Dto;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.MainPhotoUrl,
                    opt => opt.MapFrom(
                        source => source.Photos.FirstOrDefault(photo =>
                            photo.IsMain).Url))
                .ForMember(dest => dest.Age,
                    opts => opts.ResolveUsing(source => source.DateOfBirth.CalculateAge()));

            CreateMap<User, UserDetailsDto>()
                .ForMember(dest => dest.MainPhotoUrl,
                    opt => opt.MapFrom(
                        source => source.Photos.FirstOrDefault(photo =>
                            photo.IsMain).Url))
                .ForMember(dest => dest.Age,
                    opts => opts.ResolveUsing(source => source.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDetailsDto>();
        }
    }
}

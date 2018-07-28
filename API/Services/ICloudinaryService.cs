﻿using System;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Services
{
    public interface ICloudinaryService
    {
        Cloudinary GetCloudinary();

        ImageUploadResult UploadImage(IFormFile file);

        DeletionResult DeleteImage(string publicId);
    }

    class CloudinaryService : ICloudinaryService
    {
        private readonly IOptions<CloudinarySettings> _options;

        public CloudinaryService(IOptions<CloudinarySettings> options)
        {
            _options = options;
        }

        public Cloudinary GetCloudinary()
        {
            var account = new Account(_options.Value.CloudName, _options.Value.ApiKey, _options.Value.ApiSecret);
            return new Cloudinary(account);
        }

        public ImageUploadResult UploadImage(IFormFile file)
        {
            var uploadResults = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResults = GetCloudinary().Upload(uploadParams);
                }
            }

            return uploadResults;
        }

        public DeletionResult DeleteImage(string publicId)
        {
			var deleteParams = new DeletionParams(publicId);
	        return GetCloudinary().Destroy(deleteParams);
		}
    }
}

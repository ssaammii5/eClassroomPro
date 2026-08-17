// backend/src/Application/Interfaces/IFileStorageService.cs
using Microsoft.AspNetCore.Http;

namespace eClassroomPro.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string folder, CancellationToken cancellationToken = default);
    void DeleteFile(string storedPath);
}
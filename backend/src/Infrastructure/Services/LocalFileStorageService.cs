// backend/src/Infrastructure/Services/LocalFileStorageService.cs
using eClassroomPro.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace eClassroomPro.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder, CancellationToken cancellationToken = default)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folder);
        Directory.CreateDirectory(uploadsFolder);
        
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
        
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);
        
        return $"uploads/{folder}/{uniqueFileName}";
    }

    public void DeleteFile(string storedPath)
    {
        if (string.IsNullOrEmpty(storedPath)) return;
        var fullPath = Path.Combine(_env.WebRootPath, storedPath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}
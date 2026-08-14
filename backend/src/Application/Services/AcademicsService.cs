using eClassroomPro.Application.DTOs.Academics;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Services;

public class AcademicsService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public AcademicsService(
        IApplicationDbContext db,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _db = db;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    // ───────── Programs ─────────
    public async Task<List<AcademicProgramDto>> GetProgramsAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        return await _db.AcademicPrograms
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new AcademicProgramDto { Id = x.Id, Name = x.Name, Description = x.Description })
            .ToListAsync(cancellationToken);
    }

    public async Task<AcademicProgramDto> CreateProgramAsync(UpsertAcademicProgramDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationException("Program name is required.");

        var name = dto.Name.Trim();
        if (await _db.AcademicPrograms.AnyAsync(x => x.Name == name, cancellationToken))
            throw new BusinessException("A program with this name already exists.");

        var entity = new AcademicProgram { Name = name, Description = dto.Description?.Trim() ?? string.Empty };
        await _db.AcademicPrograms.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AcademicProgramDto { Id = entity.Id, Name = entity.Name, Description = entity.Description };
    }

    public async Task UpdateProgramAsync(int id, UpsertAcademicProgramDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicPrograms.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Program not found.");

        var name = dto.Name.Trim();
        if (await _db.AcademicPrograms.AnyAsync(x => x.Name == name && x.Id != id, cancellationToken))
            throw new BusinessException("A program with this name already exists.");

        entity.Name = name;
        entity.Description = dto.Description?.Trim() ?? string.Empty;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteProgramAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicPrograms.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Program not found.");

        _db.AcademicPrograms.Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    // ───────── Departments ─────────
    public async Task<List<AcademicDepartmentDto>> GetDepartmentsAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        return await _db.AcademicDepartments
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new AcademicDepartmentDto { Id = x.Id, Name = x.Name, Code = x.Code })
            .ToListAsync(cancellationToken);
    }

    public async Task<AcademicDepartmentDto> CreateDepartmentAsync(UpsertAcademicDepartmentDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationException("Department name is required.");
        if (string.IsNullOrWhiteSpace(dto.Code))
            throw new ValidationException("Department code is required.");

        var code = dto.Code.Trim();
        if (await _db.AcademicDepartments.AnyAsync(x => x.Code == code, cancellationToken))
            throw new BusinessException("A department with this code already exists.");

        var entity = new AcademicDepartment { Name = dto.Name.Trim(), Code = code };
        await _db.AcademicDepartments.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AcademicDepartmentDto { Id = entity.Id, Name = entity.Name, Code = entity.Code };
    }

    public async Task UpdateDepartmentAsync(int id, UpsertAcademicDepartmentDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicDepartments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Department not found.");

        var code = dto.Code.Trim();
        if (await _db.AcademicDepartments.AnyAsync(x => x.Code == code && x.Id != id, cancellationToken))
            throw new BusinessException("A department with this code already exists.");

        entity.Name = dto.Name.Trim();
        entity.Code = code;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteDepartmentAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicDepartments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Department not found.");

        _db.AcademicDepartments.Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    // ───────── Semesters ─────────
    public async Task<List<AcademicSemesterDto>> GetSemestersAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        return await _db.AcademicSemesters
            .AsNoTracking()
            .OrderByDescending(x => x.Name)
            .Select(x => new AcademicSemesterDto { Id = x.Id, Name = x.Name })
            .ToListAsync(cancellationToken);
    }

    public async Task<AcademicSemesterDto> CreateSemesterAsync(UpsertAcademicSemesterDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationException("Semester name is required.");

        var name = dto.Name.Trim();
        if (await _db.AcademicSemesters.AnyAsync(x => x.Name == name, cancellationToken))
            throw new BusinessException("A semester with this name already exists.");

        var entity = new AcademicSemester { Name = name };
        await _db.AcademicSemesters.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AcademicSemesterDto { Id = entity.Id, Name = entity.Name };
    }

    public async Task UpdateSemesterAsync(int id, UpsertAcademicSemesterDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicSemesters.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Semester not found.");

        var name = dto.Name.Trim();
        if (await _db.AcademicSemesters.AnyAsync(x => x.Name == name && x.Id != id, cancellationToken))
            throw new BusinessException("A semester with this name already exists.");

        entity.Name = name;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteSemesterAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();
        var entity = await _db.AcademicSemesters.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Semester not found.");

        _db.AcademicSemesters.Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only admins can manage academics.");
    }
}
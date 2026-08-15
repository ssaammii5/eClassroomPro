using System.Text.Json;
using eClassroomPro.Application.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<GlobalExceptionMiddleware>>();
            logger.LogError(exception, "Unhandled exception occurred.");

            context.Response.ContentType = "application/json";

            switch (exception)
            {
                case UnauthorizedAccessException:
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await WriteErrorAsync(context, exception.Message);
                    break;

                case ForbiddenAccessException:
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await WriteErrorAsync(context, exception.Message);
                    break;

                case NotFoundException:
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    await WriteErrorAsync(context, exception.Message);
                    break;

                case ValidationException:
                case BusinessException:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await WriteErrorAsync(context, exception.Message);
                    break;

                // Phase 9: client cancelled the request — not a server failure.
                case OperationCanceledException:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await WriteErrorAsync(context, "The request was cancelled.");
                    break;

                // Phase 9: EF save failures (unique key violations, concurrency, etc.)
                // return a safe 409 instead of leaking provider details as a 500.
                case DbUpdateException:
                    context.Response.StatusCode = StatusCodes.Status409Conflict;
                    await WriteErrorAsync(context, "A database error occurred while saving changes.");
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    await WriteErrorAsync(context, "An unexpected error occurred.");
                    break;
            }
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, string message)
    {
        var response = new
        {
            error = message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
using System.Net;
using System.Text.Json;
using HotelManageSys.API.Exceptions;

namespace HotelManageSys.API.Middleware;

public class ExceptionMiddleware
{

    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;


    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context,ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception,"Nieobsłużony wyjątek: {message}",exception.Message);

        context.Response.ContentType = "application/json";

        var response = new ErrorResponse();
        
        switch (exception)
            {
                case ValidationException validationEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Type = "ValidationError";
                    response.Title = "Błędy walidacji";
                    response.Status = 400;
                    response.Errors = validationEx.Errors;
                    break;
                
                case NotFoundException notFoundEx:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Type = "NotFound";
                    response.Title = notFoundEx.Message;
                    response.Status = 404;
                    break;
                
                case ArgumentException argEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Type = "BadRequest";
                    response.Title = argEx.Message;
                    response.Status = 400;
                    break;
                
                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response.Type = "Unauthorized";
                    response.Title = "Brak autoryzacji";
                    response.Status = 401;
                    break;

                case InvalidOperationException invalidOpEx:
                    context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response.Type = "Forbidden";
                    response.Title = invalidOpEx.Message;
                    response.Status = 403;
                    break;
                
                case UniqueConstraintException uniqConstrEx:
                    context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    response.Type = "Conflict";
                    response.Title = uniqConstrEx.Message;
                    response.Status = 409;
                    break;
                
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Type = "InternalError";
                    response.Title = _environment.IsDevelopment()
                        ? exception.Message
                        : "Wystąpił błąd serwera";
                    response.Status = 500;
                    
                    if (_environment.IsDevelopment())
                    {
                        response.Detail = exception.StackTrace;
                    }
                    break;
            }
        
            response.TraceId = context.TraceIdentifier;

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _environment.IsDevelopment()
            });

            await context.Response.WriteAsync(json);
    }
}
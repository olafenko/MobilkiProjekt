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
        _logger.LogError(exception,$"Nieobsłużony wyjątek: {exception.Message}");

        context.Response.ContentType = "application/json";

        var response = new ErrorResponse();

        //todo dodac mapsera dla ErrorResponse dla odpowiedniego errora
        
        switch (exception)
            {
                // Błędy walidacji - 400 Bad Request
                case ValidationException validationEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Type = "ValidationError";
                    response.Title = "Błędy walidacji";
                    response.Status = 400;
                    response.Errors = validationEx.Errors;
                    break;

                // Nie znaleziono - 404 Not Found
                case NotFoundException notFoundEx:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Type = "NotFound";
                    response.Title = notFoundEx.Message;
                    response.Status = 404;
                    break;

                // Nieprawidłowy argument - 400 Bad Request
                case ArgumentException argEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Type = "BadRequest";
                    response.Title = argEx.Message;
                    response.Status = 400;
                    break;

                // Brak autoryzacji - 401 Unauthorized
                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response.Type = "Unauthorized";
                    response.Title = "Brak autoryzacji";
                    response.Status = 401;
                    break;

                // Operacja niedozwolona - 403 Forbidden
                case InvalidOperationException invalidOpEx:
                    context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response.Type = "Forbidden";
                    response.Title = invalidOpEx.Message;
                    response.Status = 403;
                    break;

                // Wszystko inne - 500 Internal Server Error
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Type = "InternalError";
                    response.Title = _environment.IsDevelopment()
                        ? exception.Message
                        : "Wystąpił błąd serwera";
                    response.Status = 500;

                    // W development dodaj stack trace
                    if (_environment.IsDevelopment())
                    {
                        response.Detail = exception.StackTrace;
                    }
                    break;
            }

            // Dodaj TraceId dla śledzenia
            response.TraceId = context.TraceIdentifier;

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _environment.IsDevelopment()
            });

            await context.Response.WriteAsync(json);
    }
}
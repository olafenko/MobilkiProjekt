using System.Diagnostics;
using System.Text.Json;
using MediatR;

namespace HotelManageSys.API.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {

        private readonly ILogger<LoggingBehavior<TRequest,TResponse>> _logger;


        public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {

            var requestName = typeof(TRequest).Name;
            var requestId = Guid.NewGuid().ToString("N")[..8];

            _logger.LogInformation($"[{requestId}] => START {requestName}");

            if (_logger.IsEnabled(LogLevel.Debug))
            {
                try
                {
                    var requestJson = JsonSerializer.Serialize(request,
                        new JsonSerializerOptions { WriteIndented = false, MaxDepth = 3 });
                    _logger.LogDebug($"[{requestId}] Request: {requestJson}");
                }
                catch
                {
                    
                    _logger.LogDebug($"[{requestId}] Request: (nie udało się zserializować)");
                }
                
            }

            var stopwatch = Stopwatch.StartNew();

            try
            {
                var response = await next();

                stopwatch.Stop();

                _logger.LogInformation(
                    $"[{requestId}] => END {requestName} (Czas wykonania: {stopwatch.ElapsedMilliseconds} ms)");

                if (stopwatch.ElapsedMilliseconds > 500)
                {
                    _logger.LogWarning(
                        $"[{requestId}] => SLOW {requestName} (Czas wykonania: {stopwatch.ElapsedMilliseconds} ms)");
                }

                return response;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex,$"[{requestId}] FAILED {requestName} (Czas wykonania: {stopwatch.ElapsedMilliseconds} ms) - {ex.Message}");
                throw;
            }
        }
    }
}

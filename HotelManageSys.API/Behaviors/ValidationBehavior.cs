using FluentValidation;
using MediatR;
using ValidationException = HotelManageSys.API.Exceptions.ValidationException;

namespace HotelManageSys.API.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {

        private readonly IEnumerable<IValidator<TRequest>> _validators;
        private readonly ILogger<ValidationBehavior<TRequest,TResponse>> _logger;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators, ILogger<ValidationBehavior<TRequest, TResponse>> logger)
        {
            _validators = validators;
            _logger = logger;
        }


        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (!_validators.Any())
            {
                return await next();
            }

            var requestName = typeof(TRequest).Name;
            _logger.LogDebug($"Walidacja {requestName}");
            
            var context = new ValidationContext<TRequest>(request);

            var validationResults =
                await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            var failures =
                validationResults.Where(r => r.Errors.Any()).SelectMany(r => r.Errors).ToList();

            if (failures.Any())
            {
                _logger.LogWarning("Walidacja {requestName} nie powiodła się. Błędy {@Errors}"
                    ,requestName
                    ,failures.Select(f => new {f.PropertyName, f.ErrorMessage}));

                throw new ValidationException(failures);
            }
            
            
            _logger.LogDebug($"Walidacja {requestName} przebiegła pomyślnie");
            
            return await next();

        }
    }
}

using FluentValidation.Results;

namespace HotelManageSys.API.Exceptions;

public class ValidationException : Exception
{

    public IDictionary<string, string[]> Errors { get; }

    public ValidationException():base("Napotkano błędy walidacji")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures) : this()
    {
        Errors = failures.GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(g => g.Key, g => g.ToArray());
    }
    
    public ValidationException(string propertyName, string errorMessage) : this()
    {
        Errors = new Dictionary<string, string[]>
        {
            { propertyName, new[] { errorMessage } }
        };
    }
    
}
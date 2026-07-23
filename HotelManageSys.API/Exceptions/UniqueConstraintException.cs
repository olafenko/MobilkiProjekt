namespace HotelManageSys.API.Exceptions;

public class UniqueConstraintException : Exception
{
    public string PropertyName { get; }

    public UniqueConstraintException(string propertyName) : base($"{propertyName} jest już zajęty")
    {
        PropertyName = propertyName;
    }
    
    public UniqueConstraintException(string propertyName, string errorMessage) : base(errorMessage)
    {
        PropertyName = propertyName;
    }
}
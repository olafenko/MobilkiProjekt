import {ApiError, isValidationError} from "../types/errors.ts";
import {useCallback, useState} from "react";


interface FormErrors {
    [key:string] : string | undefined;
}

interface UseFormErrorsResult {
    errors: FormErrors;
    generalError: string | null;
    setFieldError: (field: string, message: string) => void;
    clearFieldError: (field: string) => void;
    clearAllErrors: () => void;
    handleApiError: (error: ApiError) => void;
    hasErrors: boolean;
}

export function useFormErrors(): UseFormErrorsResult {
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    
    const setFieldError = useCallback((field: string, message: string) => {
        setErrors(prev => ({...prev,[field]: message}));
    }, []);
    
    const clearFieldError = useCallback((field: string) => {
        setErrors(prev => {
            const {[field]: _, ...rest} = prev;
            return rest;
        });
    }, []);
    
    const clearAllErrors = useCallback(() => {
        setErrors({});
        setGeneralError(null);
    },[]);
    
    const handleApiError = useCallback((error: ApiError)=> {
        if(isValidationError(error)){
            const fieldErrors: FormErrors = {};
           
            Object.entries(error.errors).forEach(([field,messages]) => {
                const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
                fieldErrors[fieldName] = messages[0];
            });
            
            setErrors(fieldErrors);
            setGeneralError(null);
        } else {
            setErrors({});
            setGeneralError(error.title);
        }
    },[]);
    
    const hasErrors = Object.keys(errors).length > 0 || generalError !== null;
    
    return {
        errors,
        generalError,
        setFieldError,
        clearFieldError,
        clearAllErrors,
        handleApiError,
        hasErrors
    };
    
}

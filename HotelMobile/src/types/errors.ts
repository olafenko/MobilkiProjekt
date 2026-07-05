export interface ApiError {
    type: string;
    title: string;
    status: number;
    detail?: string;
    traceId?: string;
    errors?: Record<string, string[]>
}


export interface ValidationError extends ApiError {
    type: 'ValidationError';
    errors: Record<string,string[]>;
}

export function isValidationError(error: ApiError): error is ValidationError {
    return error.type === 'ValidationError' && error.errors !== undefined;
}

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' && error != null && 'type' in error && 'title' in error && 'status' in error
    );
}
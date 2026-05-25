'use strict';

const { ReasonPhrase, StatusCode } = require("../ultis/httpStatusCode");


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
   
    constructor(message = ReasonPhrase.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

class AuthenticationFailedError extends ErrorResponse {
    constructor(message = ReasonPhrase.AuthenticationFailedError, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
        
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrase.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode);
    }
        
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCode.ForbiddenError) {
        super(message, statusCode);
    }
        
}
        

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthenticationFailedError,
    NotFoundError,
    ForbiddenError
}
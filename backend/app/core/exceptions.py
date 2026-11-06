from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logging import logger


class NovaException(Exception):
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, error_code: str = "BAD_REQUEST"):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(message)


class NotFoundException(NovaException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=status.HTTP_404_NOT_FOUND, error_code="NOT_FOUND")


class UnauthorizedException(NovaException):
    def __init__(self, message: str = "Invalid credentials or unauthorized"):
        super().__init__(message, status_code=status.HTTP_401_UNAUTHORIZED, error_code="UNAUTHORIZED")


class ForbiddenException(NovaException):
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status_code=status.HTTP_403_FORBIDDEN, error_code="FORBIDDEN")


async def nova_exception_handler(request: Request, exc: NovaException):
    logger.warning(f"NovaException on {request.method} {request.url.path}: {exc.message} ({exc.error_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.message,
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(x) for x in err.get("loc", [])])
        errors.append({"field": loc, "message": err.get("msg")})
        
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "details": errors
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later."
            }
        }
    )


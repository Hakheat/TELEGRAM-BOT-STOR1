class BaseAppException(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class InsufficientBalanceException(BaseAppException):
    def __init__(self, message: str = "Insufficient user balance to complete purchase"):
        super().__init__(message=message, code="INSUFFICIENT_BALANCE")


class OutOfStockException(BaseAppException):
    def __init__(self, message: str = "Product is currently out of stock"):
        super().__init__(message=message, code="OUT_OF_STOCK")


class UserNotFoundException(BaseAppException):
    def __init__(self, message: str = "User account not found"):
        super().__init__(message=message, code="USER_NOT_FOUND")


class ProductNotFoundException(BaseAppException):
    def __init__(self, message: str = "Product not found"):
        super().__init__(message=message, code="PRODUCT_NOT_FOUND")


class CategoryNotFoundException(BaseAppException):
    def __init__(self, message: str = "Category not found"):
        super().__init__(message=message, code="CATEGORY_NOT_FOUND")


class InvalidTokenException(BaseAppException):
    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(message=message, code="INVALID_TOKEN")


class RateLimitExceededException(BaseAppException):
    def __init__(self, message: str = "Too many requests. Please try again later."):
        super().__init__(message=message, code="RATE_LIMIT_EXCEEDED")

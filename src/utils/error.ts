class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access') {
      super(message, 401);
    }
  }
  
  export { CustomError, NotFoundError, UnauthorizedError };
  
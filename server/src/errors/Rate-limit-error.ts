import { CustomError } from "./custom-error"

export class RateLimitError extends CustomError{
    statusCode=429;
    constructor(){
        super('Rate limit exceeded');
        Object.setPrototypeOf(this,RateLimitError.prototype);
    }
    serializeErrors() {
        return [{message:'Rate limit exceeded'}]
    }
}
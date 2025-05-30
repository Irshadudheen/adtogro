import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason ='Error connecting to database';
    statusCode=500;
    constructor(){
        super('err conneting to mongodb');

        Object.setPrototypeOf(this,DatabaseConnectionError.prototype);
    }
    serializeErrors(){
        return [
            {message:this.reason}
        ]
    }
}
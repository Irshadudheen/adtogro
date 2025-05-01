import { CustomError } from "./custom-error";

export class SocketNotInitializedError extends CustomError {
    reason ='Socket.io has not been initialized!';
    statusCode=500;
    constructor(){
        super('Error connecting to Socket.io');

        Object.setPrototypeOf(this,SocketNotInitializedError.prototype);
    }
    serializeErrors(){
        return [
            {message:this.reason}
        ]
    }
}
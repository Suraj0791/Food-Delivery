export class AppError extends Error {
    public statusCode: number;
    public explanation: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = message;
        // Set the prototype explicitly to maintain the prototype chain
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
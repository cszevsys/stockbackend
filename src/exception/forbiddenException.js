class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.error = message;
    }
}

export default ForbiddenException;
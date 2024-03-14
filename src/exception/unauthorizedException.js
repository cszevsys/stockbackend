class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.error = message;
    }
}

export default UnauthorizedException;
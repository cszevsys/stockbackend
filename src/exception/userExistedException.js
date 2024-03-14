class UserExistedException extends Error {
    constructor(message) {
        super(message);
        this.error = message;
    }
}

export default UserExistedException;
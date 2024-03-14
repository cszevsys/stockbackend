class VsysException extends Error {
    constructor(message) {
        super(message);
        this.error = message;
    }
}

export default VsysException;
import NotFoundException from "../exception/notFoundException.js";
import ExistedException from "../exception/existedException.js";
import InvalidPwdException from "../exception/invalidPwdException.js";
import UnauthorizedException from "../exception/unauthorizedException.js";
import ForbiddenException from "../exception/forbiddenException.js";
import InvalidInputException from "../exception/invalidInputException.js";
import { logger } from "../../logger.js";

const successResponse = (res, response) => { 
    res.status(200).send({ status: "Success" , message: response});
};
const defaultSuccessResponse = (res) => {
    res.status(200).send({ status: "Success" });
};
const defaultErrorResponse = (res, error) => {
    logger.error(`error: ${error}`);
    res.status(500).send({ status: "Internal Server Error" , message: error.message });
};
const ExistErrorResponse = (res, error) => {
    res.status(409).json({ status: "Conflict", message: error.message });
};
const UnauthorizedErrorResponse = (res, error) => {
    res.status(401).json({ status: "Unauthorized", message: error.message });
};
const InvalidInputErrorResponse = (res, error) => {
    res.status(422).json({ status: "Invalid Input", message: error.message });
};
const ForbiddenErrorResponse = (res, error) => {
    res.status(403).json({ status: "Forbidden", message: error.message });
};
const NotFoundErrorResponse = (res, error) =>
    res.status(404).json({ status: "Not Found Error", message: error.message });

const msgHandler = (res, code, status, message) =>
    res.status(code).json({ status: status, message: message });

export default {
    async errorHandler(res, err) {
        if (err instanceof NotFoundException) NotFoundErrorResponse(res, err);
        else if (err instanceof ExistedException) ExistErrorResponse(res, err);
        else if (err instanceof InvalidPwdException) UnauthorizedErrorResponse(res, err);
        else if (err instanceof UnauthorizedException) UnauthorizedErrorResponse(res, err);
        else if (err instanceof InvalidInputException) InvalidInputErrorResponse(res, err);
        else if (err instanceof ForbiddenException) ForbiddenErrorResponse(res, err);
        else defaultErrorResponse(res, err);
    },
    async successHandler(res, response = null) {
        if (response) successResponse(res, response);
        else defaultSuccessResponse(res);
    },
    async customResponseHandler(res, code, status, message) {
        msgHandler(res, code, status, message);
    }
}

import { ERROR_MESSAGES } from '../constants/errorMessages.js';
export const errorMiddleWare = (err, req, res, next) => {
    err.message || (err.message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

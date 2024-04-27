import validator from 'validator';
export const isEmailValid = () => {
    return validator.default.isEmail;
};
export { validator };

import joi from 'joi';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!#=+.%*?&])[A-Za-z\d-@_$!#=+.%*?&]{8,20}$/;

const signUpSchema = joi.object({
    email: joi.string().pattern(emailRegex).required(),
    password: joi.string().pattern(passwordRegex).required(),
});

export {
    signUpSchema,
};

import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
});

const habitSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    goal: Joi.number().min(1).required(),
});

export { userSchema, habitSchema };
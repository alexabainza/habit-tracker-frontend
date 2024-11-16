import Joi from "joi";
import z from "zod";

const LoginSchema = z.object({
    identifier: z.string().min(3).max(30),
    password: z.string().min(8),
});

const RegisterUserSchema = z.object({
    email: z.string().email({ message: "Email is required." }).min(5, { message: "Not a valid email." }).max(255, { message: "Email is too long." }),
    username: z.string({ message: "Username is required." }).min(3, { message: "Username is required 3 characters." }).max(30, { message: "Username is too long." }),
    password: z.string({ message: "Password is required." }).min(8, { message: "Password should be at least 8 characters." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, and one number." }),
});

const habitSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    goal: Joi.number().min(1).required(),
});

export { habitSchema, RegisterUserSchema, LoginSchema };
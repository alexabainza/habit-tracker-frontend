import z from "zod";

const LoginSchema = z.object({
    identifier: z.string({ message: "Email or Username required." }).min(3, { message: "Identifier should be at least 3 letters long." }).max(30, { message: "Should be at most 30 letters long." }),
    password: z.string({ message: "Password is required." }).min(8, { message: "Password should be at least 8 characters." }),
});

const OtpSchema = z.object({
    email: z.string({ message: "Email is required." }).email({ message: "Email invalid." }).min(5, { message: "Email is too short." }).max(255, { message: "Email is too long." }),
    otp: z.string({ message: "OTP is required." }).min(6, { message: "OTP should be at least 6 characters." }),
});

const RegisterUserSchema = z.object({
    email: z.string().email({ message: "Email is required." }).min(5, { message: "Not a valid email." }).max(255, { message: "Email is too long." }),
    username: z.string({ message: "Username is required." }).min(3, { message: "Username is required 3 characters." }).max(30, { message: "Username is too long." }),
    password: z
        .string({ message: "Password is required." })
        .min(8, { message: "Password should be at least 8 characters." })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
            { message: "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character." }
        ),
}).refine(data => data.password !== data.username, {
    message: "Password should not be the same as username.",
});

const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Email is required." }).min(5, { message: "Not a valid email." }).max(255, { message: "Email is too long." }),
})

const ResetPasswordSchema = z.object({
    email: z.string({ message: "Token is required." }).min(3, { message: "Token is required." }).email({ message: "Not a valid email." }).max(255, { message: "Email is too long." }),
    token: z.string({ message: "Token is required." }).min(3, { message: "Token is required." }),
    new_password: z.string({ message: "New password is required." }).min(8, { message: "Password should be at least 8 characters." }).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
        { message: "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character." }
    ),
    confirm_password: z.string({ message: "Confirm password is required." }).min(8, { message: "Passwords must be the same" })
}).refine(data => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must be the same.",
});

const habitSchema = z.object({
    name: z.string({ message: "Habit name is required." }).min(3).max(30),
    goal: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z.number().min(1, { message: "Goal must be at least 1." })
    ),
});

const EditUserSchema = z.object({
    username: z.string({ message: "Username is required." }).min(3, { message: "Username is required 3 characters." }).max(30, { message: "Username is too long." }),
});

export { habitSchema, RegisterUserSchema, LoginSchema, OtpSchema, EditUserSchema, ForgotPasswordSchema, ResetPasswordSchema };
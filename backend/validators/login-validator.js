const { z } = require("zod");

const loginValidator = () => {
    return z.object({
        email: z.string({ required_error: "Please enter your email" }).trim().email({ message: "Invalid email address" }).min(6, { message: "email should be of at least of 6 characters" }).max(250, { message: "email must not exceed 250 alphabets" }),
        password: z.string({ required_error: "Please enter your password" }).trim().min(2, { message: "password should be at least of 2 characters" }).max(50, { message: "userid must not exceed 50 alphabets" }),
    });
};

module.exports = loginValidator;
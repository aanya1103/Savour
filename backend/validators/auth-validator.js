const {z}= require("zod");

const signUpValidator= z.object({
    userid: z.string({required_error: "Please enter your userid"}).trim().min(1, {message:"userid should be at least of 3 characters"}).max(50, {message: "userid must not exceed 50 alphabets"}),
    email: z.string({required_error: "Please enter your email"}).trim().email({message:"Invalid email address"}).min(10, {message:"email should be at least of 3 characters"}).max(250, {message: "email must not exceed 250 alphabets"}),
    contact: z.string({required_error: "Please enter your contact"}).trim().min(10, {message:"contact should be at least of 10 characters"}).max(10, {message: "contact must not exceed 10 alphabets"}),
    password: z.string({required_error: "Please enter your password"}).trim().min(1, {message:"userid should be at least of 1 characters"}).max(50, {message: "userid must not exceed 50 alphabets"}),
});

module.exports=signUpValidator;
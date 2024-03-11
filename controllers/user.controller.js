const User = require("../models/user.model");
const { z } = require("zod");

const userMessageSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Must be 1 or more characters long" }),
  lastname: z.string().min(1, { message: "Must be 5 or more characters long" }),
  email: z
    .string()
    .email()
    .min(4, { message: "Must be 4 or more characters long" }),
  message: z.string(),
});

exports.saveUserMessage = async (req, res) => {
  try {
    // Validating the request body using Zod schema
    const validatedBody = userMessageSchema.safeParse(req.body);

    if (!validatedBody.success) {
      // If validation fails, returning a 400 error with validation details
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: validatedBody.error.issues.map((issue) => issue.message),
      });
    }

    const existingUser = await User.findOne({
      email: validatedBody.data.email,
    });

    if (existingUser) {
      return res.status(209).json({
        message: "duplicate email address",
      });
    }

    const newUser = new User(validatedBody.data);

    // Saving user to the database
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User information saved successfully",
    });
  } catch (error) {
    console.log("Catch error:" + error);
    res.status(500).json({
      success: false,
      message: "Error saving user information",
      error: error.message,
    });
  }
};

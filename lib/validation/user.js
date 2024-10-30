const { z } = require('zod');

// Validate a user ID to ensure it is a valid MongoDB ObjectId (24 hexadecimal characters)
const userIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: 'Invalid user ID', // Error message for invalid user ID
});

// Validate a username with specific criteria
const userNameValidation = z
  .string()
  .min(3, {
    message: 'Username must be at least 3 characters long', // Minimum length requirement
  })
  .max(20) // Maximum length requirement
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must contain only letters, numbers, and underscores', // Allowed characters
  });

// Validate a password with specific criteria
const passwordValidation = z
  .string()
  .min(6, {
    message: 'Password must be at least 6 characters long', // Minimum length requirement
  })
  .max(15, {
    message: 'Password must be at most 15 characters long', // Maximum length requirement
  });

// Schema for user sign-up, defining the structure and validation rules
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, {
      message: 'Full name must be at least 3 characters long', // Minimum length requirement
    })
    .max(20) // Maximum length requirement
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Full name must contain only letters and spaces', // Allowed characters
    }),
  username: userNameValidation, // Use the username validation defined above
  email: z.string().email(), // Validate email format
  password: passwordValidation // Use the password validation defined above
});

// Schema for user sign-in, defining the structure and validation rules
const signInSchema = z.object({
  username: userNameValidation, // Use the username validation defined above
  password: passwordValidation // Use the password validation defined above
});

// Export the schemas and userIdValidation for use in other modules
module.exports = { signUpSchema, signInSchema, userIdValidation };

import Joi from "joi";
// Validate request body using the schema
interface AuthData {
  email: string;
  password: string;
}

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(6)
    .regex(/[A-Za-z]/, "letters")
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.name": "Password must contain at least one letter",
      "any.required": "Password is required",
    }),
});

const validateAuth = (data: AuthData): Joi.ValidationError | undefined => {
  const { error } = userSchema.validate(data, { allowUnknown: true });
  return error;
};

export default validateAuth;

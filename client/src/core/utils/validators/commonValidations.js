import * as Yup from "yup";

const requiredStringValidation = (
  name = "This Field",
  minLength = 1,
  maxLength = 255,
  message = "This field is required"
) => {
  return Yup.string()
    .min(minLength, `${name} must be at least ${minLength} characters`)
    .max(maxLength, `${name} must be less than ${maxLength} characters`)
    .required(message);
};

const emailValidation = () => {
  return Yup.string()
    .email("Invalid email format")
    .required("Email is required");
};

const passwordValidation = (minLength = 8) => {
  return Yup.string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required");
};


const confirmPasswordValidation = (refName) => {
  return Yup.string()
    .oneOf([Yup.ref(refName), null], "Passwords must match")
    .required("Confirm Password is required");
};
const phoneValidation = () => {
  return Yup.string()
    .matches(
      /^\+?[0-9]{10,15}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required");
};
export const commonValidations = {
  requiredString: requiredStringValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
  phone:phoneValidation
};

// export const validationSchemas = {
//   signIn: Yup.object().shape({
//     email: emailValidation(),
//     password: passwordValidation(),
//   }),
//   signUp: Yup.object().shape({
//     name: requiredStringValidation("Name"),
//     email: emailValidation(),
//     password: passwordValidation(),
//     confirmPassword: confirmPasswordValidation("password"), // ارجاع به فیلد 'password'
//   }),
//   resetPassword: Yup.object().shape({
//     newPassword: passwordValidation(),
//     confirmNewPassword: confirmPasswordValidation("newPassword"), // ارجاع به فیلد 'newPassword'
//   }),
//   updateProfile: Yup.object().shape({
//     name: requiredStringValidation("Name"),
//     email: emailValidation(),
//     phone: phoneValidation()
//   }),
// };

import { commonValidations as validations } from "../../../core/utils/validators/commonValidations";
import * as Yup from "yup";

export const signUpValidationSchema = Yup.object({
  firstname: validations.requiredString("First Name" , 3 , 50),
  lastname: validations.requiredString("Last Name" , 3 , 150),
  email: validations.email(),
  password: validations.password(8, "Please choose a stronger password"),
  confirmPassword: validations.confirmPassword("password"),
});

export const signInValidationSchema = Yup.object({
  email: validations.email(),
  password: validations.password(),
});

export const forgotPasswordSchema = Yup.object({
  email: validations.email(),
});

export const resetPasswordSchema = Yup.object({
  newPassword:validations.password(),
  confirmNewPassword: validations.confirmPassword("newPassword"),
})

export const updateProfileSchema = Yup.object({
  firstname: validations.requiredString("First Name" , 3 , 50),
  lastname: validations.requiredString("Last Name" , 3 , 150),
  phone:validations.phone()
})


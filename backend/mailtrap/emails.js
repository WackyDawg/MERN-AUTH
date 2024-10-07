import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationToken),
            category: "Email verification"
        })
        console.log("Verification email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`error sending verification email: ${error.message}`)
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "988a3996-1cea-4387-893f-a037be9a736b",
            template_variables: {
                "Company_info_name": "Auth System",
                "name": name,
            }
        });
        console.log("Welcome email sent successfully", response)
    } catch (error) {
        console.error(`Error sending welcome email: ${error.message}`)
        throw new Error(`Error sending welcome email: ${error.message}`)
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => { 
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset",
        })
        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.error(`Error sending password reset email: ${error.message} ${error.stack}`);
        throw new Error(`Error sending password reset email: ${ error }`);
    }
}

export const sendResetSuccessEmail = async (email) => { 
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email }],
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset",
        })
        console.log("Password reset success email sent successfully:", response);
    } catch (error) {
        console.error(`Error sending password reset email: ${ error } ${ error.stack }`);
        throw new Error(`Error sending password reset email: ${ error }`);
    }
}
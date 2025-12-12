
type changePasswordErrorType = {
    currentPassword?: string | null;
    newPassword?: string | null;
    passwordNotMatch?: string | null;
    serverError?: string | null;
    changePasswordSuccess?: string | null;

}
export function changePasswordValidation(
    { currentPasswordInput, newPasswordInput }:
        { currentPasswordInput: string, newPasswordInput: string }) {
    const error: changePasswordErrorType[] = []
    //check if current password has input
    if (!currentPasswordInput.trim()) error.push({ currentPassword: 'Current Password is Required' })
    //check if new password has input
    if (!newPasswordInput.trim()) error.push({ newPassword: 'New Password is Required' })


    
    if (newPasswordInput) {
        const pwd = newPasswordInput;
        //check if current and new password are match
        if (currentPasswordInput === newPasswordInput) error.push({ passwordNotMatch: 'New password cannot be the same as the current password' })
        //Minimum length
        if (pwd.length < 8) {
            error.push({ newPassword: "Password must be at least 8 characters" });
        }

        //Uppercase letter
        if (!/[A-Z]/.test(pwd)) {
            error.push({ newPassword: "Password must contain at least one uppercase letter" });
        }

        //Lowercase letter
        if (!/[a-z]/.test(pwd)) {
            error.push({ newPassword: "Password must contain at least one lowercase letter" });
        }

        //Number
        if (!/[0-9]/.test(pwd)) {
            error.push({ newPassword: "Password must contain at least one number" });
        }

        //No spaces
        if (/\s/.test(pwd)) {
            error.push({ newPassword: "Password cannot contain spaces" });
        }

        //Cannot match current password
        if (currentPasswordInput && pwd === currentPasswordInput) {
            error.push({ newPassword: "New password cannot be the same as current password" });
        }
    }

    return Object.keys(error).length ? error : null;


}
type alertNotificationType = {
    message: string;
    alertType: 'success' | 'error' | 'base' | 'warning';
}

export function resetPasswordValidation({ password }: { password: string }) {

    let alertNotification: alertNotificationType = { message: '', alertType: 'base' };
    let allWarningMessage: string[] = [];

    // Check if password is empty
    if (!password.trim()) allWarningMessage.push('Password is required!');

    // Check if confirmPassword is empty


    if (password) {
        const pwd = password;
        // Minimum length
        if (pwd.length < 8) allWarningMessage.push('Password must be at least 8 characters');

        // Uppercase letter
        if (!/[A-Z]/.test(pwd)) allWarningMessage.push('Password must contain at least one uppercase letter');

        // Lowercase letter
        if (!/[a-z]/.test(pwd)) allWarningMessage.push('Password must contain at least one lowercase letter');

        // Number
        if (!/[0-9]/.test(pwd)) allWarningMessage.push('Password must contain at least one number');

        // No spaces
        if (/\s/.test(pwd)) allWarningMessage.push('Password cannot contain spaces');
    }

    // Combine all warnings into a single message string
    if (allWarningMessage.length > 0) {
        alertNotification = {
            message: allWarningMessage.join('\n'), // each warning on a new line
            alertType: 'warning'
        };
    }

    return allWarningMessage.length > 0 ? alertNotification : null;
}

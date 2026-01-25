import { create } from 'zustand'

type AlertType = 'success' | 'error' | 'base' | 'warning';
type alertNotif = {
    display: boolean;
    message: string;
    alertType: AlertType;
}
type errorMessageDisplay = {
    display: boolean,
    title: string,
    message: string
}

type useAlertNotification = {
    alertNotif: alertNotif,
    setAlertNotif: ({ display, message, alertType }: alertNotif) => void,
    errorMessageDisplay: errorMessageDisplay,
    setErrorMessageDisplay: ({ display, title, message }: { display: boolean, title: string, message: string }) => void,
}

export const useAlertNotification = create<useAlertNotification>((set) => ({
    alertNotif: {
        display: false,
        message: '',
        alertType: 'base'
    },
    setAlertNotif: ({ display, message, alertType }: alertNotif) => {
        set({
            alertNotif: {
                display: display,
                message: message,
                alertType: alertType
            }
        });
        if (display) {
            setTimeout(() => {
                set({
                    alertNotif: {
                        display: false,
                        message: '',
                        alertType: 'base'
                    }
                })
            }, 4000);
        }
    },

    errorMessageDisplay: {
        display: false,
        title: '',
        message: ''
    },
    setErrorMessageDisplay: ({ display, title, message }: { display: boolean, title: string, message: string }) => {
        set({
            errorMessageDisplay: {
                display: display,
                title: title,
                message: message
            }
        })
    }

}))
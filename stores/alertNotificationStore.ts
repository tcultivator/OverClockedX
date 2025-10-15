import { create } from 'zustand'

type AlertType = 'success' | 'error' | 'base' | 'warning';
type alertNotif = {
    display: boolean;
    message: string;
    alertType: AlertType;
}

type useAlertNotification = {
    alertNotif: alertNotif,
    setAlertNotif: ({ display, message, alertType }: alertNotif) => void,
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
    }
}))
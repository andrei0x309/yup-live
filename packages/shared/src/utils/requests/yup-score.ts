export const isValidENS = (address: string, stackAlertWarning = () => { }) => {
    return address.endsWith(".eth");
};

export const getYupData = async ({
    address,
    stackAlertWarning = () => { },
    apiBase,
    mobile = false
}: {
    address: string;
    stackAlertWarning?: (message: string) => void;
    apiBase?: string;
        mobile?: boolean;
}) => {
    try {
        const req = await fetch(`${apiBase}/score?address=${address}`);

        if (req.ok) {
            const yupAccount = await req.json();
            if (!mobile) {
            history.pushState(
                {},
                `YUP LIVE - SCORE ${yupAccount.data.id}`,
                [window.location.origin, "score", yupAccount.data.id].join("/")
            );
            }
            return yupAccount;
        } else {
            const error = await req.json();
            if (error?.error) {
                stackAlertWarning(`Api returned error: ${error.error}`);
            }
            return {};
        }
    } catch {
        // ignore
    }
    return {};
};
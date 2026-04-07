export const generateRandomPassword = (length: number = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
};

export const setEndDate = (endDate : string) => {
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
      
    return d;
}

export const setStartDate = (startDate : string) => {
    const d = new Date(startDate);
    d.setHours(0, 0, 0, 0);
    return d;
}
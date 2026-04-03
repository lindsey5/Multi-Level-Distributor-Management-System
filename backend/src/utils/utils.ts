export const generateRandomPassword = (length: number = 12) => {
  const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
};
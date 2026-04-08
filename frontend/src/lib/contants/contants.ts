export const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    const y = currentYear - i;
    return { label: y.toString(), value: y.toString() };
});
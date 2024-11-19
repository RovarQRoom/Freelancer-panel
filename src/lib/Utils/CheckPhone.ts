import phone from "phone";

export function validateIraqiPhone(phoneNumber: string): { isValid: boolean; formattedNumber?: string } {
    const result = phone(phoneNumber, { country: 'IRQ' });

    if (!result.isValid) {
        const withPrefix = phone(`+964${phoneNumber.replace(/^0+/, '')}`, { country: 'IRQ' });
        if (withPrefix.isValid) {
            return { isValid: true, formattedNumber: withPrefix.phoneNumber };
        }
        return { isValid: false };
    }

    return { isValid: true, formattedNumber: result.phoneNumber };
}
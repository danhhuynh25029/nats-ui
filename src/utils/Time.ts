


export const FormatTimeString = (timeString: string): string => {
    // Use a regular expression to extract date and time components
    const match = timeString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d+/);

    if (!match) {
        throw new Error('Invalid time string format');
    }

    const [, year, month, day, hour, minute, second] = match;

    return `${day}/${month}/${year}:${hour}/${minute}/${second}`;
}
export const storage = {
    save: <T>(key: string, data: T) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load: <T>(key: string, defaultValue: T): T => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },
};
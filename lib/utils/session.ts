class Session {
    private storage: Storage | null = null;

    constructor() {
        // This check ensures that window is defined,
        // meaning the code is running in a browser.
        if (typeof window !== "undefined") {
            this.storage = window.sessionStorage;
        }
    }

    get(key: string): string | null {
        // Gracefully handle cases where storage is not available (e.g., on the server)
        if (this.storage) {
            return this.storage.getItem(key);
        }
        return null;
    }

    set(key: string, value: string): void {
        if (this.storage) {
            this.storage.setItem(key, value);
        }
    }

    remove(key: string): void {
        if (this.storage) {
            this.storage.removeItem(key);
        }
    }
}

const session = new Session();

export default session;
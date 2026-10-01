class LocalStorage {
    localStorage: Storage

    constructor(){
        this.localStorage = window.localStorage;
    }

    get(key: string) {
        return this.localStorage.getItem(key);
    }

    set(key: string, value: string) {
        return this.localStorage.setItem(key, value);
    }

    remove(key: string) {
        return this.localStorage.removeItem(key);
    }
}
const localStorage = new LocalStorage();

export default localStorage;
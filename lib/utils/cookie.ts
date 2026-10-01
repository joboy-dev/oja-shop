class Cookies {
    cookies: Record<string, string> = {};

    constructor() {
        if(document.cookie !== ""){
            const cookieArr = document.cookie.split("; ");
            cookieArr.forEach((pair: string, i) => {
                let pairs = pair.split("=");
                let key = pairs[0];
                let value = pairs[1];
                this.cookies[key] = value;
            });
        } else {
            this.cookies = {}
        }
    }

    getAll() {
        return this.cookies
    }

    get(key: string) {
        return this.cookies[key];
    }

    set(key: string, value: string) {
        return this.cookies[key] = value;
    }
}

const cookies = new Cookies();

export default cookies;
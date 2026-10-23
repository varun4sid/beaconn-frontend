export type Credentials = {
    rollno: string;
    password: string;
};

export class CookieJar {
    private cookies: Record<string, string> = {};

    setCookie(name: string, value: string) {
        this.cookies[name] = value;
    }

    getCookie(name: string): string | undefined {
        return this.cookies[name];
    }
}

export class HostelClient {
    rollno: string;
    password: string;
    cookies: CookieJar;
    userAgent: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

    constructor(rollno: string, password: string) {
        this.rollno = rollno;
        this.password = password;
        this.cookies = new CookieJar();
    }

    async createSession(indexUrl: string) {
        const response = await fetch(indexUrl, {
            method: 'GET',
            headers: {
                'User-Agent': this.userAgent,
            },
        });

        if (!response.ok) {
            throw new Error(`Hostel index page request failed with status: ${response.status}`);
        }

        const cookies = response.headers.get('Set-Cookie');
        if (cookies) {
            cookies.split(';').forEach(cookie => {
                const [name, value] = cookie.trim().split('=');
                this.cookies.setCookie(name, value);
            });
        }
    }

    async authenticateSession(loginUrl: string) {
        const payload = {
            "name": this.rollno,
            "password": this.password
        };

        const authResponse = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'credentials': 'include',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': this.userAgent,
                'Cookie': Object.entries(this.cookies).map(([name, value]) => `${name}=${value}`).join('; ')
            },
            body: new URLSearchParams(payload).toString(),
        });

        if (!authResponse.ok) {
            throw new Error(`Login failed with status: ${authResponse.status}`);
        }
    }

    async fetchUserData(userDataUrl: string) {
        const response = await fetch(userDataUrl, {
            method: 'GET',
            headers: {
                'User-Agent': this.userAgent,
                'Cookie': Object.entries(this.cookies).map(([name, value]) => `${name}=${value}`).join('; ')
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data with status: ${response.status}`);
        }

        const userData = await response.json();
        const username = userData[0]?.name;
        if (username) {
            localStorage.setItem('username', username);
        } else {
            console.error("Username not found in the response");
        }
    }
}
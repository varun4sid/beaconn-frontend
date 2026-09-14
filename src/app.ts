interface Credentials {
    rollno: string;
    password: string;
}

const STORAGE_KEY = 'edviewx_creds';
const EDVIEWX_BASE = 'https://edviewx.psgtech.ac.in';

const loginView = document.getElementById('login-view') as HTMLDivElement;
const dashboardView = document.getElementById('dashboard-view') as HTMLDivElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const qrImage = document.getElementById('qrcode-image') as HTMLImageElement;
const qrStatus = document.getElementById('qrcode-status') as HTMLParagraphElement;
const logoutButton = document.getElementById('logout') as HTMLButtonElement;

async function init() {
    const isCredentialsSaved = localStorage.getItem(STORAGE_KEY);
    if (isCredentialsSaved) {
        showView(dashboardView);
    } else {
        showView(loginView);
    }
}

function showView(view: HTMLDivElement) {
    loginView.classList.add('hidden');
    dashboardView.classList.add('hidden');
    view.classList.remove('hidden');
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rollno = (document.getElementById('rollno') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const credentials: Credentials = {
        rollno: rollno,
        password: password
    };

    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(credentials)));
    showView(dashboardView);
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    showView(loginView);
});

init();
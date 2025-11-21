const API = "http://localhost:5000/api";

/* ----------------------------------
   PART 1 — REGISTER
---------------------------------- */

const registerForm = document.querySelector("#registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#email").value;
        const phoneNumber = document.querySelector("#phone").value;
        const password = document.querySelector("#password").value;
        const role = document.querySelector("#role").value;
        const otpMethod = document.querySelector("input[name='otpMethod']:checked").value;

        const body = { email, phoneNumber, password, role, otpMethod };

        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("pendingUserId", data.userId);
            window.location.href = "verify-otp.html";
        } else {
            alert(data.message);
        }
    });
}

/* ----------------------------------
   PART 2 — VERIFY OTP
---------------------------------- */

const otpForm = document.querySelector("#otpForm");

if (otpForm) {
    otpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const otp = document.querySelector("#otp").value;
        const userId = localStorage.getItem("pendingUserId");

        const body = { userId, otp };

        const res = await fetch(`${API}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    });

    // resend OTP button
    const resendBtn = document.querySelector("#resendOtpBtn");

    if (resendBtn) {
        resendBtn.addEventListener("click", async () => {
            const userId = localStorage.getItem("pendingUserId");
            const otpMethod = "email"; // You can change this to dynamic later

            const res = await fetch(`${API}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otpMethod }),
            });

            const data = await res.json();
            alert(data.message);
        });
    }
}

/* ----------------------------------
   PART 3 — LOGIN
---------------------------------- */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#loginEmail").value;
        const password = document.querySelector("#loginPassword").value;
        const otpMethod = document.querySelector("input[name='loginOTP']:checked").value;

        const body = { email, password, otpMethod };

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("pendingUserId", data.userId);
            window.location.href = "verify-otp.html";
        } else {
            alert(data.message);
        }
    });
}

/* ----------------------------------
   PART 4 — DASHBOARD
---------------------------------- */

const userInfoBox = document.querySelector("#userInfo");

if (userInfoBox) {
    const token = localStorage.getItem("token");

    fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) {
                alert("Please log in");
                window.location.href = "login.html";
                return;
            }

            userInfoBox.innerHTML = `
                <p>Email: ${data.user.email}</p>
                <p>Role: ${data.user.role}</p>
            `;
        });

    // dashboard buttons
    const studentBtn = document.querySelector("#studentDashBtn");
    const teacherBtn = document.querySelector("#teacherDashBtn");
    const adminBtn = document.querySelector("#adminDashBtn");
    const responseBox = document.querySelector("#apiResponse");

    function fetchDashboard(route) {
        fetch(`${API}${route}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => {
                responseBox.textContent = JSON.stringify(data, null, 2);
            });
    }

    if (studentBtn) studentBtn.addEventListener("click", () => fetchDashboard("/student/dashboard"));
    if (teacherBtn) teacherBtn.addEventListener("click", () => fetchDashboard("/teacher/dashboard"));
    if (adminBtn) adminBtn.addEventListener("click", () => fetchDashboard("/admin/dashboard"));
}

/* ----------------------------------
   LOGOUT
---------------------------------- */

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

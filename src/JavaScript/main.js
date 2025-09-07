let currentPage = "home";
let activePageElement = null;
let isTransitioning = false;

function showPage(pageName, pushState = true) {
    if (isTransitioning) return;

    isTransitioning = true;

    const homeContent = document.getElementById("homeContent");
    const pages = document.querySelectorAll(".page");
    const bottomNav = document.getElementById("bottomNav");

    pages.forEach((page) => {
        page.classList.remove("active");
        setTimeout(() => {
            if (!page.classList.contains("active")) {
                page.style.display = "none";
            }
        }, 300);
    });

    homeContent.classList.add("hidden");

    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.style.display = "block";

        setTimeout(() => {
            targetPage.classList.add("active");
            activePageElement = targetPage;

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 50);
    } else {
        isTransitioning = false;
    }

    bottomNav.classList.remove("hide");
    bottomNav.classList.add("show");

    const overlay = document.getElementById("bottomNavOverlay");
    if (overlay) {
        overlay.classList.add("show");
    }

    updateNavActive(pageName);
    currentPage = pageName;

    window.scrollTo(0, 0);

    if (pushState) {
        history.pushState({ page: pageName }, "", `#${pageName}`);
    }
}

function showHome(pushState = true) {
    if (isTransitioning) return;

    isTransitioning = true;

    const homeContent = document.getElementById("homeContent");
    const pages = document.querySelectorAll(".page");
    const bottomNav = document.getElementById("bottomNav");

    pages.forEach((page) => {
        page.classList.remove("active");
        setTimeout(() => {
            if (!page.classList.contains("active")) {
                page.style.display = "none";
            }
        }, 300);
    });

    setTimeout(() => {
        homeContent.classList.remove("hidden");
        isTransitioning = false;
    }, 400);

    bottomNav.classList.remove("show");
    bottomNav.classList.add("hide");

    const overlay = document.getElementById("bottomNavOverlay");
    if (overlay) {
        overlay.classList.remove("show");
    }

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));
    if (navItems[0]) {
        navItems[0].classList.add("active");
    }

    activePageElement = null;
    currentPage = "home";

    window.scrollTo(0, 0);

    if (pushState) {
        history.pushState({ page: "home" }, "", "#home");
    }
}

function updateNavActive(pageName) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    const pageToNavMap = {
        home: 0,
        lectures: 1,
        summaries: 2,
        videos: 3,
        settings: 4,
    };

    const navIndex = pageToNavMap[pageName];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add("active");
    }
}

window.addEventListener("popstate", function (event) {
    const state = event.state;
    if (state && state.page) {
        if (state.page === "home") {
            showHome(false);
        } else {
            showPage(state.page, false);
        }
    } else {
        showHome(false);
    }
});

function createConfetti() {
    const colors = [
        "#FFD700",
        "#FF6B35",
        "#4CAF50",
        "#2196F3",
        "#9C27B0",
        "#FF9800",
        "#E91E63",
        "#00BCD4",
    ];
    const shapes = ["circle", "square", "triangle", "star"];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 12 + 8;

            confetti.className = `confetti confetti-${shape}`;
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = size + "px";
            confetti.style.height = size + "px";
            confetti.style.animationDelay = Math.random() * 2 + "s";
            confetti.style.animationDuration = Math.random() * 4 + 3 + "s";

            if (shape === "star") {
                confetti.style.backgroundColor = "#FFD700";
                confetti.style.boxShadow = "0 0 10px #FFD700";
            }

            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 6000);
        }, i * 15);
    }

    setTimeout(() => {
        createFloatingHearts();
    }, 500);
}

function createFloatingHearts() {
    const hearts = ["💕", "💗", "💓", "💝", "💘"];
    const heartCount = 20;

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.className = "floating-heart";
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDelay = Math.random() * 3 + "s";
            heart.style.fontSize = Math.random() * 20 + 20 + "px";

            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }, i * 100);
    }
}

let currentToast = null;
let toastTimeout = null;

function showCelebrationToast() {
    notifications.success(
        "  مبرووووووووووووووووك! 🎉 اكتشفت أحد الأسرار المخفية داخل التطبيق 👀",
        5000
    );
}

function showWelcomeBackToast() {
    notifications.info(
        "رجع كل شيء لطبيعته ✅.\n متقلش لحد عن السر دا! 🤫",
        3000
    );
}

function dismissCurrentToast() {
    if (currentToast) {
        currentToast.hideToast();
        currentToast = null;
        clearTimeout(toastTimeout);
    }
}

function updateGreeting(username) {
    const greetingText = document.getElementById("greetingText");
    if (greetingText) {
        greetingText.textContent = `مرحباً ${username}`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const savedUsername = localStorage.getItem("username");
    const usernameModal = document.getElementById("usernameModal");
    const usernameInput = document.getElementById("usernameInput");
    const saveUsernameBtn = document.getElementById("saveUsernameBtn");
    const usernameError = document.getElementById("usernameError");
    const greetingText = document.getElementById("greetingText");

    if (!savedUsername) {
        usernameModal.classList.add("show");
    } else {
        updateGreeting(savedUsername);
    }

    saveUsernameBtn.addEventListener("click", function () {
        const username = usernameInput.value.trim();

        if (username.length < 2) {
            notifications.error("يجب أن يكون الاسم على الأقل حرفين");
            return;
        }

        if (username.length > 20) {
            notifications.error("يجب ألا يزيد الاسم عن 20 حرف");
            return;
        }

        localStorage.setItem("username", username);

        updateGreeting(username);

        usernameModal.classList.remove("show");

        usernameError.classList.remove("show");
    });

    usernameInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            saveUsernameBtn.click();
        }
    });

    usernameInput.addEventListener("input", function () {
        usernameError.classList.remove("show");
    });

    const savedImageOnlyState = localStorage.getItem("headerImageOnly");
    if (savedImageOnlyState === "true") {
        const header = document.querySelector(".header");
        if (header) {
            header.classList.add("image-only");
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && currentPage !== "home") {
            showHome();
        }
    });

    history.replaceState({ page: "home" }, "", "#home");

    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.style.display = "none";
        page.classList.remove("active");
    });

    showHome(false);

    const focusableElements = document.querySelectorAll(
        ".grid-item, .nav-item, .header-settings-icon, .page-header-bar .back-button"
    );
    focusableElements.forEach((element) => {
        element.setAttribute("tabindex", "0");
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                element.click();
            }
        });
    });

    document.querySelectorAll(".grid-item").forEach((item) => {
        item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            item.style.setProperty("--mouse-x", `${x}%`);
            item.style.setProperty("--mouse-y", `${y}%`);
        });
    });

    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            let targetPage = "";
            if (item.classList.contains("lectures")) {
                targetPage = "lectures";
            } else if (item.classList.contains("summaries")) {
                targetPage = "summaries";
            } else if (item.classList.contains("videos")) {
                targetPage = "videos";
            } else if (item.classList.contains("schedules")) {
                targetPage = "schedules";
            } else if (item.classList.contains("buildings")) {
                targetPage = "buildings";
            } else if (item.classList.contains("statistics")) {
                targetPage = "statistics";
            } else if (item.classList.contains("links")) {
                targetPage = "links";
            }

            if (targetPage) {
                showPage(targetPage);
            }
        });
    });

    const settingsIcon = document.querySelector(".header-settings-icon");
    if (settingsIcon) {
        settingsIcon.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            showPage("settings");
        });
    }

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item, index) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

    const navPages = [
        "home",
        "lectures",
        "summaries",
        "videos",
        "settings",
    ];
            const targetPage = navPages[index];

            if (targetPage === "home") {
                showHome();
            } else {
                showPage(targetPage);
            }

            setTimeout(() => {
                if (document.activeElement === item) {
                    item.blur();
                }
            }, 3000);
        });
    });

    const backButtons = document.querySelectorAll(
        ".page-header-bar .back-button"
    );
    backButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            showHome();
        });
    });

    const header = document.querySelector(".header");
    if (header) {
        let clickCount = 0;
        let clickTimer;

        header.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;

                const isImageOnly = header.classList.toggle("image-only");

                localStorage.setItem("headerImageOnly", isImageOnly);

                if (isImageOnly) {
                    createConfetti();

                    showCelebrationToast();
                } else {
                    showWelcomeBackToast();
                }
            }
        });
    }
});
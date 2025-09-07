document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.querySelectorAll('.theme-option');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selectedTheme = this.classList.contains('dark') ? 'dark' : 'light';
            setTheme(selectedTheme);
        });
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        document.body.classList.add('theme-transitioning');

        if (themeToggle) {
            themeToggle.classList.toggle('active', theme === 'light');
        }

        themeOptions.forEach(option => {
            option.classList.toggle('selected', option.classList.contains(theme));
        });

        if (theme === 'light') {
            document.documentElement.style.setProperty('--primary', '#e0e0e0');
            document.documentElement.style.setProperty('--secondary', '#c0c0c0');
            document.documentElement.style.setProperty('--accent', '#a0a0a0');
            document.documentElement.style.setProperty('--dark', '#ffffff');
            document.documentElement.style.setProperty('--darker', '#f8f9fa');
            document.documentElement.style.setProperty('--light', '#212529');
            document.documentElement.style.setProperty('--card-bg', '#f8f9fa');
            document.documentElement.style.setProperty('--border', '#dee2e6');
            document.documentElement.style.setProperty('--text-primary', '#212529');
            document.documentElement.style.setProperty('--text-secondary', '#6c757d');
            document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
            document.documentElement.style.setProperty('--shadow-strong', 'rgba(0, 0, 0, 0.15)');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(248, 249, 250, 0.9)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(222, 226, 230, 0.8)');
            document.documentElement.style.setProperty('--backdrop-blur', '15px');
            document.documentElement.style.setProperty('--glass-hover-bg', 'rgba(230, 230, 230, 0.8)');
            document.documentElement.style.setProperty('--glass-hover-border', 'rgba(200, 200, 200, 0.9)');
            document.documentElement.style.setProperty('--blue-primary', '#007bff');
            document.documentElement.style.setProperty('--blue-accent', '#0056b3');
            document.documentElement.style.setProperty('--blue-light', '#e7f3ff');
            document.documentElement.style.setProperty('--blue-glass-bg', 'rgba(0, 123, 255, 0.1)');
            document.documentElement.style.setProperty('--blue-glass-border', 'rgba(0, 123, 255, 0.3)');
            document.documentElement.style.setProperty('--blue-shadow', 'rgba(0, 123, 255, 0.15)');
            document.documentElement.style.setProperty('--header-filter', 'brightness(0.9) contrast(1.1)');
            document.documentElement.style.setProperty('--image-filter', 'brightness(0.95) contrast(1.05) saturate(1.1)');
        } else {
            document.documentElement.style.setProperty('--primary', '#404040');
            document.documentElement.style.setProperty('--secondary', '#606060');
            document.documentElement.style.setProperty('--accent', '#808080');
            document.documentElement.style.setProperty('--dark', '#1a1a1a');
            document.documentElement.style.setProperty('--darker', '#0d0d0d');
            document.documentElement.style.setProperty('--light', '#e0e0e0');
            document.documentElement.style.setProperty('--card-bg', '#2d2d2d');
            document.documentElement.style.setProperty('--border', '#404040');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
            document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
            document.documentElement.style.setProperty('--shadow-strong', 'rgba(0, 0, 0, 0.5)');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(45, 45, 45, 0.6)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(64, 64, 64, 0.8)');
            document.documentElement.style.setProperty('--backdrop-blur', '12px');
            document.documentElement.style.setProperty('--glass-hover-bg', 'rgba(60, 60, 60, 0.8)');
            document.documentElement.style.setProperty('--glass-hover-border', 'rgba(80, 80, 80, 0.9)');
            document.documentElement.style.setProperty('--blue-primary', '#007bff');
            document.documentElement.style.setProperty('--blue-accent', '#0056b3');
            document.documentElement.style.setProperty('--blue-light', '#e0f2ff');
            document.documentElement.style.setProperty('--blue-glass-bg', 'rgba(0, 123, 255, 0.1)');
            document.documentElement.style.setProperty('--blue-glass-border', 'rgba(0, 123, 255, 0.3)');
            document.documentElement.style.setProperty('--blue-shadow', 'rgba(0, 123, 255, 0.2)');
            document.documentElement.style.setProperty('--header-filter', 'brightness(0.6) blur(2px)');
            document.documentElement.style.setProperty('--image-filter', 'brightness(0.7) contrast(1.2) saturate(0.9)');
        }

        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const savedLanguage = localStorage.getItem('language') || 'ar';
        languageSelect.value = savedLanguage;

        languageSelect.addEventListener('change', function () {
            localStorage.setItem('language', this.value);
            notifications.info('تم حفظ اللغة: ' + this.value);
        });
    }

    const notificationToggle = document.getElementById('notificationToggle');
    if (notificationToggle) {
        const savedNotifications = localStorage.getItem('notifications') === 'true';
        notificationToggle.classList.toggle('active', savedNotifications);

        notificationToggle.addEventListener('click', function () {
            const isActive = this.classList.contains('active');
            this.classList.toggle('active', !isActive);
            localStorage.setItem('notifications', !isActive);
        });
    }

    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        const savedSound = localStorage.getItem('sound') !== 'false';
        soundToggle.classList.toggle('active', savedSound);

        soundToggle.addEventListener('click', function () {
            const isActive = this.classList.contains('active');
            this.classList.toggle('active', !isActive);
            localStorage.setItem('sound', !isActive);
        });
    }

    const clearDataButton =
document.getElementById('clearDataButton').addEventListener('click', function () {
    Swal.fire({
        title: 'إعادة الإعدادات',
        text: 'هل تريد إعادة الإعدادات إلى الوضع الافتراضي؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا',
        reverseButtons: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.reload();
        }
    });
});


    const exportSettingsButton = document.getElementById('exportSettingsButton');
    if (exportSettingsButton) {
        exportSettingsButton.addEventListener('click', function () {
            const settings = {
                theme: localStorage.getItem('theme') || 'dark',
                language: localStorage.getItem('language') || 'ar',
                notifications: localStorage.getItem('notifications') === 'true',
                sound: localStorage.getItem('sound') !== 'false'
            };

            const dataStr = JSON.stringify(settings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'settings.json';
            link.click();

            notifications.success('تم تصدير الإعدادات بنجاح');
        });
    }

    const changeUsernameBtn = document.getElementById('changeUsernameBtn');
    const changeUsernameModal = document.getElementById('changeUsernameModal');
    const newUsernameInput = document.getElementById('newUsernameInput');
    const saveNewUsernameBtn = document.getElementById('saveNewUsernameBtn');
    const cancelChangeUsernameBtn = document.getElementById('cancelChangeUsernameBtn');
    const changeUsernameError = document.getElementById('changeUsernameError');

    if (changeUsernameBtn && changeUsernameModal && newUsernameInput && saveNewUsernameBtn && cancelChangeUsernameBtn && changeUsernameError) {
        let currentUsername = localStorage.getItem('username') || '';

        changeUsernameBtn.addEventListener('click', function () {
            newUsernameInput.value = '';
            changeUsernameError.classList.remove('show');
            changeUsernameModal.classList.add('show');
        });

        saveNewUsernameBtn.addEventListener('click', function () {
            const newUsername = newUsernameInput.value.trim();

            if (newUsername.length < 2) {
                changeUsernameError.textContent = "يجب أن يكون الاسم على الأقل حرفين";
                changeUsernameError.classList.add('show');
                return;
            }

            if (newUsername.length > 20) {
                changeUsernameError.textContent = "يجب ألا يزيد الاسم عن 20 حرف";
                changeUsernameError.classList.add('show');
                return;
            }

            if (newUsername === currentUsername) {
                changeUsernameError.textContent = "الاسم نفسه، يرجى إدخال اسم مختلف";
                changeUsernameError.classList.add('show');
                return;
            }

            localStorage.setItem('username', newUsername);
            currentUsername = newUsername;

            const greetingText = document.getElementById('greetingText');
            if (greetingText) {
                greetingText.textContent = `مرحباً ${newUsername}`;
            }

            changeUsernameModal.classList.remove('show');

            notifications.success(`تم تغيير الاسم بنجاح إلى: ${newUsername}`);
        });

        cancelChangeUsernameBtn.addEventListener('click', function () {
            changeUsernameModal.classList.remove('show');
        });

        newUsernameInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                saveNewUsernameBtn.click();
            }
        });

        newUsernameInput.addEventListener('input', function () {
            changeUsernameError.classList.remove('show');
        });
    }
});
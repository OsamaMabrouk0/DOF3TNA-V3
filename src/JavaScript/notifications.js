class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = null, options = {}) {
        const notification = this.createNotification(message, type, duration || this.defaultDuration, options);
        this.addNotification(notification);
        return notification.id;
    }

    createNotification(message, type, duration, options) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const iconMap = {
            success: 'fas fa-check',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <button class="notification-close" aria-label="إغلاق الإشعار">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-content">
                <p class="notification-message">${this.escapeHtml(message)}</p>
            </div>
            <div class="notification-icon">
                <i class="${iconMap[type] || iconMap.info}"></i>
            </div>
            ${options.showProgress !== false ? '<div class="notification-progress"><div class="notification-progress-bar"></div></div>' : ''}
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(notification.id));

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    this.remove(notification.id);
                }
            }, duration);

            const progressBar = notification.querySelector('.notification-progress-bar');
            if (progressBar) {
                progressBar.style.transition = `width ${duration}ms linear`;
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 100);
            }
        }

        return {
            element: notification,
            id: notification.id,
            type,
            message,
            duration,
            timestamp: Date.now()
        };
    }

    addNotification(notification) {
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.removeElement(oldest.element);
        }

        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        setTimeout(() => {
            notification.element.classList.add('show');
        }, 10);
    }

    remove(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.element.classList.add('hide');
            setTimeout(() => {
                this.removeElement(notification.element);
                this.notifications = this.notifications.filter(n => n.id !== notificationId);
            }, 300);
        }
    }

    removeElement(element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    clear() {
        this.notifications.forEach(notification => {
            this.removeElement(notification.element);
        });
        this.notifications = [];
    }

    success(message, duration, options) {
        return this.show(message, 'success', duration, options);
    }

    error(message, duration, options) {
        return this.show(message, 'error', duration, options);
    }

    warning(message, duration, options) {
        return this.show(message, 'warning', duration, options);
    }

    info(message, duration, options) {
        return this.show(message, 'info', duration, options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    get count() {
        return this.notifications.length;
    }

    get enabled() {
        return localStorage.getItem('notificationsEnabled') !== 'false';
    }

    set enabled(value) {
        localStorage.setItem('notificationsEnabled', value);
    }
}

const notifications = new NotificationSystem();

window.NotificationSystem = NotificationSystem;
window.notifications = notifications;
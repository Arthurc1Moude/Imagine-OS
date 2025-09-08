// ImagineOS Aismira - InfinityUI JavaScript
class ImagineOS {
    constructor() {
        this.currentLanguage = 'en';
        this.isZoeyListening = false;
        this.recognition = null;
        this.synthesis = null;
        this.apps = new Map();
        this.notifications = [];
        this.notificationCount = 0;
        this.unreadMessages = 0;
        this.systemAlerts = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTime();
        this.initializeSpeech();
        this.initializeApps();
        this.initializeNotifications();
        this.startBackgroundAnimations();
        this.initializeSettings();
        console.log('🚀 ImagineOS Aismira initialized successfully!');
    }

    initializeSettings() {
        // 加载设置
        if (typeof settingsApp !== 'undefined') {
            settingsApp.loadSettings();
        }
    }

    setupEventListeners() {
        // 桌面图标点击事件
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.openApp(app);
            });
        });

        // Zoey AI 悬浮球事件
        document.getElementById('zoey-orb').addEventListener('click', () => {
            this.openModal('zoey-modal');
        });

        // Zoey AI 相关事件
        document.getElementById('voice-btn').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.getElementById('close-zoey').addEventListener('click', () => {
            this.closeModal('zoey-modal');
        });

        // 底部导航按钮事件
        document.getElementById('home-btn').addEventListener('click', () => {
            this.showDesktop();
        });

        document.getElementById('apps-btn').addEventListener('click', () => {
            this.showAllApps();
        });

        document.getElementById('recent-btn').addEventListener('click', () => {
            this.showRecentApps();
        });

        document.getElementById('notifications-btn').addEventListener('click', () => {
            this.showNotifications();
        });

        document.getElementById('user-btn').addEventListener('click', () => {
            this.showUserProfile();
        });

        // 语言选择器
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // 全局搜索
        document.getElementById('global-search').addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // 系统控制按钮
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSystemControl(e.currentTarget.id);
            });
        });

        // 模态框背景点击关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    initializeTime() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        };
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        document.getElementById('current-time').textContent = 
            now.toLocaleTimeString(this.currentLanguage, timeOptions);
        document.getElementById('current-date').textContent = 
            now.toLocaleDateString(this.currentLanguage, dateOptions);
    }

    initializeSpeech() {
        // 语音识别初始化
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage;

            this.recognition.onstart = () => {
                this.isZoeyListening = true;
                this.updateVoiceIndicator(true);
                this.updateVoiceButton(true);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
                this.sendMessage();
            };

            this.recognition.onend = () => {
                this.isZoeyListening = false;
                this.updateVoiceIndicator(false);
                this.updateVoiceButton(false);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showNotification('Voice Recognition Error', 'Please try again or check your microphone permissions.');
            };
        }

        // 语音合成初始化
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    initializeApps() {
        // 应用定义
        this.apps.set('files', {
            name: 'File Manager',
            icon: 'fas fa-folder',
            component: 'files-window'
        });

        this.apps.set('settings', {
            name: 'System Settings',
            icon: 'fas fa-cog',
            component: 'settings-window'
        });

        this.apps.set('browser', {
            name: 'Infinity Browser',
            icon: 'fas fa-globe',
            component: 'browser-window'
        });

        this.apps.set('music', {
            name: 'Music Player',
            icon: 'fas fa-music',
            component: 'music-window'
        });

        this.apps.set('camera', {
            name: 'Camera',
            icon: 'fas fa-camera',
            component: 'camera-window'
        });

        this.apps.set('gallery', {
            name: 'Gallery',
            icon: 'fas fa-images',
            component: 'gallery-window'
        });

        this.apps.set('calculator', {
            name: 'Calculator',
            icon: 'fas fa-calculator',
            component: 'calculator-window'
        });

        this.apps.set('notes', {
            name: 'Notes',
            icon: 'fas fa-sticky-note',
            component: 'notes-window'
        });

        this.apps.set('calendar', {
            name: 'Calendar',
            icon: 'fas fa-calendar-alt',
            component: 'calendar-window'
        });

        this.apps.set('weather', {
            name: 'Weather',
            icon: 'fas fa-cloud-sun',
            component: 'weather-window'
        });

        this.apps.set('mail', {
            name: 'Mail',
            icon: 'fas fa-envelope',
            component: 'mail-window'
        });

        this.apps.set('maps', {
            name: 'Maps',
            icon: 'fas fa-map-marked-alt',
            component: 'maps-window'
        });
    }

    initializeNotifications() {
        // 初始化通知系统
        this.updateNotificationBadge();
        
        // 模拟一些初始通知
        setTimeout(() => {
            this.addNotification('Welcome to ImagineOS', 'Your AI-powered operating system is ready!', 'success');
        }, 2000);

        setTimeout(() => {
            this.addNotification('Zoey AI Ready', 'Your voice assistant is online and ready to help.', 'info');
        }, 4000);

        setTimeout(() => {
            this.addNotification('System Update', 'All systems are up to date and running smoothly.', 'info');
        }, 6000);

        // 模拟邮件通知
        setTimeout(() => {
            this.addNotification('New Email', 'You have 3 new messages in your inbox.', 'info');
            this.unreadMessages = 3;
            this.updateNotificationBadge();
        }, 8000);

        // 模拟系统警告
        setTimeout(() => {
            this.addNotification('Low Battery', 'Battery level is below 20%.', 'warning');
            this.systemAlerts = 1;
            this.updateNotificationBadge();
        }, 10000);
    }

    startBackgroundAnimations() {
        // 动态背景效果
        this.createFloatingElements();
        this.animateGradientOrbs();
    }

    createFloatingElements() {
        const container = document.querySelector('.particle-system');
        
        setInterval(() => {
            const element = document.createElement('div');
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUp ${Math.random() * 10 + 10}s linear forwards;
                pointer-events: none;
            `;
            
            container.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 20000);
        }, 1000);
    }

    animateGradientOrbs() {
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                const randomScale = Math.random() * 0.5 + 0.8;
                
                orb.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
            }, 3000 + index * 1000);
        });
    }

    openApp(appName) {
        const app = this.apps.get(appName);
        if (!app) return;

        this.createAppWindow(app);

        // 添加点击动画效果
        const icon = document.querySelector(`[data-app="${appName}"]`);
        icon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            icon.style.transform = '';
        }, 150);
    }

    createAppWindow(app) {
        const windowId = `window-${Date.now()}`;
        const appWindow = document.createElement('div');
        appWindow.className = 'app-window';
        appWindow.id = windowId;
        appWindow.style.cssText = `
            top: ${Math.random() * 200 + 100}px;
            left: ${Math.random() * 300 + 100}px;
            width: 600px;
            height: 400px;
        `;

        appWindow.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${app.icon}"></i>
                    ${app.name}
                </div>
                <div class="window-controls">
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                    <div class="window-control close" onclick="imagineOS.closeWindow('${windowId}')"></div>
                </div>
            </div>
            <div class="window-content">
                ${this.getAppContent(appName)}
            </div>
        `;

        document.getElementById('app-windows').appendChild(appWindow);
        this.makeWindowDraggable(appWindow);
    }

    getAppContent(appName) {
        // 使用独立的应用类
        switch (appName) {
            case 'files':
                return filesApp.getContent();
            case 'settings':
                return settingsApp.getContent();
            case 'calculator':
                return calcApp.getContent();
            case 'browser':
                return browserApp.getContent();
            case 'music':
                return musicApp.getContent();
            case 'notes':
                return notesApp.getContent();
            default:
                return this.getDefaultAppContent(appName);
        }
    }

    getDefaultAppContent(appName) {
        const contentMap = {
            'apps-launcher': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary);">All Applications</h3>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px;">
                            <div class="app-launcher-item" onclick="imagineOS.openApp('files')">
                                <div class="app-icon" style="background: var(--gradient-1);"><i class="fas fa-folder"></i></div>
                                <span>Files</span>
                            </div>
                            <div class="app-launcher-item" onclick="imagineOS.openApp('settings')">
                                <div class="app-icon" style="background: var(--gradient-2);"><i class="fas fa-cog"></i></div>
                                <span>Settings</span>
                            </div>
                            <div class="app-launcher-item" onclick="imagineOS.openApp('browser')">
                                <div class="app-icon" style="background: var(--gradient-3);"><i class="fas fa-globe"></i></div>
                                <span>Browser</span>
                            </div>
                            <div class="app-launcher-item" onclick="imagineOS.openApp('music')">
                                <div class="app-icon" style="background: var(--gradient-4);"><i class="fas fa-music"></i></div>
                                <span>Music</span>
                            </div>
                            <div class="app-launcher-item" onclick="imagineOS.openApp('notes')">
                                <div class="app-icon" style="background: var(--gradient-5);"><i class="fas fa-sticky-note"></i></div>
                                <span>Notes</span>
                            </div>
                            <div class="app-launcher-item" onclick="imagineOS.openApp('calculator')">
                                <div class="app-icon" style="background: var(--gradient-1);"><i class="fas fa-calculator"></i></div>
                                <span>Calculator</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'recent-apps': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary);">Recent Applications</h3>
                    </div>
                    <div style="flex: 1; padding: 20px;">
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div class="recent-app-item" onclick="imagineOS.openApp('files')">
                                <div class="recent-app-icon" style="background: var(--gradient-1);"><i class="fas fa-folder"></i></div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary);">Files</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Last used 2 minutes ago</div>
                                </div>
                            </div>
                            <div class="recent-app-item" onclick="imagineOS.openApp('browser')">
                                <div class="recent-app-icon" style="background: var(--gradient-3);"><i class="fas fa-globe"></i></div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary);">Browser</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Last used 5 minutes ago</div>
                                </div>
                            </div>
                            <div class="recent-app-item" onclick="imagineOS.openApp('notes')">
                                <div class="recent-app-icon" style="background: var(--gradient-5);"><i class="fas fa-sticky-note"></i></div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary);">Notes</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Last used 1 hour ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'user-profile': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                        <h3 style="margin-bottom: 20px; color: var(--text-primary);">User Profile</h3>
                    </div>
                    <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 120px; height: 120px; border-radius: 50%; background: var(--gradient-2); display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; margin-bottom: 20px;">
                            <i class="fas fa-user"></i>
                        </div>
                        <h2 style="color: var(--text-primary); margin-bottom: 8px;">ImagineOS User</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 30px;">Welcome to your personalized experience</p>
                        <div style="width: 100%; max-width: 400px;">
                            <div class="profile-item">
                                <span>Username</span>
                                <span>imagineos_user</span>
                            </div>
                            <div class="profile-item">
                                <span>Email</span>
                                <span>user@imagineos.com</span>
                            </div>
                            <div class="profile-item">
                                <span>Member Since</span>
                                <span>September 2024</span>
                            </div>
                            <div class="profile-item">
                                <span>Theme</span>
                                <span>Liquid Glass</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'settings': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                        <h3 style="margin-bottom: 20px;">System Settings</h3>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <div class="settings-section">
                            <h4 style="color: var(--dynamic-blue); margin-bottom: 12px;">Appearance</h4>
                            <div class="setting-item">
                                <span>Dark Mode</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Liquid Glass Effects</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Animations</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4 style="color: var(--dynamic-green); margin-bottom: 12px;">System</h4>
                            <div class="setting-item">
                                <span>Auto Updates</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Background Sync</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Performance Mode</span>
                                <label class="toggle-switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4 style="color: var(--dynamic-purple); margin-bottom: 12px;">AI Assistant</h4>
                            <div class="setting-item">
                                <span>Zoey Voice Assistant</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Voice Recognition</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Smart Suggestions</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4 style="color: var(--dynamic-pink); margin-bottom: 12px;">Notifications</h4>
                            <div class="setting-item">
                                <span>System Notifications</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Sound Effects</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <span>Do Not Disturb</span>
                                <label class="toggle-switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'browser': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid var(--border-glass);">
                        <button class="control-btn"><i class="fas fa-arrow-left"></i></button>
                        <button class="control-btn"><i class="fas fa-arrow-right"></i></button>
                        <button class="control-btn"><i class="fas fa-refresh"></i></button>
                        <input type="text" placeholder="Search or enter URL..." style="flex: 1; padding: 8px; border: 1px solid var(--border-glass); border-radius: 8px; background: var(--secondary-glass); color: var(--text-primary);">
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: var(--secondary-glass);">
                        <div style="text-align: center;">
                            <i class="fas fa-globe" style="font-size: 48px; color: var(--dynamic-blue); margin-bottom: 16px;"></i>
                            <h3>Infinity Browser</h3>
                            <p>Your gateway to the infinite web</p>
                        </div>
                    </div>
                </div>
            `,
            'music': `
                <div style="text-align: center; padding: 40px;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; background: var(--gradient-2); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white;">
                        <i class="fas fa-music"></i>
                    </div>
                    <h3>Now Playing</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">ImagineOS Theme Song</p>
                    <div style="display: flex; justify-content: center; gap: 16px;">
                        <button class="control-btn"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn" style="width: 50px; height: 50px; border-radius: 50%;"><i class="fas fa-play"></i></button>
                        <button class="control-btn"><i class="fas fa-step-forward"></i></button>
                    </div>
                </div>
            `,
            'camera': `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="flex: 1; background: var(--secondary-glass); display: flex; align-items: center; justify-content: center;">
                        <div style="text-align: center;">
                            <i class="fas fa-camera" style="font-size: 48px; color: var(--dynamic-blue); margin-bottom: 16px;"></i>
                            <h3>Camera</h3>
                            <p>Capture your moments</p>
                        </div>
                    </div>
                    <div style="padding: 16px; display: flex; justify-content: center; gap: 16px;">
                        <button class="control-btn"><i class="fas fa-image"></i></button>
                        <button class="control-btn" style="width: 60px; height: 60px; border-radius: 50%; background: var(--gradient-1);"><i class="fas fa-camera"></i></button>
                        <button class="control-btn"><i class="fas fa-video"></i></button>
                    </div>
                </div>
            `,
            'gallery': `
                <div style="padding: 20px;">
                    <h3 style="margin-bottom: 20px;">Gallery</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        ${Array.from({length: 9}, (_, i) => `
                            <div style="aspect-ratio: 1; background: var(--gradient-${(i % 5) + 1}); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                <i class="fas fa-image"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            'calculator': `
                <div style="padding: 20px;">
                    <div style="background: var(--secondary-glass); border: 1px solid var(--border-glass); border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: right; font-size: 24px; font-weight: 600;">
                        0
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                        <button class="control-btn">C</button>
                        <button class="control-btn">±</button>
                        <button class="control-btn">%</button>
                        <button class="control-btn" style="background: var(--gradient-1);">÷</button>
                        <button class="control-btn">7</button>
                        <button class="control-btn">8</button>
                        <button class="control-btn">9</button>
                        <button class="control-btn" style="background: var(--gradient-1);">×</button>
                        <button class="control-btn">4</button>
                        <button class="control-btn">5</button>
                        <button class="control-btn">6</button>
                        <button class="control-btn" style="background: var(--gradient-1);">-</button>
                        <button class="control-btn">1</button>
                        <button class="control-btn">2</button>
                        <button class="control-btn">3</button>
                        <button class="control-btn" style="background: var(--gradient-1);">+</button>
                        <button class="control-btn" style="grid-column: span 2;">0</button>
                        <button class="control-btn">.</button>
                        <button class="control-btn" style="background: var(--gradient-1);">=</button>
                    </div>
                </div>
            `
        };

        return contentMap[appName] || '<div style="text-align: center; padding: 40px;"><i class="fas fa-cog fa-spin" style="font-size: 48px; color: var(--dynamic-blue); margin-bottom: 16px;"></i><h3>Application Loading...</h3><p>This app is being prepared for you</p></div>';
    }

    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    closeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (window) {
            window.style.animation = 'windowSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                window.remove();
            }, 300);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showNotification('Voice Recognition Unavailable', 'Your browser does not support speech recognition.');
            return;
        }

        if (this.isZoeyListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceIndicator(isActive) {
        const indicator = document.getElementById('voice-indicator');
        if (isActive) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }

    updateVoiceButton(isRecording) {
        const button = document.getElementById('voice-btn');
        if (isRecording) {
            button.classList.add('recording');
        } else {
            button.classList.remove('recording');
        }
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        // 添加用户消息
        this.addChatMessage(message, 'user');
        input.value = '';

        // 模拟Zoey回复
        setTimeout(() => {
            const response = this.generateZoeyResponse(message);
            this.addChatMessage(response, 'zoey');
            this.speakText(response);
        }, 1000);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = sender === 'zoey' ? 'fas fa-robot' : 'fas fa-user';
        const avatarBg = sender === 'zoey' ? 'var(--gradient-3)' : 'var(--gradient-1)';

        messageDiv.innerHTML = `
            <div class="message-avatar" style="background: ${avatarBg};">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateZoeyResponse(userMessage) {
        const responses = [
            "That's a great question! Let me help you with that.",
            "I understand what you're looking for. Here's what I can do for you.",
            "Interesting! I have some suggestions that might help.",
            "I'm here to assist you with that. Let me provide some information.",
            "That sounds exciting! I can definitely help you with that.",
            "I'm processing your request. Here's what I found for you.",
            "Great idea! I have some recommendations for you.",
            "I'm always happy to help! Here's what I can suggest.",
            "That's something I can definitely assist you with!",
            "I love helping with questions like this. Here's my response."
        ];

        // 简单的关键词匹配
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm Zoey, your AI assistant. How can I help you today?";
        } else if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()} and today is ${now.toLocaleDateString()}.`;
        } else if (lowerMessage.includes('weather')) {
            return "I'd love to help with weather information! However, I need to connect to a weather service for real-time data.";
        } else if (lowerMessage.includes('music')) {
            return "I can help you with music! You can open the Music Player app or ask me to play specific songs.";
        } else if (lowerMessage.includes('file') || lowerMessage.includes('folder')) {
            return "I can help you manage files! Open the File Manager app or ask me to help organize your documents.";
        } else {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    speakText(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.currentLanguage;
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            this.synthesis.speak(utterance);
        }
    }

    changeLanguage(langCode) {
        this.currentLanguage = langCode;
        if (this.recognition) {
            this.recognition.lang = langCode;
        }
        this.updateTime();
        this.showNotification('Language Changed', `System language changed to ${this.getLanguageName(langCode)}`);
    }

    getLanguageName(langCode) {
        const languages = {
            'en': 'English',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'fr': 'Français',
            'de': 'Deutsch',
            'es': 'Español',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Русский',
            'ar': 'العربية',
            'hi': 'हिन्दी'
        };
        return languages[langCode] || 'English';
    }

    performSearch(query) {
        if (query.length < 2) return;
        
        // 模拟搜索功能
        console.log(`Searching for: ${query}`);
        // 这里可以添加实际的搜索逻辑
    }

    handleSystemControl(controlId) {
        const controls = {
            'wifi-btn': () => this.showNotification('WiFi', 'WiFi settings opened'),
            'bluetooth-btn': () => this.showNotification('Bluetooth', 'Bluetooth settings opened'),
            'volume-btn': () => this.showNotification('Volume', 'Volume control opened'),
            'battery-btn': () => this.showNotification('Battery', 'Battery: 85% remaining')
        };

        if (controls[controlId]) {
            controls[controlId]();
        }
    }

    showDesktop() {
        // 关闭所有应用窗口
        document.querySelectorAll('.app-window').forEach(window => {
            window.remove();
        });
        this.showNotification('Desktop', 'Returned to desktop view');
    }

    showAllApps() {
        this.createAppWindow({
            name: 'All Apps',
            icon: 'fas fa-th',
            component: 'apps-launcher'
        });
    }

    showRecentApps() {
        this.createAppWindow({
            name: 'Recent Apps',
            icon: 'fas fa-history',
            component: 'recent-apps'
        });
    }

    showUserProfile() {
        this.createAppWindow({
            name: 'User Profile',
            icon: 'fas fa-user-circle',
            component: 'user-profile'
        });
    }

    showNotifications() {
        const totalCount = this.notificationCount + this.unreadMessages + this.systemAlerts;
        this.showNotification('Notifications', `You have ${totalCount} notifications`, 'info');
    }

    // 计算器功能 - 已移至独立应用类
    calcInput(value) {
        if (typeof calcApp !== 'undefined') {
            calcApp.input(value);
        }
    }

    addNotification(title, message, type = 'info') {
        this.notificationCount++;
        this.updateNotificationBadge();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const icons = {
            'info': 'fas fa-info-circle',
            'success': 'fas fa-check-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-times-circle'
        };

        const gradients = {
            'info': 'var(--gradient-1)',
            'success': 'var(--gradient-4)',
            'warning': 'var(--gradient-5)',
            'error': 'var(--gradient-2)'
        };

        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon" style="background: ${gradients[type] || gradients.info};">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div class="notification-title">${title}</div>
            </div>
            <div class="notification-message">${message}</div>
        `;

        document.getElementById('notifications').appendChild(notification);

        // 自动移除通知
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // 点击关闭
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                this.notificationCount = Math.max(0, this.notificationCount - 1);
                this.updateNotificationBadge();
            }
        }, 300);
    }

    updateNotificationBadge() {
        const totalCount = this.notificationCount + this.unreadMessages + this.systemAlerts;
        const badge = document.querySelector('#notifications-btn .notification-badge');
        
        if (totalCount > 0) {
            badge.textContent = totalCount > 99 ? '99+' : totalCount.toString();
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    showNotification(title, message, type = 'info') {
        this.addNotification(title, message, type);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh);
            opacity: 0;
        }
    }

    @keyframes windowSlideOut {
        0% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
    }

    @keyframes notificationSlideOut {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// 初始化ImagineOS
let imagineOS;
document.addEventListener('DOMContentLoaded', () => {
    imagineOS = new ImagineOS();
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('ImagineOS Error:', e.error);
    if (imagineOS) {
        imagineOS.showNotification('System Error', 'An unexpected error occurred. The system is still running normally.', 'error');
    }
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'k':
                e.preventDefault();
                document.getElementById('global-search').focus();
                break;
            case 'z':
                e.preventDefault();
                if (imagineOS) {
                    imagineOS.openModal('zoey-modal');
                }
                break;
            case 'h':
                e.preventDefault();
                if (imagineOS) {
                    imagineOS.showDesktop();
                }
                break;
        }
    }
    
    if (e.key === 'Escape') {
        // 关闭所有模态框
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

console.log('🎨 ImagineOS Aismira - InfinityUI loaded successfully!');
console.log('🚀 Powered by Moude AI');
console.log('🎤 Zoey AI Assistant ready');
console.log('🌍 Multi-language support enabled');
console.log('✨ Liquid glass effects active');
console.log('🎭 Dynamic animations running');

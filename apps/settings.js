// Settings App - ImagineOS Aismira
class SettingsApp {
    constructor() {
        this.settings = {
            appearance: {
                darkMode: true,
                liquidGlass: true,
                animations: true,
                theme: 'default'
            },
            system: {
                autoUpdates: true,
                backgroundSync: true,
                performanceMode: false,
                language: 'en'
            },
            ai: {
                zoeyEnabled: true,
                voiceRecognition: true,
                smartSuggestions: true
            },
            notifications: {
                systemNotifications: true,
                soundEffects: true,
                doNotDisturb: false
            }
        };
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                    <h3 style="margin-bottom: 20px;">System Settings</h3>
                </div>
                <div style="flex: 1; padding: 20px; overflow-y: auto;">
                    ${this.renderAppearanceSection()}
                    ${this.renderSystemSection()}
                    ${this.renderAISection()}
                    ${this.renderNotificationsSection()}
                </div>
            </div>
        `;
    }

    renderAppearanceSection() {
        return `
            <div class="settings-section">
                <h4 style="color: var(--dynamic-blue); margin-bottom: 12px;">Appearance</h4>
                <div class="setting-item">
                    <span>Dark Mode</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.appearance.darkMode ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('appearance', 'darkMode', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Liquid Glass Effects</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.appearance.liquidGlass ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('appearance', 'liquidGlass', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Animations</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.appearance.animations ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('appearance', 'animations', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Theme</span>
                    <select style="background: var(--secondary-glass); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: var(--text-primary);" 
                            onchange="settingsApp.updateSetting('appearance', 'theme', this.value)">
                        <option value="default" ${this.settings.appearance.theme === 'default' ? 'selected' : ''}>Default</option>
                        <option value="ocean" ${this.settings.appearance.theme === 'ocean' ? 'selected' : ''}>Ocean</option>
                        <option value="sunset" ${this.settings.appearance.theme === 'sunset' ? 'selected' : ''}>Sunset</option>
                        <option value="forest" ${this.settings.appearance.theme === 'forest' ? 'selected' : ''}>Forest</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderSystemSection() {
        return `
            <div class="settings-section">
                <h4 style="color: var(--dynamic-green); margin-bottom: 12px;">System</h4>
                <div class="setting-item">
                    <span>Auto Updates</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.system.autoUpdates ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('system', 'autoUpdates', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Background Sync</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.system.backgroundSync ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('system', 'backgroundSync', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Performance Mode</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.system.performanceMode ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('system', 'performanceMode', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Language</span>
                    <select style="background: var(--secondary-glass); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: var(--text-primary);" 
                            onchange="settingsApp.updateSetting('system', 'language', this.value)">
                        <option value="en" ${this.settings.system.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="zh" ${this.settings.system.language === 'zh' ? 'selected' : ''}>中文</option>
                        <option value="ja" ${this.settings.system.language === 'ja' ? 'selected' : ''}>日本語</option>
                        <option value="ko" ${this.settings.system.language === 'ko' ? 'selected' : ''}>한국어</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderAISection() {
        return `
            <div class="settings-section">
                <h4 style="color: var(--dynamic-purple); margin-bottom: 12px;">AI Assistant</h4>
                <div class="setting-item">
                    <span>Zoey Voice Assistant</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.ai.zoeyEnabled ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('ai', 'zoeyEnabled', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Voice Recognition</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.ai.voiceRecognition ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('ai', 'voiceRecognition', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Smart Suggestions</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.ai.smartSuggestions ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('ai', 'smartSuggestions', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    }

    renderNotificationsSection() {
        return `
            <div class="settings-section">
                <h4 style="color: var(--dynamic-pink); margin-bottom: 12px;">Notifications</h4>
                <div class="setting-item">
                    <span>System Notifications</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.notifications.systemNotifications ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('notifications', 'systemNotifications', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Sound Effects</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.notifications.soundEffects ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('notifications', 'soundEffects', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Do Not Disturb</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.settings.notifications.doNotDisturb ? 'checked' : ''} 
                               onchange="settingsApp.updateSetting('notifications', 'doNotDisturb', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    }

    updateSetting(category, key, value) {
        this.settings[category][key] = value;
        this.saveSettings();
        
        // 应用设置更改
        this.applySetting(category, key, value);
        
        imagineOS.showNotification('Settings', `${key} updated successfully`, 'success');
    }

    applySetting(category, key, value) {
        switch (category) {
            case 'appearance':
                if (key === 'liquidGlass') {
                    // 应用液态玻璃效果
                    document.body.style.setProperty('--liquid-glass', value ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)');
                }
                break;
            case 'system':
                if (key === 'language') {
                    imagineOS.changeLanguage(value);
                }
                break;
            case 'ai':
                if (key === 'zoeyEnabled') {
                    const orb = document.getElementById('zoey-orb');
                    orb.style.display = value ? 'block' : 'none';
                }
                break;
        }
    }

    saveSettings() {
        localStorage.setItem('imagineOS_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('imagineOS_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
}

// 全局实例
let settingsApp = new SettingsApp();

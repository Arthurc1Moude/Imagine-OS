// Browser App - ImagineOS Aismira
class BrowserApp {
    constructor() {
        this.currentUrl = 'https://www.google.com';
        this.history = ['https://www.google.com'];
        this.historyIndex = 0;
        this.bookmarks = [
            { name: 'Google', url: 'https://www.google.com', icon: 'fas fa-search' },
            { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' },
            { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fab fa-stack-overflow' }
        ];
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid var(--border-glass);">
                    <button class="control-btn" onclick="browserApp.goBack()" ${this.historyIndex <= 0 ? 'disabled' : ''}><i class="fas fa-arrow-left"></i></button>
                    <button class="control-btn" onclick="browserApp.goForward()" ${this.historyIndex >= this.history.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-right"></i></button>
                    <button class="control-btn" onclick="browserApp.refresh()"><i class="fas fa-refresh"></i></button>
                    <button class="control-btn" onclick="browserApp.showBookmarks()"><i class="fas fa-star"></i></button>
                    <input type="text" id="url-bar" value="${this.currentUrl}" style="flex: 1; padding: 8px; border: 1px solid var(--border-glass); border-radius: 8px; background: var(--secondary-glass); color: var(--text-primary);" onkeypress="browserApp.handleUrlInput(event)">
                    <button class="control-btn" onclick="browserApp.goToUrl()"><i class="fas fa-external-link-alt"></i></button>
                </div>
                <div style="flex: 1; display: flex;">
                    <div id="bookmarks-panel" style="width: 200px; border-right: 1px solid var(--border-glass); padding: 16px; display: none;">
                        <h4 style="color: var(--text-primary); margin-bottom: 12px;">Bookmarks</h4>
                        ${this.renderBookmarks()}
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <div id="browser-content" style="flex: 1; background: var(--secondary-glass); display: flex; align-items: center; justify-content: center; position: relative;">
                            ${this.renderPageContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBookmarks() {
        return this.bookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="browserApp.navigateToBookmark('${bookmark.url}')">
                <i class="${bookmark.icon}" style="color: var(--dynamic-blue); margin-right: 8px;"></i>
                <span>${bookmark.name}</span>
            </div>
        `).join('');
    }

    renderPageContent() {
        const url = this.currentUrl.toLowerCase();
        
        if (url.includes('google.com')) {
            return `
                <div style="text-align: center; color: var(--text-primary);">
                    <div style="font-size: 72px; margin-bottom: 20px; color: #4285f4;">G</div>
                    <div style="font-size: 24px; margin-bottom: 30px; color: var(--text-primary);">Google Search</div>
                    <div style="max-width: 500px; margin: 0 auto;">
                        <input type="text" placeholder="Search Google or type a URL" style="width: 100%; padding: 12px; border: 1px solid var(--border-glass); border-radius: 24px; background: var(--secondary-glass); color: var(--text-primary); font-size: 16px;">
                    </div>
                </div>
            `;
        } else if (url.includes('youtube.com')) {
            return `
                <div style="text-align: center; color: var(--text-primary);">
                    <i class="fab fa-youtube" style="font-size: 72px; color: #ff0000; margin-bottom: 20px;"></i>
                    <div style="font-size: 24px; margin-bottom: 20px;">YouTube</div>
                    <div style="font-size: 16px; color: var(--text-secondary);">Watch videos, music, and more</div>
                </div>
            `;
        } else if (url.includes('github.com')) {
            return `
                <div style="text-align: center; color: var(--text-primary);">
                    <i class="fab fa-github" style="font-size: 72px; color: #333; margin-bottom: 20px;"></i>
                    <div style="font-size: 24px; margin-bottom: 20px;">GitHub</div>
                    <div style="font-size: 16px; color: var(--text-secondary);">Where the world builds software</div>
                </div>
            `;
        } else {
            return `
                <div style="text-align: center; color: var(--text-primary);">
                    <i class="fas fa-globe" style="font-size: 72px; color: var(--dynamic-blue); margin-bottom: 20px;"></i>
                    <div style="font-size: 24px; margin-bottom: 20px;">Web Page</div>
                    <div style="font-size: 16px; color: var(--text-secondary);">Loading ${this.currentUrl}...</div>
                </div>
            `;
        }
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentUrl = this.history[this.historyIndex];
            this.updateContent();
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentUrl = this.history[this.historyIndex];
            this.updateContent();
        }
    }

    refresh() {
        this.updateContent();
        imagineOS.showNotification('Browser', 'Page refreshed', 'info');
    }

    showBookmarks() {
        const panel = document.getElementById('bookmarks-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    handleUrlInput(event) {
        if (event.key === 'Enter') {
            this.goToUrl();
        }
    }

    goToUrl() {
        const urlInput = document.getElementById('url-bar');
        if (urlInput) {
            let url = urlInput.value;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                if (url.includes('.')) {
                    url = 'https://' + url;
                } else {
                    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                }
            }
            this.navigateToUrl(url);
        }
    }

    navigateToUrl(url) {
        this.currentUrl = url;
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(url);
        this.historyIndex = this.history.length - 1;
        this.updateContent();
    }

    navigateToBookmark(url) {
        this.navigateToUrl(url);
        this.showBookmarks();
    }

    updateContent() {
        const urlBar = document.getElementById('url-bar');
        const content = document.getElementById('browser-content');
        
        if (urlBar) urlBar.value = this.currentUrl;
        if (content) content.innerHTML = this.renderPageContent();
    }
}

// 全局实例
let browserApp = new BrowserApp();

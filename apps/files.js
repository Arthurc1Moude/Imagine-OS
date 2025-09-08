// Files App - ImagineOS Aismira
class FilesApp {
    constructor() {
        this.currentPath = '/home/user';
        this.selectedItems = new Set();
        this.viewMode = 'grid'; // grid or list
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid var(--border-glass);">
                    <button class="control-btn" onclick="filesApp.navigateBack()"><i class="fas fa-arrow-left"></i></button>
                    <button class="control-btn" onclick="filesApp.navigateForward()"><i class="fas fa-arrow-right"></i></button>
                    <button class="control-btn" onclick="filesApp.refresh()"><i class="fas fa-refresh"></i></button>
                    <button class="control-btn" onclick="filesApp.toggleView()"><i class="fas fa-${this.viewMode === 'grid' ? 'list' : 'th'}"></i></button>
                    <div style="flex: 1; background: var(--secondary-glass); border-radius: 8px; padding: 8px; color: var(--text-primary);">${this.currentPath}</div>
                </div>
                <div style="flex: 1; padding: 16px; overflow-y: auto;">
                    <div id="files-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px;">
                        ${this.renderFiles()}
                    </div>
                </div>
            </div>
        `;
    }

    renderFiles() {
        const files = this.getCurrentDirectoryFiles();
        return files.map(file => `
            <div class="file-item ${this.selectedItems.has(file.name) ? 'selected' : ''}" 
                 onclick="filesApp.selectItem('${file.name}')" 
                 ondblclick="filesApp.openItem('${file.name}')">
                <i class="${file.icon}" style="font-size: 32px; color: ${file.color};"></i>
                <span>${file.name}</span>
                ${file.size ? `<small style="color: var(--text-muted);">${file.size}</small>` : ''}
            </div>
        `).join('');
    }

    getCurrentDirectoryFiles() {
        const files = [
            { name: 'Documents', icon: 'fas fa-folder', color: 'var(--dynamic-blue)', type: 'folder' },
            { name: 'Pictures', icon: 'fas fa-folder', color: 'var(--dynamic-green)', type: 'folder' },
            { name: 'Downloads', icon: 'fas fa-folder', color: 'var(--dynamic-orange)', type: 'folder' },
            { name: 'Music', icon: 'fas fa-folder', color: 'var(--dynamic-purple)', type: 'folder' },
            { name: 'Videos', icon: 'fas fa-folder', color: 'var(--dynamic-pink)', type: 'folder' },
            { name: 'Desktop', icon: 'fas fa-folder', color: 'var(--dynamic-blue)', type: 'folder' },
            { name: 'report.pdf', icon: 'fas fa-file-pdf', color: '#ff6b6b', type: 'file', size: '2.3 MB' },
            { name: 'photo.jpg', icon: 'fas fa-file-image', color: '#4ecdc4', type: 'file', size: '1.8 MB' },
            { name: 'script.js', icon: 'fas fa-file-code', color: '#45b7d1', type: 'file', size: '15 KB' },
            { name: 'presentation.pptx', icon: 'fas fa-file-powerpoint', color: '#f39c12', type: 'file', size: '5.2 MB' },
            { name: 'data.xlsx', icon: 'fas fa-file-excel', color: '#27ae60', type: 'file', size: '892 KB' },
            { name: 'notes.txt', icon: 'fas fa-file-alt', color: '#95a5a6', type: 'file', size: '3 KB' }
        ];
        return files;
    }

    selectItem(name) {
        if (this.selectedItems.has(name)) {
            this.selectedItems.delete(name);
        } else {
            this.selectedItems.add(name);
        }
        this.updateView();
    }

    openItem(name) {
        const file = this.getCurrentDirectoryFiles().find(f => f.name === name);
        if (file && file.type === 'folder') {
            this.currentPath += '/' + name;
            this.updateView();
        } else {
            imagineOS.showNotification('File Opened', `Opening ${name}...`, 'info');
        }
    }

    navigateBack() {
        if (this.currentPath !== '/home/user') {
            const parts = this.currentPath.split('/');
            parts.pop();
            this.currentPath = parts.join('/') || '/home/user';
            this.updateView();
        }
    }

    navigateForward() {
        // 简化实现，实际应该有历史记录
        imagineOS.showNotification('Navigation', 'Forward navigation not available', 'info');
    }

    refresh() {
        this.updateView();
        imagineOS.showNotification('Files', 'Directory refreshed', 'info');
    }

    toggleView() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        this.updateView();
    }

    updateView() {
        const container = document.getElementById('files-container');
        if (container) {
            container.innerHTML = this.renderFiles();
        }
    }
}

// 全局实例
let filesApp = new FilesApp();

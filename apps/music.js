// Music App - ImagineOS Aismira
class MusicApp {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 180; // 3 minutes
        this.playlist = [
            { title: 'ImagineOS Theme', artist: 'Zoey AI', duration: '3:00', cover: '🎵' },
            { title: 'Liquid Dreams', artist: 'InfinityUI', duration: '4:15', cover: '🌊' },
            { title: 'Digital Sunset', artist: 'Moude AI', duration: '3:45', cover: '🌅' },
            { title: 'Glass Reflections', artist: 'ImagineOS', duration: '2:30', cover: '✨' },
            { title: 'Neon Pulse', artist: 'Aismira', duration: '4:00', cover: '💫' }
        ];
        this.volume = 70;
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                    <h3 style="margin-bottom: 20px; color: var(--text-primary);">Music Player</h3>
                </div>
                <div style="flex: 1; display: flex;">
                    <div style="width: 300px; border-right: 1px solid var(--border-glass); padding: 20px;">
                        <h4 style="color: var(--text-primary); margin-bottom: 16px;">Playlist</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${this.renderPlaylist()}
                        </div>
                    </div>
                    <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        ${this.renderPlayer()}
                    </div>
                </div>
            </div>
        `;
    }

    renderPlaylist() {
        return this.playlist.map((track, index) => `
            <div class="playlist-item ${index === this.currentTrack ? 'active' : ''}" 
                 onclick="musicApp.selectTrack(${index})">
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; background: ${index === this.currentTrack ? 'var(--accent-glass)' : 'var(--secondary-glass)'};">
                    <div style="font-size: 24px;">${track.cover}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary);">${track.title}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">${track.artist}</div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted);">${track.duration}</div>
                </div>
            </div>
        `).join('');
    }

    renderPlayer() {
        const track = this.playlist[this.currentTrack];
        return `
            <div style="text-align: center; max-width: 400px;">
                <div style="width: 200px; height: 200px; border-radius: 50%; background: var(--gradient-2); display: flex; align-items: center; justify-content: center; font-size: 80px; margin: 0 auto 30px; box-shadow: var(--shadow-deep); animation: ${this.isPlaying ? 'spin 3s linear infinite' : 'none'};">
                    ${track.cover}
                </div>
                <h2 style="color: var(--text-primary); margin-bottom: 8px;">${track.title}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 30px;">${track.artist}</p>
                
                <div style="margin-bottom: 20px;">
                    <div style="background: var(--secondary-glass); height: 6px; border-radius: 3px; margin-bottom: 8px; position: relative;">
                        <div style="background: var(--gradient-1); height: 100%; border-radius: 3px; width: ${(this.currentTime / this.duration) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
                        <span>${this.formatTime(this.currentTime)}</span>
                        <span>${track.duration}</span>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 30px;">
                    <button class="control-btn" onclick="musicApp.previousTrack()"><i class="fas fa-step-backward"></i></button>
                    <button class="control-btn" style="width: 60px; height: 60px; border-radius: 50%; background: var(--gradient-1);" onclick="musicApp.togglePlay()">
                        <i class="fas fa-${this.isPlaying ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="control-btn" onclick="musicApp.nextTrack()"><i class="fas fa-step-forward"></i></button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-volume-down" style="color: var(--text-secondary);"></i>
                    <div style="flex: 1; background: var(--secondary-glass); height: 4px; border-radius: 2px; position: relative;">
                        <div style="background: var(--gradient-1); height: 100%; border-radius: 2px; width: ${this.volume}%;"></div>
                    </div>
                    <i class="fas fa-volume-up" style="color: var(--text-secondary);"></i>
                    <span style="font-size: 12px; color: var(--text-muted); min-width: 30px;">${this.volume}%</span>
                </div>
            </div>
        `;
    }

    selectTrack(index) {
        this.currentTrack = index;
        this.currentTime = 0;
        this.updateView();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startPlayback();
        } else {
            this.stopPlayback();
        }
        this.updateView();
    }

    previousTrack() {
        this.currentTrack = this.currentTrack > 0 ? this.currentTrack - 1 : this.playlist.length - 1;
        this.currentTime = 0;
        this.updateView();
        imagineOS.showNotification('Music', `Playing: ${this.playlist[this.currentTrack].title}`, 'info');
    }

    nextTrack() {
        this.currentTrack = this.currentTrack < this.playlist.length - 1 ? this.currentTrack + 1 : 0;
        this.currentTime = 0;
        this.updateView();
        imagineOS.showNotification('Music', `Playing: ${this.playlist[this.currentTrack].title}`, 'info');
    }

    startPlayback() {
        this.playbackInterval = setInterval(() => {
            this.currentTime += 1;
            if (this.currentTime >= this.duration) {
                this.nextTrack();
            }
            this.updateProgress();
        }, 1000);
    }

    stopPlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
        }
    }

    updateProgress() {
        const progressBar = document.querySelector('.music-app .progress-bar');
        if (progressBar) {
            progressBar.style.width = `${(this.currentTime / this.duration) * 100}%`;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateView() {
        const container = document.querySelector('.music-app');
        if (container) {
            container.innerHTML = this.getContent();
        }
    }
}

// 全局实例
let musicApp = new MusicApp();

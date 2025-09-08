// Notes App - ImagineOS Aismira
class NotesApp {
    constructor() {
        this.notes = [
            { id: 1, title: 'Welcome to ImagineOS', content: 'This is your first note in ImagineOS Aismira. You can create, edit, and organize your notes here.', date: new Date(), color: '#ff6b9d' },
            { id: 2, title: 'Meeting Notes', content: 'Team meeting scheduled for tomorrow at 2 PM. Discuss project progress and upcoming deadlines.', date: new Date(Date.now() - 86400000), color: '#4ecdc4' },
            { id: 3, title: 'Shopping List', content: '• Milk\n• Bread\n• Eggs\n• Apples\n• Coffee', date: new Date(Date.now() - 172800000), color: '#45b7d1' }
        ];
        this.currentNote = null;
        this.isEditing = false;
    }

    getContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 8px; padding: 12px; border-bottom: 1px solid var(--border-glass);">
                    <button class="control-btn" onclick="notesApp.createNote()"><i class="fas fa-plus"></i></button>
                    <button class="control-btn" onclick="notesApp.saveNote()" ${!this.currentNote ? 'disabled' : ''}><i class="fas fa-save"></i></button>
                    <button class="control-btn" onclick="notesApp.deleteNote()" ${!this.currentNote ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                    <div style="flex: 1; background: var(--secondary-glass); border-radius: 8px; padding: 8px; color: var(--text-primary);">
                        ${this.currentNote ? this.currentNote.title : 'Select a note or create new one'}
                    </div>
                </div>
                <div style="flex: 1; display: flex;">
                    <div style="width: 250px; border-right: 1px solid var(--border-glass); padding: 16px; overflow-y: auto;">
                        <h4 style="color: var(--text-primary); margin-bottom: 16px;">Notes</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${this.renderNotesList()}
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; padding: 16px;">
                        ${this.renderNoteEditor()}
                    </div>
                </div>
            </div>
        `;
    }

    renderNotesList() {
        return this.notes.map(note => `
            <div class="note-item ${this.currentNote && this.currentNote.id === note.id ? 'active' : ''}" 
                 onclick="notesApp.selectNote(${note.id})">
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; background: ${this.currentNote && this.currentNote.id === note.id ? 'var(--accent-glass)' : 'var(--secondary-glass)'}; border-left: 4px solid ${note.color};">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${note.title}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.3; max-height: 2.6em; overflow: hidden;">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${this.formatDate(note.date)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderNoteEditor() {
        if (!this.currentNote) {
            return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);">
                    <i class="fas fa-sticky-note" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 8px;">No Note Selected</h3>
                    <p>Select a note from the list or create a new one to start writing.</p>
                </div>
            `;
        }

        return `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div style="margin-bottom: 16px;">
                    <input type="text" id="note-title" value="${this.currentNote.title}" 
                           style="width: 100%; padding: 12px; border: 1px solid var(--border-glass); border-radius: 8px; background: var(--secondary-glass); color: var(--text-primary); font-size: 18px; font-weight: 600;" 
                           onchange="notesApp.updateNoteTitle(this.value)">
                </div>
                <div style="flex: 1;">
                    <textarea id="note-content" 
                              style="width: 100%; height: 100%; padding: 16px; border: 1px solid var(--border-glass); border-radius: 8px; background: var(--secondary-glass); color: var(--text-primary); font-size: 14px; line-height: 1.6; resize: none; outline: none;" 
                              onchange="notesApp.updateNoteContent(this.value)">${this.currentNote.content}</textarea>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center;">
                    <span style="color: var(--text-secondary); font-size: 12px;">Color:</span>
                    <div style="display: flex; gap: 8px;">
                        ${['#ff6b9d', '#4ecdc4', '#45b7d1', '#f8b500', '#c44569', '#95a5a6'].map(color => `
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; cursor: pointer; border: 2px solid ${this.currentNote.color === color ? 'white' : 'transparent'};" 
                                 onclick="notesApp.changeNoteColor('${color}')"></div>
                        `).join('')}
                    </div>
                    <div style="margin-left: auto; font-size: 12px; color: var(--text-muted);">
                        Last saved: ${this.formatDate(this.currentNote.date)}
                    </div>
                </div>
            </div>
        `;
    }

    selectNote(id) {
        this.currentNote = this.notes.find(note => note.id === id);
        this.updateView();
    }

    createNote() {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            date: new Date(),
            color: '#ff6b9d'
        };
        this.notes.unshift(newNote);
        this.currentNote = newNote;
        this.updateView();
        imagineOS.showNotification('Notes', 'New note created', 'success');
    }

    saveNote() {
        if (this.currentNote) {
            this.currentNote.date = new Date();
            this.updateView();
            imagineOS.showNotification('Notes', 'Note saved', 'success');
        }
    }

    deleteNote() {
        if (this.currentNote) {
            const index = this.notes.findIndex(note => note.id === this.currentNote.id);
            if (index > -1) {
                this.notes.splice(index, 1);
                this.currentNote = this.notes.length > 0 ? this.notes[0] : null;
                this.updateView();
                imagineOS.showNotification('Notes', 'Note deleted', 'info');
            }
        }
    }

    updateNoteTitle(title) {
        if (this.currentNote) {
            this.currentNote.title = title;
        }
    }

    updateNoteContent(content) {
        if (this.currentNote) {
            this.currentNote.content = content;
        }
    }

    changeNoteColor(color) {
        if (this.currentNote) {
            this.currentNote.color = color;
            this.updateView();
        }
    }

    formatDate(date) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    updateView() {
        const container = document.querySelector('.notes-app');
        if (container) {
            container.innerHTML = this.getContent();
        }
    }
}

// 全局实例
let notesApp = new NotesApp();

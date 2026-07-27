const toggle = document.getElementById('herbert-toggle');
const window_ = document.getElementById('herbert-window');
const iconChat = document.getElementById('icon-chat');
const iconClose = document.getElementById('icon-close');
const input  = document.getElementById('herbert-input');
const sendBtn = document.getElementById('herbert-send');
const messages = document.getElementById('herbert-messages');
const clearBtn = document.getElementById('herbert-clear');
const uploadBtn = document.getElementById('herbert-upload');
const fileInput = document.getElementById('herbert-file-input');
const preview = document.getElementById('herbert-preview');
const previewImg = document.getElementById('herbert-preview-img');
const previewRemove = document.getElementById('herbert-preview-remove');

// Widget öffnen / schließen
toggle.addEventListener('click', () => {
    const isOpen = !window_.classList.contains('hidden');
    if (isOpen) {
        window_.classList.add('hidden');
        iconChat.style.display  = 'block';
        iconClose.style.display = 'none';
    } else {
        window_.classList.remove('hidden');
        iconChat.style.display  = 'none';
        iconClose.style.display = 'block';
        input.focus();
    }
});

// Enter zum Senden
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const text = input.value.trim();
    if (!text && !selectedFileBase64) return;

    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    appendMessage('user', text || '📎 Datei gesendet');
    const typingId = appendTyping();

    const imageToSend    = selectedFileBase64;
    const imageType      = selectedFileType;
    selectedFileBase64   = null;
    selectedFileType     = null;
    fileInput.value      = '';
    preview.style.display = 'none';
    uploadBtn.classList.remove('active');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message:        text,
                imageBase64:    imageToSend,
                imageMediaType: imageType
            })
        });

        if (!response.ok) throw new Error('Serverfehler: ' + response.status);

        const data = await response.json();
        removeTyping(typingId);
        appendMessage('assistant', data.reply);

    } catch (error) {
        removeTyping(typingId);
        appendMessage('assistant', 'Entschuldigung, da ist etwas schiefgelaufen.');
        console.error('Herbert Fehler:', error);
    } finally {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.classList.add('message', role);
    div.innerHTML = `
        <div class="bubble">${escapeHtml(text)}</div>
        <div class="time">${getCurrentTime()}</div>
    `;
    messages.appendChild(div);
    scrollToBottom();
}

function appendTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.classList.add('message', 'assistant', 'typing');
    div.id = id;
    div.innerHTML = `
        <div class="bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    messages.appendChild(div);
    scrollToBottom();
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() { messages.scrollTop = messages.scrollHeight; }
function getCurrentTime() {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

clearBtn.addEventListener('click', async () => {
    
    await fetch('/api/chat/clear', { method: 'DELETE' });

    
    messages.innerHTML = `
        <div class="message assistant">
            <div class="bubble">Chat wurde geleert. Wie kann ich dir helfen?</div>
            <div class="time">${getCurrentTime()}</div> 
        </div>
    `;
});

let selectedFileBase64 = null;
let selectedFileType   = null;

uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedFileBase64 = e.target.result.split(',')[1]; // Base64 ohne Prefix
        selectedFileType   = file.type;

        
        previewImg.src = e.target.result;
        preview.style.display = 'flex';
        uploadBtn.classList.add('active');
    };
    reader.readAsDataURL(file);
});

previewRemove.addEventListener('click', () => {
    selectedFileBase64 = null;
    selectedFileType   = null;
    fileInput.value    = '';
    preview.style.display = 'none';
    uploadBtn.classList.remove('active');
});
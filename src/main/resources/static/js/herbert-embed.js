(function () {
    const BASE_URL = 'http://localhost:8080'; // ← deine Spring Boot URL

    // ===== CSS laden =====
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BASE_URL + '/css/chatbot.css';
    document.head.appendChild(link);

    // ===== HTML ins DOM einfügen =====
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="herbert-toggle" aria-label="Herbert öffnen">
            <svg id="icon-chat" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div id="herbert-window" class="hidden">
            <div id="herbert-header">
                <div id="herbert-avatar">H</div>
                <div id="herbert-info">
                    <span id="herbert-name">Herbert</span>
                    <span id="herbert-status">
                        <span id="status-dot"></span> Online
                    </span>
                </div>
            </div>
            <div id="herbert-messages">
                <div class="message assistant">
                    <div class="bubble">Hallo! Ich bin Herbert. Wie kann ich dir helfen?</div>
                    <div class="time">Gerade eben</div>
                </div>
            </div>
            <div id="herbert-input-area">
                <input type="text" id="herbert-input"
                    placeholder="Nachricht schreiben..." autocomplete="off"/>
                <button id="herbert-send" aria-label="Senden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // ===== Logik (identisch zu chatbot.js aber mit absolutem API-Pfad) =====
    const toggle   = document.getElementById('herbert-toggle');
    const window_  = document.getElementById('herbert-window');
    const iconChat = document.getElementById('icon-chat');
    const iconClose= document.getElementById('icon-close');
    const input    = document.getElementById('herbert-input');
    const sendBtn  = document.getElementById('herbert-send');
    const messages = document.getElementById('herbert-messages');

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

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        appendMessage('user', text);
        const typingId = appendTyping();

        try {
            // ← Absoluter Pfad zur Spring Boot API
            const response = await fetch(BASE_URL + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
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
        messages.scrollTop = messages.scrollHeight;
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
        messages.scrollTop = messages.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

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
})();



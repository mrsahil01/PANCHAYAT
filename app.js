class App {
    constructor() {
        this.currentView = 'login'; // Start with login
        this.views = ['login', 'home', 'complaints', 'chat', 'services', 'community'];
        this.init();
    }

    init() {
        this.views.forEach(viewId => {
            const template = document.getElementById(`tpl-${viewId}`);
            if (template) {
                const clone = template.content.cloneNode(true);
                document.getElementById('view-container').appendChild(clone);
            }
        });

        this.initNav();
        this.initSOS();
        this.initVoiceRecorder();
        this.initChatBot();
        this.initCommunityInteractions();
        this.navigate(this.currentView, true);
    }

    showToast(message = "Success!") {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (!toast) return;
        toastMsg.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    mockLogin(method) {
        const loginBtn = document.querySelector('.btn-primary[type="submit"]');
        if (loginBtn && method === 'Email') {
            loginBtn.innerText = "Authenticating...";
        }
        
        // Simulate authentication delay
        setTimeout(() => {
            if (loginBtn) loginBtn.innerText = "Sign In";
            this.showToast(`Successfully logged in!`);
            this.navigate('home');
        }, 1200);
    }

    initNav() {
        const navButtons = document.querySelectorAll('.nav-item');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                if (view) this.navigate(view);
            });
        });
    }

    navigate(viewId, isInitial = false) {
        if (!isInitial && this.currentView === viewId) return;

        // Toggle global Header & Nav visibility depending on Login screen
        const header = document.getElementById('main-header');
        const nav = document.getElementById('bottom-nav');
        if (viewId === 'login') {
            if(header) header.classList.add('hidden');
            if(nav) nav.classList.add('hidden');
        } else {
            if(header) header.classList.remove('hidden');
            if(nav) nav.classList.remove('hidden');
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active-view');
        });

        // Show target view
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) {
            targetView.classList.add('active-view');
        }

        // Update nav icons
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === viewId) {
                btn.classList.add('active');
            }
        });

        this.currentView = viewId;
        
        // Auto-scroll chat to bottom if visiting chat
        if (viewId === 'chat') {
            const messages = document.getElementById('chat-messages');
            if(messages) messages.scrollTop = messages.scrollHeight;
        }
    }

    initSOS() {
        const triggerBtn = document.querySelector('.sos-main-btn');
        const modal = document.getElementById('sos-modal');
        const closeBtn = document.getElementById('close-sos');
        const sosOptions = document.querySelectorAll('.sos-btn');

        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => {
                modal.classList.add('show');
            });
        }
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));

        sosOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => this.showToast('Emergency alert sent to Security!'), 400);
            });
        });
    }

    initVoiceRecorder() {
        const recordBtn = document.getElementById('record-btn');
        const ripple = document.getElementById('voice-ripple');
        const status = document.getElementById('recorder-status');
        const aiPanel = document.getElementById('ai-panel');
        const retryBtn = document.getElementById('retry-record');

        if (!recordBtn) return;
        let isRecording = false;

        recordBtn.addEventListener('click', () => {
            if (isRecording) return;
            isRecording = true;
            recordBtn.classList.add('recording');
            ripple.classList.remove('hidden');
            status.innerText = "Listening...";
            aiPanel.classList.add('hidden');

            setTimeout(() => {
                recordBtn.classList.remove('recording');
                ripple.classList.add('hidden');
                status.innerText = "Processing with AI...";
                
                setTimeout(() => {
                    status.innerText = "Tap to speak the issue";
                    aiPanel.classList.remove('hidden');
                    isRecording = false;
                }, 1500);
            }, 2500);
        });

        if (retryBtn) retryBtn.addEventListener('click', () => aiPanel.classList.add('hidden'));
        
        const submitComplaint = document.getElementById('submit-complaint');
        if (submitComplaint) {
            submitComplaint.addEventListener('click', () => {
                submitComplaint.innerText = "Complaint Lodged!";
                submitComplaint.style.background = "var(--success-green)";
                this.showToast("Complaint tracked #1480");
                setTimeout(()=> {
                    aiPanel.classList.add('hidden');
                    submitComplaint.innerText = "Submit Formal Complaint";
                    submitComplaint.style.background = "var(--accent-teal)";
                }, 2000);
            })
        }
    }

    initChatBot() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const chatMessages = document.getElementById('chat-messages');
        const suggestions = document.querySelectorAll('.suggestion-card');

        const addMessage = (text, sender, isHTML = false) => {
            if(!chatMessages) return null;
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender} slide-in`;
            msgDiv.innerHTML = isHTML ? text : `<p>${text}</p>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msgDiv;
        };

        const handleSend = (text) => {
            if (!text.trim()) return;
            addMessage(text, 'user');
            if(chatInput) chatInput.value = '';

            const typing = addMessage(`<div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`, 'bot', true);

            setTimeout(() => {
                if(typing) typing.remove(); 

                let reply = "I couldn't find that in the rulebook.";
                const lowerText = text.toLowerCase();
                
                if (lowerText.includes('gym')) {
                    reply = "As per Section 2, the **Gym is open from 6:00 AM to 10:00 PM**.<br><br>Children under 16 must be accompanied by an adult. Towel and shoes are mandatory.";
                } else if (lowerText.includes('guest') || lowerText.includes('visitor') || lowerText.includes('parking')) {
                    reply = "Guests can park in the **Designated Visitor Parking** for up to 4 hours.<br><br>Ensure they make an entry via the app at the main gate.";
                } else if (lowerText.includes('noise') || lowerText.includes('party')) {
                    reply = "Loud music is prohibited after **10:00 PM**. Please maintain a quiet environment for the neighbors. Pre-approval is needed for terrace parties.";
                } else {
                    reply = "Let me check the society records for that... Unfortunately, I couldn't find the exact match. Shall I connect you to the Admin?";
                }
                
                addMessage(reply, 'bot', true);
            }, 1200);
        };

        if (sendBtn) sendBtn.addEventListener('click', () => handleSend(chatInput.value));
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend(chatInput.value);
            });
        }

        suggestions.forEach(card => {
            card.addEventListener('click', () => {
                handleSend(card.querySelector('span').innerText);
            });
        });
    }

    initCommunityInteractions() {
        const tabs = document.querySelectorAll('.comm-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.getElementById('feed-notices').classList.add('hidden');
                document.getElementById('feed-polls').classList.add('hidden');
                
                const target = tab.getAttribute('data-target');
                document.getElementById(target).classList.remove('hidden');
            });
        });

        const likeBtns = document.querySelectorAll('.interact-like');
        likeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const icon = btn.querySelector('i');
                const countSpan = btn.querySelector('.count');
                let count = parseInt(countSpan.innerText);
                
                if (btn.classList.contains('liked')) {
                    btn.classList.remove('liked');
                    icon.className = 'fa-regular fa-heart';
                    countSpan.innerText = count - 1;
                } else {
                    btn.classList.add('liked');
                    icon.className = 'fa-solid fa-heart';
                    countSpan.innerText = count + 1;
                }
            });
        });
    }

    bookService(btnElement, name) {
        btnElement.innerText = "Reserved!";
        btnElement.style.background = "var(--success-green)";
        btnElement.style.color = "white";
        this.showToast(`Successfully booked ${name}`);
    }

    votePoll(btnElement, pollGroupId) {
        const parent = btnElement.parentElement;
        const buttons = parent.querySelectorAll('.poll-btn');
        
        if (parent.classList.contains('voted')) return;
        parent.classList.add('voted');

        buttons.forEach(b => {
            b.classList.remove('voted');
            b.querySelector('.poll-pct').classList.remove('hidden');
        });
        
        btnElement.classList.add('voted');
        this.showToast("Your vote has been recorded!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

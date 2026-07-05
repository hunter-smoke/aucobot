document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 3. Email Subscription Mock & Toast Notification
    const emailForms = document.querySelectorAll('.email-form');
    
    // Create toast element dynamically
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = '✨ Đăng ký nhận thông báo thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.';
    document.body.appendChild(toast);

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    emailForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('.email-input');
            const emailValue = input.value.trim();

            if (emailValue && validateEmail(emailValue)) {
                showToast();
                input.value = '';
            } else {
                alert('Vui lòng nhập một địa chỉ email hợp lệ.');
            }
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 4. Live Chat Simulator Logic (Moved to /chat-simulator/app.js)

    // 5. Interactive SVG Diagram Nodes hover & particle flow effects
    const flowNodes = document.querySelectorAll('.flow-node');
    const flowLinks = document.querySelectorAll('.flow-link');

    flowNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const nodeId = node.getAttribute('id');
            // Add highlighting styles
            node.classList.add('highlight');
            
            // Highlight connections based on hovered node
            if (nodeId === 'node-user') {
                highlightLinks(['link-user-room']);
            } else if (nodeId === 'node-room') {
                highlightLinks(['link-user-room', 'link-room-agents']);
            } else if (nodeId === 'node-agents') {
                highlightLinks(['link-room-agents', 'link-agents-platforms', 'link-agents-drives']);
            } else if (nodeId === 'node-platforms') {
                highlightLinks(['link-agents-platforms']);
            } else if (nodeId === 'node-drives') {
                highlightLinks(['link-agents-drives']);
            }
        });

        node.addEventListener('mouseleave', () => {
            node.classList.remove('highlight');
            resetLinks();
        });
    });

    function highlightLinks(ids) {
        flowLinks.forEach(link => {
            if (ids.includes(link.getAttribute('id'))) {
                link.classList.add('active');
                link.style.strokeWidth = '2.5px';
            }
        });
    }

    function resetLinks() {
        flowLinks.forEach(link => {
            link.classList.remove('active');
            link.style.strokeWidth = '1.5px';
        });
    }

    // 6. Play/Pause Simulator Mockup Control
    const iframe = document.getElementById('simulator-iframe');
    const playPauseBtn = document.getElementById('play-pause-control');
    
    if (iframe && playPauseBtn) {
        const iconPlay = playPauseBtn.querySelector('.icon-play');
        const iconPause = playPauseBtn.querySelector('.icon-pause');
        
        function setPlayIcon() {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
        }
        
        function setPauseIcon() {
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
        }
        
        playPauseBtn.addEventListener('click', () => {
            const iframeWindow = iframe.contentWindow;
            if (!iframeWindow) return;
            
            if (typeof iframeWindow.isFinished === 'function' && iframeWindow.isFinished()) {
                if (typeof iframeWindow.resetSimulation === 'function') {
                    iframeWindow.resetSimulation();
                    setPauseIcon();
                }
            } else if (typeof iframeWindow.isPaused === 'function' && iframeWindow.isPaused()) {
                if (typeof iframeWindow.resumeSimulation === 'function') {
                    iframeWindow.resumeSimulation();
                    setPauseIcon();
                }
            } else {
                if (typeof iframeWindow.pauseSimulation === 'function') {
                    iframeWindow.pauseSimulation();
                    setPlayIcon();
                }
            }
        });
        
        window.onSimulationFinished = () => {
            setPlayIcon();
        };
        
        window.onSimulationReset = () => {
            setPauseIcon();
        };

        window.onSimulationPaused = () => {
            setPlayIcon();
        };

        window.onSimulationResumed = () => {
            setPauseIcon();
        };
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById('fake-cursor');
    const inputField = document.getElementById('chat-input');
    const dynamicArea = document.getElementById('dynamic-messages-area');
    const chatContainer = document.getElementById('chat-container');
    const replayBtn = document.getElementById('replay-btn');

    const textToType = "@Trợ Lý soạn 3 caption Tết cho Facebook, tone ấm áp, có CTA mua quà";
    let activeTimer = null;
    
    // Trạng thái điều khiển mô phỏng
    let isPaused = false;
    let isFinished = false;
    let pausedCallback = null;
    let pausedDelay = 0;
    let startTime = 0;

    // Bộ lập lịch thông minh hỗ trợ Pause/Resume
    function schedule(callback, delay) {
        if (isPaused) {
            pausedCallback = callback;
            pausedDelay = delay;
            return;
        }
        pausedCallback = null;
        pausedDelay = delay;
        startTime = Date.now();
        activeTimer = setTimeout(callback, delay);
    }

    // Cuộn xuống cuối khung chat mượt mà
    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Hàm xóa sạch các nội dung động để khởi tạo lại từ đầu
    function resetSimulation() {
        if (activeTimer) clearTimeout(activeTimer);
        isPaused = false;
        isFinished = false;
        pausedCallback = null;
        pausedDelay = 0;
        
        dynamicArea.innerHTML = '';
        inputField.innerHTML = '<span class="text-gray-400" id="input-placeholder">Nhắn tin</span>';
        const actionBtn = document.getElementById('action-btn');
        if (actionBtn) actionBtn.setAttribute('data-mode', 'voice');
        
        startSimulation();
        
        if (window.parent && typeof window.parent.onSimulationReset === 'function') {
            window.parent.onSimulationReset();
        }
    }

    replayBtn.addEventListener('click', resetSimulation);

    // Bắt đầu kịch bản mô phỏng chính
    function startSimulation() {
        cursor.style.opacity = '1';
        cursor.style.top = '66%';
        cursor.style.left = '50%';

        // Di chuyển chuột đến ô nhập liệu
        schedule(() => {
            const inputRect = inputField.getBoundingClientRect();
            cursor.style.top = (inputRect.top + inputRect.height / 2) + 'px';
            cursor.style.left = (inputRect.left + 50) + 'px';

            // Click vào ô và bắt đầu gõ
            schedule(() => {
                cursor.style.opacity = '0';
                const actionBtn = document.getElementById('action-btn');
                if (actionBtn) actionBtn.setAttribute('data-mode', 'send');
                inputField.innerHTML = '<span class="text-gray-800 cursor-blink font-normal" id="typing-text"></span>';
                const typingTextSpan = document.getElementById('typing-text');

                let typeIndex = 0;
                function typeWriter() {
                    if (typeIndex < textToType.length) {
                        let char = textToType.charAt(typeIndex);
                        
                        if(typeIndex === 0) {
                            typingTextSpan.innerHTML = '<span class="text-sky-500 font-medium">@Trợ Lý</span> ';
                            typeIndex += 8;
                            schedule(typeWriter, 120);
                            return;
                        }
                        
                        let currentTyped = textToType.substring(8, typeIndex + 1);
                        typingTextSpan.innerHTML = `<span class="text-sky-500 font-medium">@Trợ Lý</span> ${currentTyped}`;

                        typeIndex++;
                        schedule(typeWriter, Math.random() * 60 + 40);
                    } else {
                        schedule(() => {
                            submitMessage();
                        }, 800);
                    }
                }
                typeWriter();

            }, 1400);
        }, 800);
    }

    function submitMessage() {
        inputField.innerHTML = '<span class="text-gray-400" id="input-placeholder">Nhắn tin</span>';
        const actionBtn = document.getElementById('action-btn');
        if (actionBtn) actionBtn.setAttribute('data-mode', 'voice');
        
        const userMsgHTML = `
            <div class="flex justify-end mb-1 fade-in">
                <div class="bg-sky-400 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm">
                    <p><span class="font-medium text-sky-100">@Trợ Lý</span> ${textToType.substring(8)}</p>
                </div>
            </div>
        `;
        dynamicArea.insertAdjacentHTML('beforeend', userMsgHTML);
        scrollToBottom();

        schedule(showBotProgress, 850);
    }

    function showBotProgress() {
        const botProgressId = 'bot-progress-box';
        const progressHTML = `
            <div class="activity-row fade-in" id="${botProgressId}">
                <div class="activity-avatar">
                    <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">TL</div>
                </div>
                <div class="activity-card">
                    <div class="activity-header" id="activity-header" data-state="working">
                        <span class="activity-dot"></span>
                        <span class="activity-header-text">Đang làm việc</span>
                        <span class="activity-header-count" id="progress-count">1/6</span>
                    </div>
                    
                    <ol class="activity-timeline">
                        <!-- Step 1: Phân tích yêu cầu -->
                        <li class="activity-step" id="step-1" data-status="running">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-1">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
                                </span>
                                <span class="activity-connector" id="connector-1"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Phân tích yêu cầu</span>
                            </div>
                        </li>

                        <!-- Step 2: Đọc brand kit Tết -->
                        <li class="activity-step" id="step-2" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-2">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                                </span>
                                <span class="activity-connector" id="connector-2"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Đọc brand kit Tết</span>
                                <span class="activity-step-detail hidden" id="desc-2">3 tài liệu</span>
                            </div>
                        </li>

                        <!-- Step 3: Tìm xu hướng caption Tết -->
                        <li class="activity-step" id="step-3" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-3">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                </span>
                                <span class="activity-connector" id="connector-3"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Tìm xu hướng caption Tết</span>
                                <span class="activity-step-detail hidden" id="desc-3">12 kết quả</span>
                            </div>
                        </li>

                        <!-- Step 4: Soạn 3 caption + CTA -->
                        <li class="activity-step" id="step-4" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-4">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                </span>
                                <span class="activity-connector" id="connector-4"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Soạn 3 caption + CTA</span>
                            </div>
                        </li>

                        <!-- Step 5: Lên lịch đăng -->
                        <li class="activity-step" id="step-5" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-5">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </span>
                                <span class="activity-connector" id="connector-5"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Lên lịch đăng 09:00 ngày 28/1</span>
                            </div>
                        </li>
                        
                        <!-- Step 6: Chuyển Publisher chuẩn bị đăng -->
                        <li class="activity-step" id="step-6" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon-6">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>
                                </span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label" id="text-6">Chuyển Publisher chuẩn bị đăng</span>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        `;
        dynamicArea.insertAdjacentHTML('beforeend', progressHTML);
        scrollToBottom();

        const steps = 6;
        const countText = document.getElementById('progress-count');

        function activateStep(stepNum) {
            const stepEl = document.getElementById(`step-${stepNum}`);
            if (!stepEl) return;
            stepEl.setAttribute('data-status', 'running');

            if (stepNum > 1) {
                const prevStepEl = document.getElementById(`step-${stepNum - 1}`);
                if (prevStepEl) prevStepEl.setAttribute('data-status', 'done');
                
                const prevConnector = document.getElementById(`connector-${stepNum - 1}`);
                if (prevConnector) {
                    prevConnector.setAttribute('data-flowing', 'true');
                    prevConnector.removeAttribute('data-filled');
                }
                
                if (stepNum > 2) {
                    const oldConnector = document.getElementById(`connector-${stepNum - 2}`);
                    if (oldConnector) {
                        oldConnector.removeAttribute('data-flowing');
                        oldConnector.setAttribute('data-filled', 'true');
                    }
                }
            }

            if (stepNum === 6) {
                document.getElementById('text-6').innerText = "Chuyển Publisher chuẩn bị đăng...";
            }

            const desc = document.getElementById(`desc-${stepNum}`);
            if (desc) desc.classList.remove('hidden');

            countText.innerText = `${stepNum}/${steps}`;
            scrollToBottom();

            if (stepNum < steps) {
                schedule(() => {
                    activateStep(stepNum + 1);
                }, 750);
            } else {
                schedule(() => {
                    stepEl.setAttribute('data-status', 'done');
                    const progressBox = document.getElementById(botProgressId);
                    if (progressBox) progressBox.style.display = 'none';
                    showFinalResult();
                }, 900);
            }
        }

        activateStep(1);
    }

    function showFinalResult() {
        const finalHTML = `
            <div class="flex gap-3 mb-1 fade-in">
                <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">TL</div>
                <div class="flex flex-col gap-2 max-w-[85%] w-full">
                    <div class="bg-white text-gray-800 p-4 rounded-3xl rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 relative">
                        <p class="text-sky-500 font-bold mb-1.5 text-xs tracking-wide">Trợ Lý</p>
                        <p class="mb-3 text-sm text-gray-600">Caption đăng Facebook:</p>
                        
                        <p class="font-bold text-gray-900 mb-5 text-base leading-snug">
                            Tết sum vầy bắt đầu từ món ngon… 🧧
                        </p>

                        <p class="text-xs text-gray-500 leading-relaxed">
                            Lên lịch <span class="font-bold text-gray-900 bg-amber-50 px-1 rounded">09:00 ngày 28/1</span> sau khi bạn duyệt.
                        </p>
                    </div>
                    
                    <div class="flex flex-col gap-[2px] mt-1">
                        <button id="btn-duyet" class="glass-btn w-full">
                            Duyệt
                        </button>
                        <button class="glass-btn w-full">
                            Từ chối
                        </button>
                        <button class="glass-btn w-full">
                            Sửa
                        </button>
                    </div>
                    <span class="text-[10px] text-gray-400 mt-1 pl-1">13:50</span>
                </div>
            </div>
        `;
        
        dynamicArea.insertAdjacentHTML('beforeend', finalHTML);
        scrollToBottom();

        // Kịch bản di chuyển con trỏ click nút "Duyệt" chuẩn xác
        schedule(() => {
            const btnDuyet = document.getElementById('btn-duyet');
            if (!btnDuyet) return;
            const btnRect = btnDuyet.getBoundingClientRect();
            
            cursor.style.opacity = '1';
            cursor.style.top = (btnRect.top + btnRect.height / 2) + 'px';
            cursor.style.left = (btnRect.left + btnRect.width / 2) + 'px';

            schedule(() => {
                btnDuyet.style.transform = 'scale(0.95)';
                btnDuyet.style.backgroundColor = '#f0f9ff';
                btnDuyet.style.borderColor = '#bae6fd';
                
                schedule(() => {
                    btnDuyet.style.transform = '';
                    btnDuyet.style.backgroundColor = '';
                    btnDuyet.style.borderColor = '';
                    
                    const approvedHTML = `
                        <div class="flex justify-center mt-3 fade-in">
                            <span class="text-xs text-gray-500 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-white shadow-sm font-medium">Bạn đã duyệt lịch đăng này</span>
                        </div>
                    `;
                    dynamicArea.insertAdjacentHTML('beforeend', approvedHTML);
                    scrollToBottom();
                    
                    schedule(() => {
                        cursor.style.opacity = '0';
                        schedule(showSchedulingProgress, 600);
                    }, 500);

                }, 180);
            }, 1300);
        }, 1000);
    }

    function showSchedulingProgress() {
        const botProgressId2 = 'bot-progress-box-2';
        const progressHTML = `
            <div class="activity-row mb-1 mt-2 fade-in" id="${botProgressId2}">
                <div class="activity-avatar">
                    <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">TL</div>
                </div>
                <div class="activity-card">
                    <div class="activity-header" id="activity-header-2" data-state="working">
                        <span class="activity-dot"></span>
                        <span class="activity-header-text">Đang xử lý</span>
                        <span class="activity-header-count" id="progress-count-2">1/2</span>
                    </div>
                    
                    <ol class="activity-timeline">
                        <!-- Step 1 -->
                        <li class="activity-step" id="step2-1" data-status="running">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon2-1">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </span>
                                <span class="activity-connector" id="connector2-1"></span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label">Đồng bộ với hệ thống</span>
                            </div>
                        </li>

                        <!-- Step 2 -->
                        <li class="activity-step" id="step2-2" data-status="pending">
                            <span class="activity-marker">
                                <span class="activity-icon-bubble" id="icon2-2">
                                    <svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </span>
                            </span>
                            <div class="activity-step-body">
                                <span class="activity-step-label" id="text2-2">Đang thiết lập thời gian...</span>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        `;
        dynamicArea.insertAdjacentHTML('beforeend', progressHTML);
        scrollToBottom();

        const steps = 2;
        const countText = document.getElementById('progress-count-2');

        function activateStep2(stepNum) {
            const stepEl = document.getElementById(`step2-${stepNum}`);
            if (!stepEl) return;
            stepEl.setAttribute('data-status', 'running');

            if (stepNum > 1) {
                const prevStepEl = document.getElementById(`step2-${stepNum - 1}`);
                if (prevStepEl) prevStepEl.setAttribute('data-status', 'done');
                
                const prevConnector = document.getElementById(`connector2-${stepNum - 1}`);
                if (prevConnector) {
                    prevConnector.setAttribute('data-flowing', 'true');
                    prevConnector.removeAttribute('data-filled');
                }
                
                if (stepNum === 2) {
                    document.getElementById('text2-2').innerText = "Đã lên lịch xong";
                }
            }

            countText.innerText = `${stepNum}/${steps}`;
            scrollToBottom();

            if (stepNum < steps) {
                schedule(() => {
                    activateStep2(stepNum + 1);
                }, 1200);
            } else {
                schedule(() => {
                    stepEl.setAttribute('data-status', 'done');
                    const progressBox = document.getElementById(botProgressId2);
                    if (progressBox) progressBox.style.display = 'none'; 
                    showFinalScheduledMessage();
                }, 1000);
            }
        }

        activateStep2(1);
    }

    function showFinalScheduledMessage() {
        const finalHTML = `
            <div class="flex gap-3 mb-1 fade-in">
                <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">TL</div>
                <div class="flex flex-col gap-2 max-w-[85%] w-full">
                    <div class="bg-white text-gray-800 p-4 rounded-3xl rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 relative">
                        <p class="text-sky-500 font-bold mb-1.5 text-xs tracking-wide">Trợ Lý</p>
                        <p class="text-sm text-gray-700 leading-relaxed">
                            Tuyệt vời! Tôi đã lên lịch thành công cho bài viết này vào lúc <span class="font-bold text-gray-900 bg-amber-50 px-1 rounded">09:00 ngày 28/1</span>. 🚀
                        </p>
                    </div>
                    <span class="text-[10px] text-gray-400 pl-1">13:51</span>
                </div>
            </div>
        `;
        
        dynamicArea.insertAdjacentHTML('beforeend', finalHTML);
        scrollToBottom();

        isFinished = true;
        if (window.parent && typeof window.parent.onSimulationFinished === 'function') {
            window.parent.onSimulationFinished();
        }
    }

    // Các hàm điều khiển mô phỏng từ bên ngoài
    window.resetSimulation = resetSimulation;
    window.pauseSimulation = () => {
        isPaused = true;
        if (activeTimer) {
            clearTimeout(activeTimer);
            const elapsed = Date.now() - startTime;
            pausedDelay = Math.max(0, pausedDelay - elapsed);
        }
        if (window.parent && typeof window.parent.onSimulationPaused === 'function') {
            window.parent.onSimulationPaused();
        }
    };
    window.resumeSimulation = () => {
        if (!isPaused) return;
        isPaused = false;
        if (pausedCallback) {
            schedule(pausedCallback, pausedDelay);
        }
        if (window.parent && typeof window.parent.onSimulationResumed === 'function') {
            window.parent.onSimulationResumed();
        }
    };
    window.isFinished = () => isFinished;
    window.isPaused = () => isPaused;

    // Kích hoạt chương trình ngay khi load trang xong
    startSimulation();
});

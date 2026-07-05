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
            <div class="flex gap-3 mb-1 fade-in" id="${botProgressId}">
                <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">TL</div>
                <div class="bg-white p-4.5 rounded-2xl rounded-tl-sm max-w-[85%] w-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50/80">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            <span class="font-bold text-gray-800 text-xs tracking-wide">Đang làm việc</span>
                        </div>
                        <span class="text-gray-400 text-xs font-semibold" id="progress-count">1/6</span>
                    </div>
                    
                    <div class="relative pl-2 space-y-4">
                        <div class="absolute left-[19px] top-3 bottom-4 w-[2px] bg-gray-100 z-0"></div>
                        <div class="absolute left-[19px] top-3 w-[2px] bg-emerald-500 z-0 transition-all duration-500" id="progress-line-active" style="height: 0%;"></div>

                        <!-- Step 1: Phân tích yêu cầu -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-1">
                            <div class="w-6 h-6 rounded-full bg-emerald-55 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Phân tích yêu cầu</span>
                            </div>
                        </div>

                        <!-- Step 2: Đọc brand kit Tết -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-2">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon-2">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Đọc brand kit Tết</span>
                                <span class="text-[10px] text-gray-400 hidden" id="desc-2">3 tài liệu</span>
                            </div>
                        </div>

                        <!-- Step 3: Tìm xu hướng caption Tết -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-3">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon-3">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Tìm xu hướng caption Tết</span>
                                <span class="text-[10px] text-gray-400 hidden" id="desc-3">12 kết quả</span>
                            </div>
                        </div>

                        <!-- Step 4: Soạn 3 caption + CTA -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-4">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon-4">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Soạn 3 caption + CTA</span>
                            </div>
                        </div>

                        <!-- Step 5: Lên lịch đăng -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-5">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon-5">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Lên lịch đăng 09:00 ngày 28/1</span>
                            </div>
                        </div>
                        
                        <!-- Step 6: Chuyển Publisher chuẩn bị đăng -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step-6">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon-6">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700" id="text-6">Chuyển Publisher chuẩn bị đăng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        dynamicArea.insertAdjacentHTML('beforeend', progressHTML);
        scrollToBottom();

        const steps = 6;
        const activeLine = document.getElementById('progress-line-active');
        const countText = document.getElementById('progress-count');

        function activateStep(stepNum) {
            const stepEl = document.getElementById(`step-${stepNum}`);
            if (!stepEl) return;
            stepEl.classList.remove('opacity-50');
            stepEl.classList.add('opacity-100');

            if (stepNum > 1) {
                const iconBg = document.getElementById(`icon-${stepNum}`);
                if (iconBg) {
                    iconBg.classList.remove('bg-gray-100');
                    
                    if(stepNum === 6) {
                        iconBg.classList.add('bg-sky-50', 'ring-2', 'ring-sky-100');
                        iconBg.querySelector('svg').classList.replace('text-gray-400', 'text-sky-500');
                        document.getElementById('text-6').classList.replace('text-gray-700', 'text-sky-500');
                        document.getElementById('text-6').innerText = "Chuyển Publisher chuẩn bị đăng...";
                    } else {
                        iconBg.classList.add('bg-emerald-50');
                        iconBg.innerHTML = '<svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
                    }
                }
            }

            const desc = document.getElementById(`desc-${stepNum}`);
            if(desc) desc.classList.remove('hidden');

            countText.innerText = `${stepNum}/${steps}`;
            activeLine.style.height = `${(stepNum - 1) * 20}%`;
            scrollToBottom();

            if (stepNum < steps) {
                schedule(() => {
                    activateStep(stepNum + 1);
                }, 750);
            } else {
                schedule(() => {
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
                    
                    <div class="flex flex-col gap-2 mt-1">
                        <button id="btn-duyet" class="chip-btn w-full">
                            Duyệt
                        </button>
                        <button class="chip-btn w-full">
                            Từ chối
                        </button>
                        <button class="chip-btn w-full">
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
            <div class="flex gap-3 mb-1 mt-2 fade-in" id="${botProgressId2}">
                <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">TL</div>
                <div class="bg-white p-4.5 rounded-2xl rounded-tl-sm max-w-[85%] w-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50/80">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            <span class="font-bold text-gray-800 text-xs tracking-wide">Đang xử lý</span>
                        </div>
                        <span class="text-gray-400 text-xs font-semibold" id="progress-count-2">1/2</span>
                    </div>
                    
                    <div class="relative pl-2 space-y-4">
                        <div class="absolute left-[19px] top-3 bottom-4 w-[2px] bg-gray-100 z-0"></div>
                        <div class="absolute left-[19px] top-3 w-[2px] bg-emerald-500 z-0 transition-all duration-500" id="progress-line-active-2" style="height: 0%;"></div>

                        <!-- Step 1 -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step2-1">
                            <div class="w-6 h-6 rounded-full bg-emerald-55 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700">Đồng bộ với hệ thống</span>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="flex gap-3 relative z-10 opacity-50 transition-all" id="step2-2">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm" id="icon2-2">
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div class="flex flex-col justify-center">
                                <span class="text-xs font-semibold text-gray-700" id="text2-2">Đang thiết lập thời gian...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        dynamicArea.insertAdjacentHTML('beforeend', progressHTML);
        scrollToBottom();

        const steps = 2;
        const activeLine = document.getElementById('progress-line-active-2');
        const countText = document.getElementById('progress-count-2');

        function activateStep2(stepNum) {
            const stepEl = document.getElementById(`step2-${stepNum}`);
            if (!stepEl) return;
            stepEl.classList.remove('opacity-50');
            stepEl.classList.add('opacity-100');

            if (stepNum > 1) {
                const iconBg = document.getElementById(`icon2-${stepNum}`);
                if (iconBg) {
                    iconBg.classList.remove('bg-gray-100');
                    
                    if(stepNum === 2) {
                        iconBg.classList.add('bg-sky-50', 'ring-2', 'ring-sky-100');
                        iconBg.querySelector('svg').classList.replace('text-gray-400', 'text-sky-500');
                        document.getElementById('text2-2').classList.replace('text-gray-700', 'text-sky-500');
                        document.getElementById('text2-2').innerText = "Đã lên lịch xong";
                    }
                }
            }

            countText.innerText = `${stepNum}/${steps}`;
            activeLine.style.height = `${(stepNum - 1) * 100}%`;
            scrollToBottom();

            if (stepNum < steps) {
                schedule(() => {
                    activateStep2(stepNum + 1);
                }, 1200);
            } else {
                schedule(() => {
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

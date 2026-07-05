document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("fake-cursor");
  const inputField = document.getElementById("chat-input");
  const dynamicArea = document.getElementById("dynamic-messages-area");
  const chatContainer = document.getElementById("chat-container");
  const replayBtn = document.getElementById("replay-btn");
  const simulatorRoot = document.querySelector(".simulator-root");

  const textToType =
    "@Trợ Lý soạn 3 caption Tết cho Facebook, tone ấm áp, có CTA mua quà";
  let activeTimer = null;

  const CHECK_ICON =
    '<svg class="icon-emerald" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';

  function scrollToBottom() {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  function resetSimulation() {
    if (activeTimer) clearTimeout(activeTimer);

    dynamicArea.innerHTML = "";
    inputField.innerHTML =
      '<span class="input-placeholder" id="input-placeholder">Nhắn tin</span>';
    cursor.style.opacity = "0";

    startSimulation();
  }

  replayBtn.addEventListener("click", resetSimulation);

  function startSimulation() {
    const rootRect = simulatorRoot.getBoundingClientRect();

    cursor.style.opacity = "1";
    cursor.style.top = `${rootRect.top + rootRect.height * 0.66}px`;
    cursor.style.left = `${rootRect.left + rootRect.width * 0.5}px`;

    activeTimer = setTimeout(() => {
      const inputRect = inputField.getBoundingClientRect();
      cursor.style.top = `${inputRect.top + inputRect.height / 2}px`;
      cursor.style.left = `${inputRect.left + 50}px`;

      activeTimer = setTimeout(() => {
        cursor.style.opacity = "0";
        inputField.innerHTML =
          '<span class="typing-text cursor-blink" id="typing-text"></span>';
        const typingTextSpan = document.getElementById("typing-text");

        let typeIndex = 0;

        function typeWriter() {
          if (typeIndex < textToType.length) {
            if (typeIndex === 0) {
              typingTextSpan.innerHTML =
                '<span class="mention-highlight">@Trợ Lý</span> ';
              typeIndex += 8;
              activeTimer = setTimeout(typeWriter, 120);
              return;
            }

            const currentTyped = textToType.substring(8, typeIndex + 1);
            typingTextSpan.innerHTML = `<span class="mention-highlight">@Trợ Lý</span> ${currentTyped}`;

            typeIndex++;
            activeTimer = setTimeout(typeWriter, Math.random() * 60 + 40);
          } else {
            activeTimer = setTimeout(submitMessage, 800);
          }
        }

        typeWriter();
      }, 1400);
    }, 800);
  }

  function submitMessage() {
    inputField.innerHTML =
      '<span class="input-placeholder" id="input-placeholder">Nhắn tin</span>';

    const userMsgHTML = `
      <div class="msg-row msg-row--user fade-in">
        <div class="bubble bubble--user">
          <p><span class="mention">@Trợ Lý</span> ${textToType.substring(8)}</p>
        </div>
      </div>
    `;
    dynamicArea.insertAdjacentHTML("beforeend", userMsgHTML);
    scrollToBottom();

    activeTimer = setTimeout(showBotProgress, 850);
  }

  function showBotProgress() {
    const botProgressId = "bot-progress-box";
    const progressHTML = `
      <div class="msg-row fade-in" id="${botProgressId}">
        <div class="avatar avatar--md">TL</div>
        <div class="progress-card">
          <div class="progress-header">
            <div class="progress-status">
              <span class="status-dot-wrap">
                <span class="status-ping"></span>
                <span class="status-dot"></span>
              </span>
              <span class="progress-title">Đang làm việc</span>
            </div>
            <span class="progress-count" id="progress-count">1/6</span>
          </div>

          <div class="progress-steps">
            <div class="progress-line-bg"></div>
            <div class="progress-line-active" id="progress-line-active" style="height: 0%;"></div>

            <div class="progress-step" id="step-1">
              <div class="step-icon step-icon--done">${CHECK_ICON}</div>
              <div><span class="step-label">Phân tích yêu cầu</span></div>
            </div>

            <div class="progress-step" id="step-2">
              <div class="step-icon step-icon--pending" id="icon-2">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <span class="step-label">Đọc brand kit Tết</span>
                <span class="step-desc is-hidden" id="desc-2">3 tài liệu</span>
              </div>
            </div>

            <div class="progress-step" id="step-3">
              <div class="step-icon step-icon--pending" id="icon-3">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div>
                <span class="step-label">Tìm xu hướng caption Tết</span>
                <span class="step-desc is-hidden" id="desc-3">12 kết quả</span>
              </div>
            </div>

            <div class="progress-step" id="step-4">
              <div class="step-icon step-icon--pending" id="icon-4">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
              <div><span class="step-label">Soạn 3 caption + CTA</span></div>
            </div>

            <div class="progress-step" id="step-5">
              <div class="step-icon step-icon--pending" id="icon-5">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div><span class="step-label">Lên lịch đăng 09:00 ngày 28/1</span></div>
            </div>

            <div class="progress-step" id="step-6">
              <div class="step-icon step-icon--pending" id="icon-6">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <span class="step-label" id="text-6">Chuyển Publisher chuẩn bị đăng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    dynamicArea.insertAdjacentHTML("beforeend", progressHTML);
    scrollToBottom();

    const steps = 6;
    const activeLine = document.getElementById("progress-line-active");
    const countText = document.getElementById("progress-count");

    function activateStep(stepNum) {
      const stepEl = document.getElementById(`step-${stepNum}`);
      if (!stepEl) return;
      stepEl.classList.add("progress-step--active");

      if (stepNum > 1) {
        const iconBg = document.getElementById(`icon-${stepNum}`);
        if (iconBg) {
          iconBg.classList.remove("step-icon--pending");

          if (stepNum === 6) {
            iconBg.classList.add("step-icon--loading");
            iconBg.querySelector("svg").classList.remove("icon-gray");
            iconBg.querySelector("svg").classList.add("icon-sky");
            const text6 = document.getElementById("text-6");
            text6.classList.add("step-label--active");
            text6.innerText = "Chuyển Publisher chuẩn bị đăng...";
          } else {
            iconBg.classList.add("step-icon--done");
            iconBg.innerHTML = CHECK_ICON;
          }
        }
      }

      const desc = document.getElementById(`desc-${stepNum}`);
      if (desc) desc.classList.remove("is-hidden");

      countText.innerText = `${stepNum}/${steps}`;
      activeLine.style.height = `${(stepNum - 1) * 20}%`;
      scrollToBottom();

      if (stepNum < steps) {
        activeTimer = setTimeout(() => activateStep(stepNum + 1), 750);
      } else {
        activeTimer = setTimeout(() => {
          const progressBox = document.getElementById(botProgressId);
          if (progressBox) progressBox.style.display = "none";
          showFinalResult();
        }, 900);
      }
    }

    activateStep(1);
  }

  function showFinalResult() {
    const finalHTML = `
      <div class="msg-row fade-in">
        <div class="avatar avatar--md">TL</div>
        <div class="bubble--agent-col">
          <div class="bubble bubble--agent bubble--agent-lg">
            <p class="agent-label">Trợ Lý</p>
            <p class="result-lead">Caption đăng Facebook:</p>
            <p class="result-caption">Tết sum vầy bắt đầu từ món ngon… 🧧</p>
            <p class="result-schedule">
              Lên lịch <span class="highlight-date">09:00 ngày 28/1</span> sau khi bạn duyệt.
            </p>
          </div>

          <div class="chip-group">
            <button type="button" id="btn-duyet" class="chip-btn" data-testid="btn-duyet">Duyệt</button>
            <button type="button" class="chip-btn">Từ chối</button>
            <button type="button" class="chip-btn">Sửa</button>
          </div>
          <span class="msg-time--inline">13:50</span>
        </div>
      </div>
    `;

    dynamicArea.insertAdjacentHTML("beforeend", finalHTML);
    scrollToBottom();

    activeTimer = setTimeout(() => {
      const btnDuyet = document.getElementById("btn-duyet");
      if (!btnDuyet) return;
      const btnRect = btnDuyet.getBoundingClientRect();

      cursor.style.opacity = "1";
      cursor.style.top = `${btnRect.top + btnRect.height / 2}px`;
      cursor.style.left = `${btnRect.left + btnRect.width / 2}px`;

      activeTimer = setTimeout(() => {
        btnDuyet.style.transform = "scale(0.95)";
        btnDuyet.style.backgroundColor = "#f0f9ff";
        btnDuyet.style.borderColor = "#bae6fd";

        activeTimer = setTimeout(() => {
          btnDuyet.style.transform = "";
          btnDuyet.style.backgroundColor = "";
          btnDuyet.style.borderColor = "";

          const approvedHTML = `
            <div class="msg-row msg-row--center fade-in">
              <span class="approved-chip">Bạn đã duyệt lịch đăng này</span>
            </div>
          `;
          dynamicArea.insertAdjacentHTML("beforeend", approvedHTML);
          scrollToBottom();

          activeTimer = setTimeout(() => {
            cursor.style.opacity = "0";
            activeTimer = setTimeout(showSchedulingProgress, 600);
          }, 500);
        }, 180);
      }, 1300);
    }, 1000);
  }

  function showSchedulingProgress() {
    const botProgressId2 = "bot-progress-box-2";
    const progressHTML = `
      <div class="msg-row fade-in" id="${botProgressId2}" style="margin-top: 0.5rem;">
        <div class="avatar avatar--md">TL</div>
        <div class="progress-card">
          <div class="progress-header">
            <div class="progress-status">
              <span class="status-dot-wrap">
                <span class="status-ping"></span>
                <span class="status-dot"></span>
              </span>
              <span class="progress-title">Đang xử lý</span>
            </div>
            <span class="progress-count" id="progress-count-2">1/2</span>
          </div>

          <div class="progress-steps">
            <div class="progress-line-bg"></div>
            <div class="progress-line-active" id="progress-line-active-2" style="height: 0%;"></div>

            <div class="progress-step progress-step--active" id="step2-1">
              <div class="step-icon step-icon--done">${CHECK_ICON}</div>
              <div><span class="step-label">Đồng bộ với hệ thống</span></div>
            </div>

            <div class="progress-step" id="step2-2">
              <div class="step-icon step-icon--pending" id="icon2-2">
                <svg class="icon-gray" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <span class="step-label" id="text2-2">Đang thiết lập thời gian...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    dynamicArea.insertAdjacentHTML("beforeend", progressHTML);
    scrollToBottom();

    const steps = 2;
    const activeLine = document.getElementById("progress-line-active-2");
    const countText = document.getElementById("progress-count-2");

    function activateStep2(stepNum) {
      const stepEl = document.getElementById(`step2-${stepNum}`);
      if (!stepEl) return;
      stepEl.classList.add("progress-step--active");

      if (stepNum > 1) {
        const iconBg = document.getElementById(`icon2-${stepNum}`);
        if (iconBg) {
          iconBg.classList.remove("step-icon--pending");
          iconBg.classList.add("step-icon--loading");
          iconBg.querySelector("svg").classList.remove("icon-gray");
          iconBg.querySelector("svg").classList.add("icon-sky");
          const text2 = document.getElementById("text2-2");
          text2.classList.add("step-label--active");
          text2.innerText = "Đã lên lịch xong";
        }
      }

      countText.innerText = `${stepNum}/${steps}`;
      activeLine.style.height = `${(stepNum - 1) * 100}%`;
      scrollToBottom();

      if (stepNum < steps) {
        activeTimer = setTimeout(() => activateStep2(stepNum + 1), 1200);
      } else {
        activeTimer = setTimeout(() => {
          const progressBox = document.getElementById(botProgressId2);
          if (progressBox) progressBox.style.display = "none";
          showFinalScheduledMessage();
        }, 1000);
      }
    }

    activateStep2(1);
  }

  function showFinalScheduledMessage() {
    const finalHTML = `
      <div class="msg-row fade-in">
        <div class="avatar avatar--md">TL</div>
        <div class="bubble--agent-col">
          <div class="bubble bubble--agent bubble--agent-lg">
            <p class="agent-label">Trợ Lý</p>
            <p class="result-body">
              Tuyệt vời! Tôi đã lên lịch thành công cho bài viết này vào lúc
              <span class="highlight-date">09:00 ngày 28/1</span>. 🚀
            </p>
          </div>
          <span class="msg-time--inline">13:51</span>
        </div>
      </div>
    `;

    dynamicArea.insertAdjacentHTML("beforeend", finalHTML);
    scrollToBottom();
  }

  startSimulation();
});

"use client";

import { useEffect, useRef, useState } from "react";
import { joinWaitlist } from "@/lib/api/waitlist";
import "./LandingPage.css";

interface LocalWaitlistFormProps {
  showToast: () => void;
}

function LocalWaitlistForm({ showToast }: LocalWaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const result = await joinWaitlist(email);
      if (result.ok) {
        setStatus("success");
        setEmail("");
        showToast();
      } else {
        setStatus("error");
        alert(result.error ?? "Không gửi được, thử lại sau");
      }
    } catch {
      setStatus("error");
      alert("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="ban@email.com"
        className="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "submitting"}
      />
      <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Nhận thông báo"}
      </button>
    </form>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeLinks: Record<string, string[]> = {
    "node-user": ["link-user-room"],
    "node-room": ["link-user-room", "link-room-agents"],
    "node-agents": ["link-room-agents", "link-agents-platforms", "link-agents-drives"],
    "node-platforms": ["link-agents-platforms"],
    "node-drives": ["link-agents-drives"],
  };

  const isLinkActive = (linkId: string) => {
    if (!hoveredNode) return false;
    return activeLinks[hoveredNode]?.includes(linkId) ?? false;
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  const handlePlayPause = () => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe?.contentWindow;
    if (!iframeWindow) return;

    const win = iframeWindow as any;

    if (typeof win.isFinished === "function" && win.isFinished()) {
      if (typeof win.resetSimulation === "function") {
        win.resetSimulation();
        setIsPlaying(true);
      }
    } else if (typeof win.isPaused === "function" && win.isPaused()) {
      if (typeof win.resumeSimulation === "function") {
        win.resumeSimulation();
        setIsPlaying(true);
      }
    } else {
      if (typeof win.pauseSimulation === "function") {
        win.pauseSimulation();
        setIsPlaying(false);
      }
    }
  };

  // Sync state with simulator notifications
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const win = window as any;
    win.onSimulationFinished = () => {
      setIsPlaying(false);
    };
    win.onSimulationReset = () => {
      setIsPlaying(true);
    };
    win.onSimulationPaused = () => {
      setIsPlaying(false);
    };
    win.onSimulationResumed = () => {
      setIsPlaying(true);
    };

    return () => {
      window.removeEventListener("scroll", handleScroll);
      delete win.onSimulationFinished;
      delete win.onSimulationReset;
      delete win.onSimulationPaused;
      delete win.onSimulationResumed;
    };
  }, []);

  return (
    <>
    {/* Navigation Header */}
    <header className={`navbar glass-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#" className="logo">
          <div className="logo-icon">A</div>
          <span>Aucobot</span>
        </a>
        <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <li><a href="#problem" className="nav-link">Vấn đề</a></li>
          <li><a href="#features" className="nav-link">Tính năng</a></li>
          <li><a href="#roadmap" className="nav-link">Tiến độ</a></li>
          <li><a href="#community" className="nav-link">Cộng đồng</a></li>
          <li><a href="#faq" className="nav-link">FAQ</a></li>
        </ul>
        <div className="nav-actions">
          <span className="badge-live">Đang xây dựng công khai</span>
          <a
            href="#cta"
            className="btn btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
            >Nhận thông báo</a
          >
        </div>
        <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu Toggle">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>

    {/* Hero Section */}
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="section-tag">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Build in Public
        </span>
        <h1 className="hero-title">
          Xây dựng <span className="hero-title-accent">Phòng Marketing AI</span> của
          riêng bạn
        </h1>
        <p className="hero-subtitle">
          Không phải một chatbot. Một phòng marketing AI thật sự — nghiên cứu,
          viết nội dung, lên lịch và đăng bài thay bạn trên Facebook & TikTok.
        </p>

        <div className="hero-form-container">
          <LocalWaitlistForm showToast={showToast} />
          <p className="form-tip">
            Để lại email — nhận thông báo khi MVP mở, và là người trải nghiệm
            đầu tiên.
          </p>
        </div>

        <div className="hero-actions">
          <a href="#demo" className="demo-btn-link">
            <span>Xem AI làm việc ngay</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="7 13 12 18 17 13" />
              <line x1="12" y1="6" x2="12" y2="18" />
            </svg>
          </a>
        </div>
      </div>
      {/* Chatbot UI Simulator Mockup */}
      <div className="hero-visual" id="demo">
        <div className="mockup-header">
          <div className="macbook-dots">
            <span className="dot-red"></span>
            <span className="dot-yellow"></span>
            <span className="dot-green"></span>
          </div>
          <div className="mockup-title">Chat Simulator</div>
          
        <button className="play-pause-btn" onClick={handlePlayPause} aria-label="Play or Pause Simulation">
          <svg className={`icon-play ${isPlaying ? "hidden" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <svg className={`icon-pause ${!isPlaying ? "hidden" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>

        </div>
        <iframe ref={iframeRef}
          src="/chat-simulator/index.html"
          id="simulator-iframe"
          className="simulator-frame border-none"
          scrolling="no"
        ></iframe>
      </div>
    </section>

    {/* Problem Section */}
    <section id="problem">
      <div className="problem-grid">
        <div>
          <span className="section-tag">Thách thức</span>
          <h2 className="section-title">Marketing ngày nay quá rời rạc</h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            Mỗi việc một công cụ. Bạn là người phải liên tục mở các tab khác
            nhau, copy qua lại và tự tay kết nối tất cả chúng.
          </p>
          <div
            style={{ borderLeft: "2px solid var(--color-primary)", paddingLeft: "1.5rem", marginBottom: "2rem" }}
          >
            <p
              style={{ fontSize: "1rem", color: "var(--color-text-main)", fontWeight: "600", marginBottom: "0.5rem" }}
            >
              Bạn phải tự kết nối tất cả.
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
              Aucobot sinh ra để thay đổi điều đó bằng cách tự động hóa toàn bộ
              quy trình phối hợp.
            </p>
          </div>
        </div>

        <div className="problem-cards">
          <div className="problem-card">
            <div className="problem-card-icon">🤖</div>
            <h3 className="problem-card-title">ChatGPT để viết</h3>
            <p className="problem-card-desc">
              Tạo ý tưởng và bài viết nháp thô sơ, chưa tối ưu nền tảng.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">🎨</div>
            <h3 className="problem-card-title">Canva để thiết kế</h3>
            <p className="problem-card-desc">
              Thiết kế ảnh thủ công, tự căn chỉnh kích thước và kéo thả.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">👥</div>
            <h3 className="problem-card-title">Facebook để đăng</h3>
            <p className="problem-card-desc">
              Mở fanpage, copy bài đăng, tải ảnh lên và cấu hình thủ công.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">🎵</div>
            <h3 className="problem-card-title">TikTok để đăng</h3>
            <p className="problem-card-desc">
              Tải video, chèn nhạc xu hướng, gõ hashtag và lên lịch.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">📁</div>
            <h3 className="problem-card-title">Google Drive</h3>
            <p className="problem-card-desc">
              Đọc tài liệu thương hiệu, lấy dữ liệu sản phẩm thô.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">📓</div>
            <h3 className="problem-card-title">Notion</h3>
            <p className="problem-card-desc">
              Lưu trữ kiến thức, quy trình làm việc và lịch biên tập.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Solution Section */}
    <section id="solution">
      <div
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span className="section-tag">Giải pháp</span>
        <h2 className="section-title">Một phòng — cả team AI phối hợp</h2>
        <p className="section-subtitle">
          Bạn không phải đối thoại với từng chatbot riêng lẻ. Aucobot kết nối
          tất cả các tác vụ và công cụ lại với nhau thành một luồng xử lý mượt
          mà.
        </p>
      </div>

      <div className="solution-flow-container">
        {/* SVG Flow Diagram */}
        <svg
          className="flow-diagram-svg"
          viewBox="0 0 800 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Links (Paths) */}
          {/* User to Marketing Room */}
          <path id="link-user-room" className={`flow-link ${isLinkActive("link-user-room") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-user-room") ? "2.5px" : "1.5px" }} d="M120 175 H 280" />
          {/* Marketing Room internal loop/expansion visual */}
          <path id="link-room-agents" className={`flow-link ${isLinkActive("link-room-agents") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-room-agents") ? "2.5px" : "1.5px" }} d="M380 175 H 480" />
          {/* Agents to Platforms & Drive */}
          <path
            id="link-agents-platforms"
            className="flow-link"
            d="M580 175 C 620 175, 630 110, 680 110"
          />
          <path
            id="link-agents-platforms-2"
            className="flow-link"
            d="M580 175 C 620 175, 630 180, 680 180"
          />
          <path
            id="link-agents-drives"
            className="flow-link"
            d="M580 175 C 620 175, 630 250, 680 250"
          />

          {/* Nodes */}
          {/* User Node */}
          <g id="node-user" onMouseEnter={() => setHoveredNode("node-user")} onMouseLeave={() => setHoveredNode(null)} className="flow-node user">
            <circle cx="80" cy="175" r="40" />
            <text x="80" y="172" fontSize="12" fontWeight="bold">BẠN</text>
            <text x="80" y="188" fontSize="9" fill="var(--color-text-muted)">
              Duyệt & Ra Lệnh
            </text>
          </g>

          {/* Center Room Node */}
          <g id="node-room" onMouseEnter={() => setHoveredNode("node-room")} onMouseLeave={() => setHoveredNode(null)} className="flow-node center-room">
            <rect x="240" y="130" width="140" height="90" rx="16" />
            <text
              x="310"
              y="170"
              fontSize="13"
              fontWeight="bold"
              fill="var(--color-primary)"
            >
              Marketing Room
            </text>
            <text x="310" y="190" fontSize="9" fill="var(--color-text-muted)">
              Đầu não tự động hóa
            </text>
          </g>

          {/* Agents Sub-System Node */}
          <g id="node-agents" onMouseEnter={() => setHoveredNode("node-agents")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="480" y="110" width="100" height="130" rx="16" />
            <text
              x="530"
              y="140"
              fontSize="11"
              fontWeight="bold"
              fill="var(--color-text-main)"
            >
              Content AI
            </text>
            <text
              x="530"
              y="165"
              fontSize="11"
              fontWeight="bold"
              fill="var(--color-text-main)"
            >
              Research AI
            </text>
            <text
              x="530"
              y="190"
              fontSize="11"
              fontWeight="bold"
              fill="var(--color-text-main)"
            >
              Designer AI
            </text>
            <text
              x="530"
              y="215"
              fontSize="11"
              fontWeight="bold"
              fill="var(--color-text-main)"
            >
              Publisher AI
            </text>
          </g>

          {/* Platforms Outputs */}
          {/* Facebook Node */}
          <g id="node-platforms" onMouseEnter={() => setHoveredNode("node-platforms")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="680" y="80" width="90" height="45" rx="8" />
            <text x="725" y="106" fontSize="11" fontWeight="bold">
              Facebook
            </text>
          </g>
          {/* TikTok Node */}
          <g id="node-platforms-2" className="flow-node">
            <rect x="680" y="155" width="90" height="45" rx="8" />
            <text x="725" y="181" fontSize="11" fontWeight="bold">
              TikTok
            </text>
          </g>
          {/* Drive Node */}
          <g id="node-drives" onMouseEnter={() => setHoveredNode("node-drives")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="680" y="230" width="90" height="45" rx="8" />
            <text x="725" y="256" fontSize="11" fontWeight="bold">
              Google Drive
            </text>
          </g>
        </svg>
      </div>
    </section>

    {/* Features Section */}
    <section id="features">
      <div
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span className="section-tag">Tính năng chính</span>
        <h2 className="section-title">Không phải một chatbot — một phòng ban</h2>
        <p className="section-subtitle">
          Chúng tôi tái định nghĩa cách thức bạn làm việc với trí tuệ nhân tạo.
          Dưới đây là cách mà Aucobot vận hành.
        </p>
      </div>

      <div className="features-grid">
        {/* Feature 1 */}
        <div className="feature-card">
          <span className="feature-num">01</span>
          <div className="feature-icon-wrapper">🚀</div>
          <h3 className="feature-title">Dựng phòng marketing AI trong vài phút</h3>
          <p className="feature-desc">
            Chỉ cần tạo không gian làm việc, mô tả ngắn gọn về thương hiệu và
            mục tiêu, các AI Agent sẽ lập tức tự động thiết lập sơ đồ làm việc.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="feature-card">
          <span className="feature-num">02</span>
          <div className="feature-icon-wrapper">🔗</div>
          <h3 className="feature-title">Kết nối công cụ của bạn</h3>
          <p className="feature-desc">
            Liên kết tài khoản Facebook, TikTok, Google Drive, Notion... của bạn
            chỉ một lần duy nhất, dữ liệu và lịch trình sẽ tự động đồng bộ.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="feature-card">
          <span className="feature-num">03</span>
          <div className="feature-icon-wrapper">🤝</div>
          <h3 className="feature-title">Nhiều AI phối hợp như một team</h3>
          <p className="feature-desc">
            Không hoạt động đơn độc. Các Agent Content, Research và Publisher
            giao tiếp, trao đổi phản hồi và sửa bài chéo cho nhau.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="feature-card">
          <span className="feature-num">04</span>
          <div className="feature-icon-wrapper">🛡️</div>
          <h3 className="feature-title">Bạn luôn duyệt cuối</h3>
          <p className="feature-desc">
            Hệ thống đảm bảo tính an toàn thương hiệu. AI không bao giờ tự ý
            đăng bài lên mạng xã hội khi chưa nhận được cái gật đầu từ bạn.
          </p>
        </div>
        {/* Feature 5 */}
        <div className="feature-card">
          <span className="feature-num">05</span>
          <div className="feature-icon-wrapper">🧠</div>
          <h3 className="feature-title">AI nhớ thương hiệu của bạn</h3>
          <p className="feature-desc">
            Ghi nhớ tone giọng, quy định viết tắt, đối thủ cạnh tranh hay định
            hướng thiết kế. Không cần nhắc lại yêu cầu trong mỗi phiên trò
            chuyện.
          </p>
        </div>
      </div>
    </section>

    {/* Build in Public Section */}
    <section id="roadmap">
      <span className="section-tag">Xây dựng công khai</span>
      <h2 className="section-title">Dự án đang sống — theo dõi tiến độ thật</h2>
      <p className="section-subtitle">
        Chúng tôi không đưa ra cam kết ảo. Dưới đây là tiến trình phát triển và
        hoàn thiện trực tiếp từ đội ngũ phát triển sản phẩm.
      </p>

      <div className="public-grid">
        {/* Left Side: Circular Progress Gauge & Status */}
        <div className="public-dashboard">
          <div className="progress-circle-container">
            <svg className="progress-svg" width="180" height="180">
              <circle className="progress-bg" cx="90" cy="90" r="80" />
              <circle className="progress-bar-fill" cx="90" cy="90" r="80" />
            </svg>
            <div className="progress-value">
              <span className="progress-number">50%</span>
              <span className="progress-label">Tiến độ MVP</span>
            </div>
          </div>

          <div className="dashboard-status">
            <h3 className="status-title">Đang triển khai</h3>
            <ul className="status-list">
              <li className="status-item">
                <span className="status-icon-ok">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Tin nhắn & AI trả lời (LLM vào chat)</span>
              </li>
              <li className="status-item">
                <span className="status-icon-pending"></span>
                <span>Chuẩn bị hệ thống Facebook OAuth</span>
              </li>
            </ul>
            <p className="update-date">Cập nhật gần nhất: 2 Tháng 7, 2026</p>
          </div>
        </div>

        {/* Right Side: Phases Timeline */}
        <div className="timeline-container">
          {/* Phase 1 */}
          <div className="timeline-phase completed">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 1 — Nền tảng</h3>
              <span className="phase-badge completed">Hoàn thành</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Khung sản phẩm chạy được</p>
              <ul className="phase-items">
                <li className="phase-item">Xác thực (OTP email + Google)</li>
                <li className="phase-item">Phòng Marketing (Room / Session)</li>
                <li className="phase-item">Giao diện chat kiểu Telegram</li>
                <li className="phase-item">Bật/tắt feature qua config</li>
              </ul>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="timeline-phase active">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 2 — AI & Kết nối</h3>
              <span className="phase-badge active">Đang thực hiện</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Agent thật sự làm việc</p>
              <ul className="phase-items">
                <li className="phase-item">Tin nhắn & AI trả lời</li>
                <li className="phase-item">Duyệt bài (Human approval)</li>
                <li className="phase-item">Facebook</li>
                <li className="phase-item">TikTok</li>
              </ul>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="timeline-phase">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 3 — Tự động hóa</h3>
              <span className="phase-badge upcoming">Kế hoạch</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Chạy thay bạn</p>
              <ul className="phase-items">
                <li className="phase-item">Lên lịch & đăng bài tự động</li>
                <li className="phase-item">Bot / Workflow (Agent xây hộ)</li>
                <li className="phase-item">Long-term memory thương hiệu</li>
              </ul>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="timeline-phase">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 4 — Mở rộng</h3>
              <span className="phase-badge upcoming">Kế hoạch</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Super app cộng tác</p>
              <ul className="phase-items">
                <li className="phase-item">Mời đồng nghiệp + phân quyền</li>
                <li className="phase-item">Marketplace agent</li>
                <li className="phase-item">Community agent</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Release Tracker */}
        <div className="release-track">
          <span className="track-title">Lộ trình phát hành:</span>
          <div className="track-steps">
            <div className="track-step done">
              <div className="track-dot"></div>
              <span className="track-label">Ý tưởng</span>
            </div>
            <div className="track-step done">
              <div className="track-dot"></div>
              <span className="track-label">Kiến trúc</span>
            </div>
            <div className="track-step current">
              <div className="track-dot"></div>
              <span className="track-label">MVP</span>
            </div>
            <div className="track-step hollow">
              <div className="track-dot"></div>
              <span className="track-label">Private Alpha</span>
            </div>
            <div className="track-step hollow">
              <div className="track-dot"></div>
              <span className="track-label">Closed Beta</span>
            </div>
            <div className="track-step hollow">
              <div className="track-dot"></div>
              <span className="track-label">Public Beta</span>
            </div>
            <div className="track-step hollow">
              <div className="track-dot"></div>
              <span className="track-label">Ra mắt</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Tech specs / Architecture Section */}
    <section id="architecture">
      <span className="section-tag">Dành cho dân kỹ thuật</span>
      <div className="architecture-container">
        <div className="arch-header">
          <div className="arch-header-left">
            <h2 className="arch-header-title">Kiến trúc đa Agent tối tân</h2>
            <p className="arch-header-desc">
              Hệ thống sử dụng cơ chế Multi-agent điều phối thông qua
              Orchestrator trung tâm, tích hợp các công cụ giao tiếp chuẩn MCP
              (Model Context Protocol) và đặt con người ở vòng kiểm duyệt cuối
              (Human-in-the-loop).
            </p>
          </div>
          <a
            href="#"
            className="btn btn-secondary"
            onClick={(e) => { e.preventDefault(); alert('Tài liệu kiến trúc chi tiết sắp ra mắt cùng với bản Private Alpha!'); }}
            >Tài liệu kiến trúc (Sắp có)</a
          >
        </div>

        <div className="arch-visual-container">
          {/* SVG Tech Flow */}
          <svg
            width="600"
            height="150"
            viewBox="0 0 600 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="50"
              width="80"
              height="50"
              rx="6"
              fill="#f1f5f9"
              stroke="#cbd5e1"
            />
            <text
              x="50"
              y="80"
              fill="#0f172a"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              User
            </text>

            <path
              d="M90 75 H 140"
              stroke="#4f46e5"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />

            <rect
              x="140"
              y="30"
              width="100"
              height="90"
              rx="8"
              fill="rgba(79, 70, 229, 0.08)"
              stroke="#4f46e5"
              strokeWidth="1.5"
            />
            <text
              x="190"
              y="80"
              fill="#4f46e5"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Orchestrator
            </text>

            <path
              d="M240 60 H 290"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <path
              d="M240 90 H 290"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            <rect
              x="290"
              y="20"
              width="90"
              height="40"
              rx="6"
              fill="#f1f5f9"
              stroke="#cbd5e1"
            />
            <text
              x="335"
              y="44"
              fill="#334155"
              fontSize="10"
              textAnchor="middle"
            >
              Content Agent
            </text>

            <rect
              x="290"
              y="90"
              width="90"
              height="40"
              rx="6"
              fill="#f1f5f9"
              stroke="#cbd5e1"
            />
            <text
              x="335"
              y="114"
              fill="#334155"
              fontSize="10"
              textAnchor="middle"
            >
              Publisher Agent
            </text>

            <path
              d="M380 40 H 420"
              stroke="#059669"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <path
              d="M380 110 H 420"
              stroke="#059669"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            <rect
              x="420"
              y="55"
              width="60"
              height="40"
              rx="6"
              fill="rgba(5, 150, 105, 0.08)"
              stroke="#059669"
            />
            <text
              x="450"
              y="79"
              fill="#059669"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              MCP
            </text>

            <path
              d="M480 75 H 510"
              stroke="#d97706"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            <rect
              x="510"
              y="35"
              width="80"
              height="80"
              rx="8"
              fill="#f8fafc"
              stroke="#cbd5e1"
            />
            <text
              x="550"
              y="70"
              fill="#0f172a"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              Facebook /
            </text>
            <text
              x="550"
              y="85"
              fill="#0f172a"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              TikTok API
            </text>

            {/* Markers */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </section>

    {/* Community Section */}
    
    <section id="community">
      <div
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span className="section-tag">Cộng đồng</span>
        <h2 className="section-title">Tham gia từ những ngày đầu</h2>
        <p className="section-subtitle">
          Chúng tôi xây dựng sản phẩm công khai cùng cộng đồng. Đóng góp ý kiến
          của bạn, theo dõi tiến độ cập nhật từng giờ và là người đầu tiên trải
          nghiệm MVP.
        </p>
      </div>

      <div className="community-grid">
        {/* Discord */}
        <a
          href="#"
          className="community-card"
          onClick={(e) => {
            e.preventDefault();
            alert('Cổng kết nối Discord đang được thiết lập và sẽ mở trong giai đoạn Private Alpha.');
          }}
        >
          <div className="community-card-icon">💬</div>
          <h3 className="community-card-title">Discord</h3>
          <p className="community-card-desc">
            Kênh thảo luận, góp ý tính năng, báo lỗi và giao lưu cùng đội ngũ
            xây dựng.
          </p>
          <span className="community-card-badge">Sắp có</span>
        </a>
        {/* Twitter */}
        <a
          href="#"
          className="community-card"
          onClick={(e) => {
            e.preventDefault();
            alert('Kênh X (Twitter) của dự án sẽ hoạt động cùng thời điểm ra mắt MVP.');
          }}
        >
          <div className="community-card-icon">🐦</div>
          <h3 className="community-card-title">X (Twitter)</h3>
          <p className="community-card-desc">
            Cập nhật tin tức nhanh, những dòng code đầu tiên và suy nghĩ của
            founder.
          </p>
          <span className="community-card-badge">Sắp có</span>
        </a>
        {/* GitHub */}
        <a
          href="#"
          className="community-card"
          onClick={(e) => {
            e.preventDefault();
            alert('Repository của Aucobot sẽ mở mã nguồn mở ở một số phân hệ lõi sau khi hoàn thành MVP.');
          }}
        >
          <div className="community-card-icon">🐙</div>
          <h3 className="community-card-title">GitHub</h3>
          <p className="community-card-desc">
            Dành cho lập trình viên muốn nghiên cứu kiến trúc MCP hoặc viết
            Agent extension.
          </p>
          <span className="community-card-badge">Sắp có</span>
        </a>
      </div>
    </section>


    {/* Call to Action (CTA) Section */}
    <section id="cta">
      <div className="cta-block">
        <h2 className="cta-title">Là người đầu tiên trải nghiệm</h2>
        <p className="cta-desc">
          Để lại email của bạn — chúng tôi sẽ lập tức thông báo ngay khi cổng
          đăng ký trải nghiệm MVP mở cửa.
        </p>
        <div className="cta-form-container">
          <LocalWaitlistForm showToast={showToast} />
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    
    <section id="faq">
      <div
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span className="section-tag">Giải đáp thắc mắc</span>
        <h2 className="section-title">Câu hỏi thường gặp</h2>
        <p className="section-subtitle">
          Một số thắc mắc phổ biến về mô hình hoạt động và lộ trình của Aucobot.
        </p>
      </div>

      <div className="faq-grid">
        {[
          {
            q: "AI có tự ý đăng bài không?",
            a: "Không. Bạn luôn giữ quyền quyết định cao nhất (Human-in-the-loop). AI sẽ tạo nội dung nháp, lập lịch biểu, thiết kế và gửi yêu cầu phê duyệt tới bạn. Chỉ khi bạn nhấn nút \"Duyệt\", bài đăng mới được phân phối chính thức lên các nền tảng mạng xã hội."
          },
          {
            q: "Có hỗ trợ đăng bài lên TikTok không?",
            a: "Có. Aucobot tích hợp trực tiếp API đăng tải của TikTok thông qua kết nối OAuth chính thức, hỗ trợ tự động chèn nhạc xu hướng và đồng bộ hashtag phù hợp với video thương hiệu của bạn."
          },
          {
            q: "Ứng dụng có hoàn toàn miễn phí không?",
            a: "Chúng tôi sẽ mở cửa thử nghiệm hoàn toàn miễn phí (Free Beta) cho 500 thành viên đầu tiên đăng ký nhận thông báo để thu thập ý kiến đóng góp. Khi chính thức ra mắt, sản phẩm sẽ có gói cơ bản và gói cao cấp tùy thuộc vào tần suất đăng tải và số lượng Agent bạn cấu hình."
          },
          {
            q: "Khi nào mở thử nghiệm Beta?",
            a: "Theo lộ trình xây dựng công khai, bản MVP nội bộ sẽ hoàn thành trong vòng vài tuần tới. Sau khi kết nối xong các hạ tầng OAuth và kiểm duyệt từ Facebook & TikTok, bản Closed Beta sẽ được mở cho những người dùng đã để lại email đăng ký trên trang này."
          }
        ].map((item, idx) => (
          <div key={idx} className={`faq-item ${activeFaq === idx ? "active" : ""}`}>
            <div className="faq-question" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
              <span>{item.q}</span>
              <span className="faq-toggle-icon">{activeFaq === idx ? "-" : "+"}</span>
            </div>
            <div 
              className="faq-answer" 
              style={{ 
                maxHeight: activeFaq === idx ? "200px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s ease-out" 
              }}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>


    {/* Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-desc">
            <a href="#" className="logo">
              <div className="logo-icon">A</div>
              <span>Aucobot</span>
            </a>
            <p>
              Hệ thống tự động hóa marketing thế hệ mới, thay thế quy trình rời
              rạc bằng sức mạnh của sự kết hợp đa tác nhân thông minh.
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <span className="footer-col-title">Sản phẩm</span>
              <a href="#features" className="footer-link">Tính năng</a>
              <a href="#problem" className="footer-link">Giải pháp</a>
              <a href="#architecture" className="footer-link">Kiến trúc</a>
            </div>
            <div className="footer-links-col">
              <span className="footer-col-title">Dự án</span>
              <a href="#roadmap" className="footer-link">Tiến độ MVP</a>
              <a href="#community" className="footer-link">Cộng đồng</a>
              <a href="#cta" className="footer-link">Nhận thông báo</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span
            >© 2026 Aucobot · Xây dựng phòng marketing ảo của riêng bạn</span
          >
          <span>Thiết kế bởi Antigravity AI</span>
        </div>
      </div>
    </footer>

    {/* Script Source */}
    <script type="module" src="app.js"></script>
      
      {/* Toast Notification */}
      <div className={`toast-msg ${toastVisible ? "show" : ""}`}>
        ✨ Đăng ký nhận thông báo thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.
      </div>
    </>
  );
}

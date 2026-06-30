# `app/setup/`

Wizard setup **tối giản** — form gửi API, không wizard logic trên client.

## Planned

- `page.tsx` + `_components/ClientSetupPage/`
- Steps: brand kit, kết nối FB/TikTok (redirect OAuth), chọn agent preset.
- Mỗi step: `POST` API → chờ response → bước tiếp (hoặc chat-guided sau).

## API (planned)

- `POST /api/departments`
- `POST /api/departments/:id/setup/complete`

Xem `aucobot-architecture.md` — Agent setup wizard.

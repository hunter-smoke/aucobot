import type { ApprovalStatus, InlineAction } from "@/types/chat";

/** Nút mặc định: Duyệt · Từ chối · Sửa */
export const DEFAULT_APPROVAL_ACTIONS: InlineAction[] = [
  { id: "approve", label: "Duyệt" },
  { id: "reject", label: "Từ chối" },
  { id: "edit", label: "Sửa" },
];

export function resolvedApprovalLabel(status: ApprovalStatus): string {
  switch (status) {
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Đã từ chối";
    case "expired":
      return "Hết hạn";
    default:
      return "";
  }
}

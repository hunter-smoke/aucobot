"use client";

import { useCallback, useEffect, useState } from "react";

import {
  parseDepartmentIdFromHash,
  toDepartmentHash,
} from "@/utils/chat/department-hash";

export function useDepartmentIdFromHash() {
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setDepartmentId(parseDepartmentIdFromHash(window.location.hash));
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const openDepartment = useCallback((id: string) => {
    window.location.hash = toDepartmentHash(id);
  }, []);

  const clearDepartment = useCallback(() => {
    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState(null, "", url.pathname + url.search);
    setDepartmentId(null);
  }, []);

  return { departmentId, openDepartment, clearDepartment };
}

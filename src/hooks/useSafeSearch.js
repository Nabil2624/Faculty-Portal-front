import { useMemo } from "react";

export default function useSafeSearch(items = [], search = "", keys = []) {
  return useMemo(() => {
    if (!Array.isArray(items)) return [];

    const query = (search || "").toLowerCase().trim();
    if (!query) return items;

    return items.filter((item) => {
      // تأكد إن كل key موجود قبل التحويل
      return keys.some((key) => {
        const value = item?.[key];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [items, search, keys]);
}

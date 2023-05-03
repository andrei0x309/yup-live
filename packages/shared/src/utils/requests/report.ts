import { fetchWAuth } from "../auth";
import type { IReport } from "../../types/report";
import type { IMainStore } from "../../types/store";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const report = async (store: IMainStore, data: IReport) => {
    try {
        const res = await fetchWAuth(store, `${API_BASE}/report`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

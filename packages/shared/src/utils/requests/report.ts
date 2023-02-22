import { fetchWAuth } from "../auth";
import type { IReport } from "../../types/report";
import type { IMainStore } from "../../types/store";

import { config } from '../config'
const { API_BASE } = config

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

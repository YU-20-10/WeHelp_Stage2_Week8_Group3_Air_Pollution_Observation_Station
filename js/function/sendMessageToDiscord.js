export async function sendMessage(stationData) { 
    try {
        const res = await fetch("/send_message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(stationData)
        });

        const result = await res.json(); 

        if (res.ok) {
            return { "ok": true };
        } else {
            console.error("發送失敗", result);
            return { "ok": false, "error": result };
        }
    } catch (err) {
        console.error("發送過程中出錯", err);
        return { "ok": false, "error": err.message };
    }
}
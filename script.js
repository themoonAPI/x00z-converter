const input = document.getElementById('input');
const btn = document.getElementById('convertBtn');
const status = document.getElementById('status');

function extractAssetId(str) {
    str = str.trim();
    // Handle require(123456) or require("rbxassetid://123456")
    const numMatch = str.match(/\d+/);
    if (numMatch) return numMatch[0];
    return null;
}

async function downloadRBXM(id) {
    if (!id) {
        status.textContent = "❌ Invalid Asset ID";
        status.style.color = "#ff5555";
        return;
    }

    status.textContent = "🔄 Fetching from Roblox...";
    status.style.color = "#00b4ff";

    try {
        const response = await fetch(`/api/proxy?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.rbxm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        status.textContent = `✅ Downloaded ${id}.rbxm`;
        status.style.color = "#00ff9f";
    } catch (err) {
        console.error(err);
        status.textContent = "❌ Failed to fetch (may be private or restricted)";
        status.style.color = "#ff5555";
    }
}

btn.addEventListener('click', () => {
    const id = extractAssetId(input.value);
    downloadRBXM(id);
});

// Enter key support
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const id = extractAssetId(input.value);
        downloadRBXM(id);
    }
});

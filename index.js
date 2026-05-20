// stream-json-repair v1.0.0
// An open-source utility to fix truncated or broken JSON structures from live streams.

function streamJsonRepair(jsonString) {
    jsonString = jsonString.trim();
    if (!jsonString) return {};

    // If it's already valid, parse it directly
    try { return JSON.parse(jsonString); } catch (e) {}

    let stack = [];
    let insideString = false;
    let escaped = false;

    // Track unclosed brackets and braces
    for (let i = 0; i < jsonString.length; i++) {
        let char = jsonString[i];
        if (escaped) { escaped = false; continue; }
        if (char === '\\') { escaped = true; continue; }
        if (char === '"') { insideString = !insideString; continue; }
        
        if (!insideString) {
            if (char === '{' || char === '[') stack.push(char);
            if (char === '}' || char === ']') stack.pop();
        }
    }

    // Automatically close any dangling structures caused by stream cuts
    while (stack.length > 0) {
        let last = stack.pop();
        if (last === '{') jsonString += '}';
        if (last === '[') jsonString += ']';
    }

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // Fallback fallback: strip trailing partial keys/commas if still broken
        jsonString = jsonString.replace(/,\s*$/, "").replace(/,\s*[}\]]*$/, "");
        try { return JSON.parse(jsonString + '}'); } catch (err) { return {}; }
    }
}

export default streamJsonRepair;

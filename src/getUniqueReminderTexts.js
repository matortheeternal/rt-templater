function extractLineReminders(line) {
    const results = [];
    let depth = 0;
    let before = '';
    let current = '';

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (depth === 0 && ch !== '(') before += ch;
        if (depth > 0 && ch !== ')') current += ch;

        if (ch === '(') {
            if (depth > 0) return [];
            depth++;
        } else if (ch === ')') {
            depth--;
            if (results.length > 0) return [];
            results.push({ before, current });
            before = '';
            current = '';
        }
    }
    return results;
}

function isUnsetCard(card) {
    return card.set_type === 'funny'
        || card.set_type === 'memorabilia'
        || card.set === 'mb2';
}

function updateTokenCount(entry, token) {
    entry.beforeTokens[token] = (entry.beforeTokens[token] || 0) + 1;
}

export function getUniqueReminderTexts(cards) {
    const map = {};

    for (const card of cards) {
        if (!card.oracle_text) continue;
        if (isUnsetCard(card)) continue;
        const keywords = Array.isArray(card.keywords)
            ? card.keywords.map((k) => k.toLowerCase())
            : [];
        const lines = card.oracle_text.split('\n').filter(Boolean);
        const reminders = lines.flatMap(line => extractLineReminders(line));

        for (const group of reminders) {
            const entry = map[group.current] ||= {
                count: 0,
                beforeTokens: {},
                keywords: {}
            };

            entry.count++;
            group.before.toLowerCase().split(/[".,:—\s]+/)
                .filter(Boolean)
                .forEach(token => updateTokenCount(entry, token));

            keywords.forEach(kw => {
                entry.keywords[kw] = (entry.keywords[kw] || 0) + 1;
            });
        }
    }
    return map;
}

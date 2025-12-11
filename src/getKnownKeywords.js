import fs from 'fs';

const dictionary = new Map();

const exclude = ['Ability'];

function buildKeywordTokensDictionary(keywords) {
    keywords.forEach(kw => {
        kw.toLowerCase().split(' ').forEach(token => {
            if (!dictionary.has(token))
                dictionary.set(token, []);
            dictionary.get(token).push(kw);
        });
    });
}

export function loadKnownKeywords(cards) {
    const set = new Set();
    cards.forEach(card => {
        card.keywords.forEach(kw => {
            set.add(kw);
        });
    });

    const output = [...set].sort().filter(kw => !exclude.includes(kw));
    buildKeywordTokensDictionary(output);
    fs.writeFileSync('input/knownKeywords.json', JSON.stringify(output, null, 2));
}

export function getMatchedKeywords(src, tokens) {
    const cutoff = src.count * 0.8;

    const results = {};
    for (const [token, count] of tokens) {
        if (count < cutoff) continue;
        const possibleKeywords = dictionary.get(token) || [];
        possibleKeywords.forEach(kw => {
            results[kw] = (results[kw] || 0) + 1;
        });
    }

    return Object.keys(results).filter(kw => {
        return results[kw] === kw.split(' ').length;
    });
}

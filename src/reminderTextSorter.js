import fs from 'fs';
import { stopWords } from './stopWords.js';
import { getMatchedKeywords } from './getKnownKeywords.js';

const twoOrLess = {};
const reminderTexts = {};
const kwReminderTexts = {};
const noTokens = {};
const MIN_PERCENT = 0.8;

function getTarget(src) {
    if (src.matchedKeywords.length === 1) return kwReminderTexts;
    if (src.count <= 2) return twoOrLess
    if (Object.keys(src.bestBeforeTokens).length === 0) return noTokens;
    return reminderTexts;
}

export function organizeReminderTexts(map) {
    Object.keys(map).sort().forEach(key => {
        const src = map[key];

        const beforeTokens = Object.entries(src.beforeTokens);
        src.bestBeforeTokens = beforeTokens.reduce((obj, [key, value]) => {
            if (stopWords.includes(key)) return obj;
            if (/{([0-9wubrgxc]|[2wubrgpc]\/[2wubrgpc])}+/i.test(key)) return obj;
            const percent = value / src.count;
            if (percent > MIN_PERCENT) obj[key] = (percent * 100).toFixed(2) + '%';
            return obj;
        }, {});

        const kw = Object.entries(src.keywords);
        src.bestKeywords = kw.reduce((obj, [key, value]) => {
            const percent = value / src.count;
            if (percent > MIN_PERCENT) obj[key] = (percent * 100).toFixed(2) + '%';
            return obj;
        }, {});
        src.matchedKeywords = getMatchedKeywords(src, beforeTokens);

        const target = getTarget(src);
        target[key] = src;
    });

    return { reminderTexts, kwReminderTexts, twoOrLess, noTokens };
}

export function saveExtraOutputs() {
    fs.writeFileSync('output/rt.json', JSON.stringify(reminderTexts, null, 2));
    fs.writeFileSync('output/rt-twoOrLess.json', JSON.stringify(twoOrLess, null, 2));
    fs.writeFileSync('output/rt-noTokens.json', JSON.stringify(noTokens, null, 2));
}

import { mergeNStrings } from './lcs.js';
import { getReplacement } from './replacers/index.js';
import fs from 'fs';

export function buildReminderTextMap(out) {
    const rtMap = {};
    Object.entries(out).forEach(([key, value]) => {
        const tokenKey = Object.keys(value.bestBeforeTokens).join(' ');
        if (!rtMap.hasOwnProperty(tokenKey))
            rtMap[tokenKey] = {
                label: tokenKey,
                count: 0,
                rts: []
            };
        const t = rtMap[tokenKey];
        t.count += value.count;
        t.rts.push({
            text: key,
            count: value.count
        });
    });

    return rtMap;
}

export function mergeTwoOrLess(twoOrLess, rtMap) {
    Object.entries(twoOrLess).forEach(([key, value]) => {
        const tokens = Object.keys(value.bestBeforeTokens);
        if (tokens.length === 0) return;
        if (tokens.length > 2) return;
        const tokenKey = tokens.join(' ');
        if (!rtMap.hasOwnProperty(tokenKey)) {
            if (tokens.length > 1) return;
            rtMap[tokenKey] = { label: tokenKey, count: 0, rts: [] };
        }
        const src = rtMap[tokenKey];
        src.count += value.count;
        src.rts.push({
            text: key,
            count: value.count
        });
        delete twoOrLess[key];
    });
}

export function sortReminderTexts(rtMap) {
    Object.values(rtMap).forEach(t => {
        t.rts = t.rts.sort((a, b) => {
            if (a.text.length > b.text.length) return 1;
            if (a.text.length < b.text.length) return -1;
            if (a.text > b.text) return 1;
            if (a.text < b.text) return -1;
            return 0;
        });
    });
}

export function createMergedTemplates(rtMap) {
    const variantGroupExpr = /\(([^)]+)\)/g;
    Object.values(rtMap).forEach(v => {
        let merged = mergeNStrings(v.rts.map(rt => rt.text));
        if (v.rts.length === 1) return;
        merged = merged.replaceAll(variantGroupExpr, function(match, p1) {
            const parts = p1.split('|');
            if (parts.length === 1) return match;
            const rep = getReplacement(parts, v.label);
            return rep ? rep : `(${parts.join('|')})`;
        })
        v.merged = {
            template: merged,
            count: v.rts.reduce((c, rt) => c + rt.count, 0)
        };
    });
}

export function saveRtMap(rtMap) {
    const mapOutput = Object.values(rtMap).sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
    });
    console.log(`Produced ${mapOutput.length} reminder text groups`);
    fs.writeFileSync('output/rtMap.json', JSON.stringify(mapOutput, null, 2));
}

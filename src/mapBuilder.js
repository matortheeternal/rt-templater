import fs from 'fs';
import { compileTemplate } from './templateCompiler.js';
import { findBest } from './findBest.js';

function getKeywordKey(value) {
    if (value.matchedKeywords?.length === 1)
        return value.matchedKeywords[0];
    if (value.matchedKeywords?.length > 1)
        console.log('Multiple keywords matches: ', value.matchedKeywords);
    const tokens = Object.keys(value.bestBeforeTokens);
    return tokens.join(' ');
}

export function buildReminderTextMap(out) {
    const rtMap = {};
    Object.entries(out).forEach(([key, value]) => {
        const tokenKey = getKeywordKey(value);
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
        const tokenKey = getKeywordKey(value);
        if (!rtMap.hasOwnProperty(tokenKey)) {
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

export function removeDoubleKeywords(rtMap) {
    Object.keys(rtMap).forEach(key => {
        if (!key.includes(' ')) return;
        const tokens = key.split(' ');
        const allTokensInMap = tokens.every(token => rtMap.hasOwnProperty(token));
        if (!allTokensInMap) return;
        console.log(`Removed ${key}, all tokens in map`);
        delete rtMap[key];
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
    Object.values(rtMap).forEach(entry => {
        if (entry.rts.length === 1) return;
        // console.log(`Creating templates for ${entry.label}`);
        const rtTexts = entry.rts.map(rt => rt.text);
        entry.merged = {
            template: compileTemplate(rtTexts, entry.label),
            count: entry.rts.reduce((c, rt) => c + rt.count, 0)
        };
        const mergedImperfect = entry.merged.template.includes('(');
        entry.best = mergedImperfect
            ? findBest(entry.merged.template, rtTexts, entry.label).map(rts => ({
                template: compileTemplate(rts, entry.label),
                rts
            })).sort((a, b) => b.rts.length - a.rts.length)
            : [{
                template: entry.merged.template,
                rts: rtTexts
            }];
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

export function saveIndividualKeywords(rtMap) {
    fs.rmSync('output/keywords', { recursive: true });
    fs.mkdirSync('output/keywords');
    Object.values(rtMap).forEach(v => {
        const output = {
            name: v.label,
            expr: v.label,
            variations: v.best || (v.merged
                ? [{ template: v.merged.template }]
                : [{ template: v.rts[0].text }])
        };
        const text = JSON.stringify(output, null, 2);
        const filename = v.label.slice(0, 1).toUpperCase() + v.label.slice(1) + '.json';
        fs.writeFileSync(`output/keywords/${filename}`, text);
    });
}

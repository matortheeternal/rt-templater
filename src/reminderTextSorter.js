import fs from 'fs';

const stopWords = [
    'creature', 'it', 'of', 'on', 'a', 'this', 'may', 'the', 'when', 'you',
    'create', 'cast', 'spell', 'gains', 'until', 'end', 'turn', 'and', 'untap',
    'tap', 'turn', 'put', '—', 'reveal', 'hand', 'from', 'your', 'card',
    'control', 'have', 'with', 'if', "doesn't", 'exile', 'has', 'to', 'where',
    'is', 'each', 'in', 'nonland', 'without', 'its', 'cost', 'equal', 'mana',
    'reduced', 'by', 'an', 'opponent', 'win', 'graveyard', 'as', 'additional',
    'target', 'enters', 'tapped', 'starting', 'deck', 'attached', 'during',
    'that', "it's", 'or', 'one', 'those', 'creatures', 'player', 'top', 'library',
    'cards', 'at', 'while', 'are', 'spells', 'get', 'whenever', 'two', 'three',
    'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
    'equipped', 'gets', 'sacrifice', 'land', 'discard', 'choose', 'color',
    '+1/+1', 'hand', 'legendary', 'other', 'x', 'black', 'red', 'white', 'blue',
    'green', '2/2', '1/1', '3/3', '4/4', 'attacks', 'controls', "card's", 'plus',
    'had', 'though', 'becomes', 'do', 'instant', 'sorcery', 'hand', 'zombie', 'onto',
    'arcane', 'artifact'
];

const twoOrLess = {};
const reminderTexts = {};
const noTokens = {};
const MIN_PERCENT = 0.8;

function getTarget(src) {
    if (src.count <= 2) return twoOrLess
    if (Object.keys(src.bestBeforeTokens).length === 0)
        return noTokens;
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

        delete src.keywords;
        delete src.beforeTokens;

        const target = getTarget(src);
        target[key] = src;
    });

    return { reminderTexts, twoOrLess, noTokens };
}

export function saveExtraOutputs() {
    fs.writeFileSync('output/rt.json', JSON.stringify(reminderTexts, null, 2));
    fs.writeFileSync('output/rt-twoOrLess.json', JSON.stringify(twoOrLess, null, 2));
    fs.writeFileSync('output/rt-noTokens.json', JSON.stringify(noTokens, null, 2));
}

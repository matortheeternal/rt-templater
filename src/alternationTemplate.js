import { lcsTokens } from './lcs.js';
import { sameText } from './stringUtils.js';

export function tokenize(str) {
    return str.trim().split(/\s+/);
}

function createBaseRowAlignment(baseTokens) {
    const baseLen = baseTokens.length;
    return {
        insertionsBeforeBase: Array.from({ length: baseLen + 1 }, () => []),
        matchesBaseToken: Array(baseLen).fill(true),
    };
}

function collectRowInsertions(rowTokens, startIndex, anchor) {
    const tokens = [];
    let index = startIndex;

    while (index < rowTokens.length && !sameText(rowTokens[index], anchor)) {
        tokens.push(rowTokens[index]);
        index++;
    }

    return { tokens, nextIndex: index };
}

function advanceBaseToAnchor(baseTokens, startIndex, anchor) {
    let index = startIndex;
    const len = baseTokens.length;

    while (index < len && !sameText(baseTokens[index], anchor)) {
        index++;
    }

    return index;
}

function appendRowInsertion(insertionsBeforeBase, baseIndex, insertionTokens) {
    if (!insertionTokens.length) return;
    insertionsBeforeBase[baseIndex].push(insertionTokens.join(' '));
}

function appendTailInsertions(insertionsBeforeBase, baseLen, rowTokens, rowIndex) {
    if (rowIndex >= rowTokens.length) return;
    insertionsBeforeBase[baseLen].push(rowTokens.slice(rowIndex).join(' '));
}

function alignRowToBase(baseTokens, rowTokens) {
    const baseLen = baseTokens.length;
    const backbone = lcsTokens(baseTokens, rowTokens);

    const insertionsBeforeBase = Array.from({ length: baseLen + 1 }, () => []);
    const matchesBaseToken = Array(baseLen).fill(false);

    let baseIndex = 0;
    let rowIndex = 0;

    for (const anchor of backbone) {
        const insertion = collectRowInsertions(rowTokens, rowIndex, anchor);
        rowIndex = insertion.nextIndex;

        baseIndex = advanceBaseToAnchor(baseTokens, baseIndex, anchor);
        if (baseIndex >= baseLen || rowIndex >= rowTokens.length) break;

        appendRowInsertion(insertionsBeforeBase, baseIndex, insertion.tokens);
        matchesBaseToken[baseIndex] = true;

        baseIndex++;
        rowIndex++;
    }

    appendTailInsertions(insertionsBeforeBase, baseLen, rowTokens, rowIndex);

    return { insertionsBeforeBase, matchesBaseToken };
}

function appendInsertionColumn(rowAlignments, columns, basePos) {
    const values = rowAlignments.map(row => {
        const chunks = row.insertionsBeforeBase[basePos] || [];
        return chunks.length ? chunks.join(' ') : '';
    });

    if (!values.filter(Boolean).length) return;
    columns.push({ values });
}

function appendBaseTokenColumn(baseTokens, rowAlignments, columns, basePos) {
    const token = baseTokens[basePos];
    const values = rowAlignments.map(row =>
        row.matchesBaseToken[basePos] ? token : ''
    );

    if (!values.filter(Boolean).length) return;
    columns.push({ values });
}

function buildColumns(baseTokens, rowAlignments) {
    const baseLen = baseTokens.length;
    const columns = [];

    for (let basePos = 0; basePos <= baseLen; basePos++) {
        appendInsertionColumn(rowAlignments, columns, basePos);
        if (basePos === baseLen) continue;
        appendBaseTokenColumn(baseTokens, rowAlignments, columns, basePos);
    }

    return columns;
}

function hasNotEqual(values) {
    return values.some(v => !sameText(v, values[0]));
}

function mergeColumnValues(prevValues, nextValues) {
    return prevValues.map((prev, i) => {
        const a = prev || '';
        const b = nextValues[i] || '';
        if (!a) return b;
        if (!b) return a;
        return `${a} ${b}`;
    });
}

function shouldMergeColumns(prevColumn, nextColumn) {
    if (!prevColumn || !nextColumn) return false;
    return hasNotEqual(prevColumn.values) && hasNotEqual(nextColumn.values);
}

function compressColumns(columns) {
    if (!columns.length) return columns;

    const result = [columns[0]];

    for (let i = 1; i < columns.length; i++) {
        const last = result[result.length - 1];
        const current = columns[i];

        if (!shouldMergeColumns(last, current)) {
            result.push(current);
            continue;
        }

        const mergedValues = mergeColumnValues(last.values, current.values);
        result[result.length - 1] = { values: mergedValues };
    }

    return result;
}

function renderTemplate(columns) {
    return columns.map(({ values }) => {
        const allSame = values.every(v => sameText(v, values[0]));
        return allSame ? values[0] : `(${values.join('|')})`;
    }).join(' ').replace(/\s+/g, ' ').trim();
}

const SUFFIX_PUNCT = ['.', ',', ';', ':', '!', '?'];

function cleanupVariantSuffixes(template) {
    return template.replace(/\(([^()]+)\)/g, (match, inner) => {
        const opts = inner.split('|');
        if (opts.length < 2) return match;

        const suffixes = opts.map(o => {
            const last = o[o.length - 1];
            return SUFFIX_PUNCT.includes(last) ? last : '';
        });

        const first = suffixes[0];
        if (!suffixes.every(s => s === first)) return match;

        const stripped = opts.map(o =>
            first ? o.slice(0, -1) : o
        );

        return '(' + stripped.join('|') + ')' + first;
    });
}

const PUNCT_RE = /[.,;:!?]+$/;

const PREFIXES = ['this', 'that'];
const SUFFIXES = ['spell', 'creature', 'card', 'that'];

const norm = s => (s || '').trim().toLowerCase();

function stripTrailingPunct(s) {
    const m = (s || '').match(PUNCT_RE);
    if (!m) return { core: s, punct: '' };
    const punct = m[0];
    return { core: s.slice(0, -punct.length), punct };
}

export function absorbColumnPrefixes(columns) {
    for (let i = 0; i < columns.length - 1; i++) {
        const colA = columns[i];
        const colB = columns[i + 1];

        const a0 = colA.values[0] || '';
        const isConstA = colA.values.every(v => sameText(v, a0));
        const isVarB = !colB.values.every(v => sameText(v, colB.values[0]));

        if (!isConstA || !isVarB) continue;

        const { core: aCore, punct: aPunct } = stripTrailingPunct(a0);
        if (!PREFIXES.includes(norm(aCore))) continue;

        colB.values = colB.values.map(v => `${aCore} ${v}`.trim() + aPunct);
        columns.splice(i, 1);
        i--;
    }
    return columns;
}

export function absorbColumnSuffixes(columns) {
    for (let i = 0; i < columns.length - 1; i++) {
        const colA = columns[i];
        const colB = columns[i + 1];

        const isVarA = !colA.values.every(v => sameText(v, colA.values[0]));
        const b0 = colB.values[0] || '';
        const isConstB = colB.values.every(v => sameText(v, b0));

        if (!isVarA || !isConstB) continue;

        const { core: bCore, punct: bPunct } = stripTrailingPunct(b0);
        if (!SUFFIXES.includes(norm(bCore))) continue;

        colA.values = colA.values.map(v => `${(v || '').trim()} ${bCore}`.trim() + bPunct);
        columns.splice(i + 1, 1);
        i--;
    }
    return columns;
}

export function createAlternationTemplate(strings) {
    if (!strings || strings.length === 0) return '';
    if (strings.length === 1) return strings[0];

    const baseTokens = tokenize(strings[0]);
    const rowAlignments = [];
    rowAlignments.push(createBaseRowAlignment(baseTokens));

    for (let i = 1; i < strings.length; i++) {
        const rowTokens = tokenize(strings[i]);
        rowAlignments.push(alignRowToBase(baseTokens, rowTokens));
    }

    let columns = buildColumns(baseTokens, rowAlignments);
    columns = absorbColumnPrefixes(columns);
    columns = absorbColumnSuffixes(columns);
    columns = compressColumns(columns);

    let template = renderTemplate(columns);
    return cleanupVariantSuffixes(template);
}

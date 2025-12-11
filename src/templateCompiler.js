import { mergeNStrings } from './lcs.js';
import { getReplacement } from './replacers/index.js';

const variantGroupExpr = /\(([^)]+)\)/g;

export function compileTemplate(strings, label) {
    const merged = mergeNStrings(strings);
    return merged.replaceAll(variantGroupExpr, function(match, p1) {
        const parts = p1.split('|');
        if (parts.length === 1) return match;
        const rep = getReplacement(parts, label);
        return rep ? rep : `(${parts.join('|')})`;
    });
}

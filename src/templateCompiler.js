import { createAlternationTemplate } from './alternationTemplate.js';
import { getReplacement } from './replacers/index.js';

const variantGroupExpr = /\(([^)]+)\)/g;

export function compileTemplate(strings, label) {
    const merged = createAlternationTemplate(strings);
    return merged.replaceAll(variantGroupExpr, function(match, p1) {
        const parts = p1.split('|');
        if (parts.length === 1) return match;
        const rep = getReplacement(parts.filter(Boolean), label);
        return rep ? rep : `(${parts.join('|')})`;
    });
}

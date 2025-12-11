import TargetReplacers from './TargetReplacers.js';
import NumberReplacers from './NumberReplacers.js';
import CostReplacers from './CostReplacers.js';
import MiscReplacers from './MiscReplacers.js';

const varReplacers = [
    ...CostReplacers,
    ...TargetReplacers,
    ...NumberReplacers,
    ...MiscReplacers
];

export function getReplacement(parts, label, str) {
    for (const Replacer of varReplacers) {
        const replacer = new Replacer(label);
        const res = replacer.replace(parts, match);
        if (res) return res;
    }
}

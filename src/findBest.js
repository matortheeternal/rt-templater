import { compileTemplate } from './templateCompiler.js';

// const altGroup = /\([^()]*\|[^()]*\)/;
function testCandidate(subset, label) {
    const template = compileTemplate(subset, label);
    return template.indexOf('(') === -1;
}

export function findBest(strings, label) {
    const remaining = [...strings];
    const results = [];

    while (remaining.length > 0) {
        const currentGroup = [remaining.shift()];

        for (let i = 0; i < remaining.length; ) {
            const candidate = remaining[i];
            const candidateGroup = [...currentGroup, candidate];

            if (testCandidate(candidateGroup, label)) {
                currentGroup.push(candidate);
                remaining.splice(i, 1);
            } else {
                i++;
            }
        }

        results.push(currentGroup);
    }

    return results;
}

import { compileTemplate } from './templateCompiler.js';

function isFullyTemplated(subset, label) {
    const template = compileTemplate(subset, label);
    return template.indexOf('(') === -1;
}

function buildGroup(remaining, label) {
    const currentGroup = [remaining.shift()];

    for (let i = 0; i < remaining.length; ) {
        const candidate = remaining[i];
        const candidateGroup = [...currentGroup, candidate];

        if (isFullyTemplated(candidateGroup, label)) {
            currentGroup.push(candidate);
            remaining.splice(i, 1);
            continue;
        }

        i++;
    }

    return currentGroup;
}

function tailMerge(results, label) {
    for (let i = results.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            const candidateGroup = [...results[i], ...results[j]];
            if (!isFullyTemplated(candidateGroup, label)) continue;
            results[j] = candidateGroup;
            results.splice(i, 1);
            break;
        }
    }
}

export function findBest(mergedTemplate, strings, label) {
    const remaining = [...strings];
    const results = [];

    while (remaining.length > 0) {
        const currentGroup = buildGroup(remaining, label);
        results.push(currentGroup);
    }
    tailMerge(results, label);

    return results;
}

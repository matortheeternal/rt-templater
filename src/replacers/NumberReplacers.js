import Replacer from './Replacer.js';

class NumberReplacer extends Replacer {
    id = '<number>';
    expr = /^(?:X|[0-9]|1[0-9])$/i;
}

class NumberNumberReplacer extends Replacer {
    id = '<number>/<number>';
    expr = /^([1-9]|1[0-9]|X)\/\1$/i;
}

class PPReplacer extends Replacer {
    id = '+<number>/+<number>';
    expr = /^\+([1-9]|1[0-9]|X)\/\+\1$/i;
}

const numTimes = `(?:three|four|five|six|seven|eight|nine) times `;

class NumberMultiReplacer extends Replacer {
    id = '<number:multi>';
    expr = new RegExp(`^(?:twice |${numTimes})? ?that$`, 'i');
}

const numberWords = [
    'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'
];
const aOrWordGroup = `(?:a|${numberWords.join('|')}|X)`;

class NumberPermanentsReplacer extends Replacer {
    id = '<number:permanents>';
    expr = new RegExp(`^${aOrWordGroup} permanents?$`, 'i');
}

class NumberWordReplacer extends Replacer {
    id = '<number:word>';
    expr = new RegExp(`^(?:one|${numberWords.join('|')}|X)$`, 'i');
}

class NumberAOrWordCardsReplacer extends Replacer {
    id = '<number:a_or_word> card<number:plural:s>';
    expr = new RegExp(`^${aOrWordGroup} cards?$`, 'i');
}

class NumberAOrWordReplacer extends Replacer {
    id = '<number:a_or_word>';
    expr = new RegExp(`^${aOrWordGroup}$`, 'i');
}

function isPlural(p1, p2) {
    return p2.startsWith(p1)
        && p1.length + 1 === p2.length
        && p2.slice(-1) === 's';
}

class NumberPluralSReplacer extends Replacer {
    id = '<number:plural:s>';

    replace(parts) {
        const uniqueParts = [...new Set(parts)];
        if (uniqueParts.length !== 2) return false;
        const [p1, p2] = uniqueParts.sort((a, b) => a.length - b.length);
        if (isPlural(p1, p2))
            return p1 + this.id;
    }
}

export default [
    NumberReplacer,
    NumberNumberReplacer,
    PPReplacer,
    NumberMultiReplacer,
    NumberWordReplacer,
    NumberPermanentsReplacer,
    NumberAOrWordReplacer,
    NumberAOrWordCardsReplacer,
    NumberPluralSReplacer
];

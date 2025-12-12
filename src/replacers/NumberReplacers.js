import Replacer from './Replacer.js';

class NumberReplacer extends Replacer {
    id = '<number>';
    expr = /^(?:0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)$/i;
}

class NumberNumberReplacer extends Replacer {
    id = '<number>/<number>';
    expr = /^(?:1\/1|2\/2|3\/3|4\/4|5\/5|6\/6|7\/7|8\/8|9\/9)$/i;
}

class NumberMultiReplacer extends Replacer {
    id = '<number:multi>';
    expr = /^(?:twice|three times|four times) that$/
}

class NumberWordReplacer extends Replacer {
    id = '<number:word>';
    expr = /^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|X)$/i;
}

class NumberAOrWordReplacer extends Replacer {
    id = '<number:a_or_word>';
    expr = /^(?:a|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|X)$/i;
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
    NumberMultiReplacer,
    NumberWordReplacer,
    NumberAOrWordReplacer,
    NumberPluralSReplacer
];

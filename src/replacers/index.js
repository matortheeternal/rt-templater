import Replacer from './Replacer.js';

class ManaCostReplacer extends Replacer {
    id = '<manacost>';
    expr = /^(?:{[0-9wubrgcs]})+$/i;
}

class TargetReplacer extends Replacer {
    id = '<target>';
    expr = /^(?:It|They|This creature)$/;
}

class ThisTokenIsReplacer extends Replacer {
    id = '<this_token_is>';

    constructor(label) {
        super();
        this.expr = new RegExp(`(?:It's|A ${label} is)`, 'i');
    }
}

class NumberReplacer extends Replacer {
    id = '<number>';
    expr = /^(?:0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)$/i;
}

class GenericManaPartReplacer extends Replacer {
    id = '<generic_mana_part>';
    expr = /^{[0-9X]}$/i;
}

class NumberAOrWordReplacer extends Replacer {
    id = '<number:a_or_word>';
    expr = /^(?:a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|X)$/i;
}

function isPlural(p1, p2) {
    return p2.startsWith(p1)
        && p1.length + 1 === p2.length
        && p2.slice(-1) === 's';
}

class NumberPluralSReplacer extends Replacer {
    id = '<number:plural:s>';

    replace(parts) {
        if (parts.length !== 2) return false;
        const [p1, p2] = parts.sort((a, b) => a.length - b.length);
        if (isPlural(p1, p2))
        return p1 + this.id;
    }
}

class DiesOrGyReplacer extends Replacer {
    id = '<dies_or_gy>';
    expr = /^(creature dies|permanent is put into a graveyard from the battlefield)$/;
}

const varReplacers = [
    ManaCostReplacer,
    TargetReplacer,
    ThisTokenIsReplacer,
    NumberReplacer,
    GenericManaPartReplacer,
    NumberAOrWordReplacer,
    NumberPluralSReplacer,
    DiesOrGyReplacer
];

export function getReplacement(parts, label) {
    for (const Replacer of varReplacers) {
        const replacer = new Replacer(label);
        const res = replacer.replace(parts);
        if (res) return res;
    }
}

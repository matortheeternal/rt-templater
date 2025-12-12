import Replacer from './Replacer.js';


const thisTypesGroup = `(?:creature|land|enchantment|permanent|artifact|token)`;

class TargetSpellReplacer extends Replacer {
    id = '<target_spell>';
    expr = /^(?:it|a spell|the spell|that spell|this spell|those spells)$/;
}

class TargetSpellCostsReplacer extends Replacer {
    id = '<target_spell_costs>';
    expr = new RegExp(`^(?:${[
        'it costs',
        'the spell costs',
        'that spell costs',
        'this spell costs',
        'those spells cost',
        'they cost'
    ].join('|')})$`, 'i');
}

class TargetCreatureReplacer extends Replacer {
    id = '<target_creature>';

    constructor(label) {
        super();
        const options = [
            'the creature',
            'that creature',
            'this creature',
            'those creatures',
            `a creature with ${label.toLowerCase()}`
        ];
        this.expr = new RegExp(`^(?:${options.join('|')})$`);
    }
}

class TargetItReplacer extends Replacer {
    id = '<target_it>';

    constructor(label) {
        super();
        const options = [
            'it',
            `this ${thisTypesGroup}`,
            'equipped creature',
            `a creature with ${label.toLowerCase()}(?: \\d)?`
        ];
        this.expr = new RegExp(`^(?:${options.join('|')})$`);
    }
}

class TargetReplacer extends Replacer {
    id = '<target>';

    constructor(label) {
        super();
        const options = [
            'It',
            '[Yy]ou',
            '[Tt]hey',
            `[Tt]his ${thisTypesGroup}`,
            `[Aa] creature with ${label.toLowerCase()}`
        ];
        this.expr = new RegExp(`^(?:${options.join('|')})$`);
    }
}

class TargetCardReplacer extends Replacer {
    id = '<target_card>';
    expr = /^(?:It|This card|This token|That card|Them)$/i;
}

class TargetDeals extends Replacer {
    id = '<target_deals>';

    constructor(label) {
        super();
        this.expr = new RegExp(
            `(?:it deals|they deal|this deals|a creature with ${label} deals)`, 'i'
        );
    }
}

class TargetDies extends Replacer {
    id = '<target_dies>';

    constructor(label) {
        super();
        const options = [
            'this creature dies',
            'this permanent is put into a graveyard from the battlefield',
            `a creature with ${label.toLowerCase()}(?: \\d)? dies`
        ];
        this.expr = new RegExp(`^(?:${options.join('|')})$`);
    }
}

export default [
    TargetSpellReplacer,
    TargetSpellCostsReplacer,
    TargetCreatureReplacer,
    TargetCardReplacer,
    TargetReplacer,
    TargetItReplacer,
    TargetDeals,
    TargetDies,
]

import Replacer from './Replacer.js';


const thisTypesGroup = `(?:creature|land|enchantment|permanent|artifact|token)`;

class TargetSpellReplacer extends Replacer {
    id = '<target_spell>';
    expr = /^(?:it|the spell|that spell|this spell|those spells)$/;
}

class TargetCreatureReplacer extends Replacer {
    id = '<target_creature>';

    constructor(label) {
        super();
        this.expr = new RegExp(
            `^(?:the creature|that creature|this creature|those creatures|a creature with ${label})$`
        );
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
            `a creature with ${label.toLowerCase()}`
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
    expr = /^(?:This card|This token|That card)$/i;
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

export default [
    TargetSpellReplacer,
    TargetCreatureReplacer,
    TargetCardReplacer,
    TargetReplacer,
    TargetItReplacer,
    TargetDeals,
]

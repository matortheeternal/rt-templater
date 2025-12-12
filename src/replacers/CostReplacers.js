import Replacer from './Replacer.js';

const manaSymbol = '{[0-9wubrgcsx]}';
const hybridManaSymbol = '{[2wubrgc]\\/[2wubrgc]}';
const mana = `(?:${manaSymbol}|${hybridManaSymbol})+`;

function pairExpr(options) {
    const addArticle = s => {
        if (!s) return 'a';
        return /^[aeiou]/.test(s) ? `an ${s}` : `a ${s}`;
    };

    const optionsWithArticles = options.map(addArticle);
    const single = `(?:${optionsWithArticles.join('|')})`;
    return `(?:${optionsWithArticles.join('|')}|${single} or ${single})`;
}

function pluralExpr(options) {
    const makePlural = opt => {
        return /s$/.test(opt) ? opt : `${opt}s`;
    };

    const pluralOptions = options.map(makePlural);
    return `(?:${pluralOptions.join('|')})`;
}

const payAdditionalMana = `pay an additional ${mana}`;
const inAddition = `in addition to any other costs`;

const landTypes = ['island', 'forest', 'mountain', 'swamp', 'plains'];
const permanentTypes = ['land', 'creature', 'artifact', 'enchantment', ...landTypes];
const allTypes = permanentTypes.concat(['instant', 'sorcery', '']);

const payLife = `pay [1-9] life`;
const pay = `(?:pay ${mana}|${payLife})`;

const sacMultiple = `sacrifice (?:two|three) ${pluralExpr(landTypes)}`;
const sac = `(?:sacrifice ${pairExpr(permanentTypes)}|${sacMultiple})`;
const payThenSac = `${pay} and ${sac}`;

const discard = `(?:discard ${pairExpr(allTypes)} card|discard two cards|discard a card at random)`;
const discards = `discards ${pairExpr(allTypes)} card`;
const payThenDiscard = `${pay} and ${discard}`;

class AdditionalCostReplacer extends Replacer {
    id = '<addcost>';
    expr = new RegExp(
        `^(?:` +
        `${payAdditionalMana}` +
        `|${payLife} ${inAddition}` +
        `|${sac} ${inAddition}` +
        `|${discard} ${inAddition}` +
        `|${payThenSac} ${inAddition}` +
        `|${payThenDiscard} ${inAddition}` +
        `)$`,
        'i'
    );
}

class ExtCostReplacer extends Replacer {
    id = '<extcost>';
    expr = new RegExp(`^(?:${mana}(?:, ${discard}|, ${sac})|${discard}|${sac})`, 'i');
}

class PayCostReplacer extends Replacer {
    id = '<paycost>';
    expr = new RegExp(`^(?:pays ${mana}|${discards})$`, 'i');
}

class ManaReplacer extends Replacer {
    id = '<mana>';
    expr = new RegExp(`^${mana}$`, 'i');
}

export default [
    ManaReplacer,
    ExtCostReplacer,
    PayCostReplacer,
    AdditionalCostReplacer,
];

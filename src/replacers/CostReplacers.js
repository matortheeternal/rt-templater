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

const payAdditionalMana = `pay an additional <mana>`;
const inAddition = `in addition to any other costs`;

const permanentTypes = ['land', 'creature', 'artifact', 'enchantment'];
const allTypes = permanentTypes.concat(['instant', 'sorcery', '']);

const sac = `sacrifice ${pairExpr(permanentTypes)}`;
const payThenSac = `pay ${mana} and ${sac}`;

const discard = `discard ${pairExpr(allTypes)} card`;
const discards = `discards ${pairExpr(allTypes)} card`;
const payThenDiscard = `pay ${mana} and ${discard}`;

class AdditionalCostReplacer extends Replacer {
    id = '<addcost>';
    expr = new RegExp(
        `^(?:` +
        `${payAdditionalMana}` +
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
    //AdditionalCostReplacer,
    ExtCostReplacer,
    PayCostReplacer,
];

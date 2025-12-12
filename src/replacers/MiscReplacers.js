import Replacer from './Replacer.js';
import { subtypes, subtypesGroup } from './subtypes.js';

class CreateReplacer extends Replacer {
    id = '<create>';

    constructor(label) {
        super();
        this.expr = new RegExp(`^(?:Create|To ${label.toLowerCase()}, create)$`, 'i');
    }
}

class ToDoThisReplacer extends Replacer {
    id = '<to_do_this>';

    constructor(label) {
        super();
        this.expr = new RegExp(`^(?:To ${label.toLowerCase()}(?: [a-z]+)?(?: [1-9X])?,|)$`, 'i');
    }
}

class ThisTokenIsReplacer extends Replacer {
    id = '<this_token_is>';

    constructor(label) {
        super();
        this.expr = new RegExp(`^(?:It's|A ${label.toLowerCase()} is)$`, 'i');
    }
}

class CompleatedManaReplacer extends Replacer {
    id = '<compleated_mana>';
    expr = /^{[WUBRG](?:\/[WUBRG])*\/P}$/i;
}

class CompleatedManaOptionsReplacer extends Replacer {
    id = '<compleated_options>';
    expr = /^{[WUBRG]}(?:, {[WUBRG]},)?$/i;
}

class GenericManaPartReplacer extends Replacer {
    id = '<generic_mana_part>';
    expr = /^{[0-9X]}$/i;
}

class CardSubtypeReplacer extends Replacer {
    id = '<card_sub_type>';
    expr = new RegExp(`^${subtypesGroup}(?: ${subtypesGroup})?$`, 'i');
}

class ColorReplacer extends Replacer {
    id = '<color>';
    expr = /^(white|blue|black|red|green)$/i;
}

const allTypes = [
    'Aura', 'artifact', 'Food', 'Gate', 'Town', 'Swamp', 'token', 'Forest', 'Island',
    'Plains', 'Mountain', 'creature', 'Equipment', 'snow land', 'enchantment',
    'planeswalker', 'artifact creature', 'artifact, legendary, and/or Saga permanent',
    'Assassin, Mercenary, Pirate, Rogue, and/or Warlock', 'Orc',
].concat(subtypes);

class TypeReplacer extends Replacer {
    id = '<type>'
    expr = new RegExp(`^(${allTypes.join('|')}|${subtypesGroup} or ${subtypesGroup})$`, 'i')
}

class TypesReplacer extends Replacer {
    id = '<type:s>'
    expr = new RegExp(`^(${allTypes.join('|')})s$`, 'i')
}

class SubTypeAndOrReplacer extends Replacer {
    id = '<subtype_and_or>';
    expr = new RegExp(`^${subtypesGroup}(?: and/or ${subtypesGroup})?$`)
}

class ATypeReplacer extends Replacer {
    id = '<type:a>'
    expr = new RegExp(`^(?:a|an) ${subtypesGroup}$`, 'i')
}

export default [
    CreateReplacer,
    ToDoThisReplacer,
    ThisTokenIsReplacer,
    CompleatedManaReplacer,
    CompleatedManaOptionsReplacer,
    GenericManaPartReplacer,
    ColorReplacer,
    ATypeReplacer,
    TypeReplacer,
    TypesReplacer,
    CardSubtypeReplacer,
    SubTypeAndOrReplacer
]

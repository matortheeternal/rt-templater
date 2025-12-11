import Replacer from './Replacer.js';
import { subtypesGroup } from './subtypes.js';

class CreateReplacer extends Replacer {
    id = '<create>';

    constructor(label) {
        super();
        this.expr = new RegExp(`(?:Create|To ${label}, create)`, 'i');
    }
}

class ThisTokenIsReplacer extends Replacer {
    id = '<this_token_is>';

    constructor(label) {
        super();
        this.expr = new RegExp(`(?:It's|A ${label} is)`, 'i');
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
    'Aura', 'artifact', 'Cat', 'Bird', 'Food', 'Frog', 'Gate', 'Town', 'Dalek', 'Human',
    'Swamp', 'token', 'Forest', 'Island', 'Knight', 'Lizard', 'Plains', 'Sliver',
    'Spirit', 'Citizen', 'Mountain', 'creature', 'Equipment', 'snow land', 'enchantment',
    'planeswalker', 'artifact creature', 'artifact, legendary, and/or Saga permanent',
    'Assassin, Mercenary, Pirate, Rogue, and/or Warlock'
];

class TypeReplacer extends Replacer {
    id = '<type>'
    expr = new RegExp(`^(${allTypes.join('|')})`, 'i')
}

export default [
    CreateReplacer,
    ThisTokenIsReplacer,
    CompleatedManaReplacer,
    CompleatedManaOptionsReplacer,
    GenericManaPartReplacer,
    CardSubtypeReplacer,
    ColorReplacer,
    TypeReplacer
]

export const blacklist = [
    // CARD: Swift Reconfiguration
    // KEYWORD: Crew
    // NOTE: Blacklisted because it's unique reminder text for turning a permanent into
    // a vehicle.
    "It's not a creature unless it's crewed.",

    // CARD: Slaughter Drone
    // KEYWORDS: Deathtouch + {C}
    // NOTE: Blacklisted because it's deathtouch + colorless mana reminder text.
    "Any amount of damage it deals to a creature is enough to destroy it. {C} represents colorless mana.",

    // CARD: Spider-Man No More
    // KEYWORD: "is a <type> with base power and toughness"
    // NOTE: This is not a keyword, it is unique reminder text.
    "It also loses all other creature types.",

    // CARD: Ageless Sentinels
    // KEYWORD: "its creature type becomes <type>"
    // NOTE: Blacklisted because unique reminder text and not a keyword, but was getting
    // incorrectly categorized under defender.
    "It's no longer a Wall. This effect lasts indefinitely.",

    // CARD: Shagrat, Loot Bearer
    // KEYWORD: Amass Orcs X
    // NOTE: This is reminder text for "attach up to one target equipment to it" + Amass
    // so it was blacklisted.
    "Control of the Equipment doesn't change. To amass Orcs X, put X +1/+1 counters on an Army you control. It's also an Orc. If you don't control an Army, create a 0/0 black Orc Army creature token first.",

    // CARD: Wren's Run Packmaster.
    // KEYWORD: Champion
    // NOTE: Blacklisted because it uses old "this creature" text instead of just "this",
    // which is different from all other oracle texts for Champion
    "When this creature enters, sacrifice it unless you exile another Elf you control. When this creature leaves the battlefield, that card returns to the battlefield.",

    // CARD: Saheeli, the Gifted
    // KEYWORD: Affinity
    // NOTE: This reminder text was never printed on a card, it comes from oracle text.
    // Because it's a weird edge case, I excluded it.
    "It costs {1} less to cast for each artifact you control as you cast it.",

    // CARD: Eldrazi Token
    // KEYWORD: Annihilator 1
    // NOTE: Removed because all other instances of the keyword say "of their choice."
    "Whenever this creature attacks, defending player sacrifices a permanent.",

    // CARD: Lion Umbra
    // KEYWORD: Enchant modified creature
    // NOTE: This is the modified reminder text, but it gets mis-recognized as the
    // Enchant reminder text.
    "Equipment, Auras its controller controls, and counters are modifications.",

    // CARD: Sublime Archangel
    // KEYWORD: Other creatures you control have exalted.
    // NOTE: This is a special reminder text. It doesn't describe what the keyword does.
    "If a creature has multiple instances of exalted, each triggers separately.",

    // CARD: Pontiff of Blight
    // KEYWORD: Other creatures you control have extort.
    // NOTE: This is a special reminder text. It doesn't describe what the keyword does.
    "If a creature has multiple instances of extort, each triggers separately.",

    // CARD: Rebellious Captives
    // KEYWORD: Exhaust, Earthbend
    // NOTE: Two keywords combined reminder text.
    "Target land you control becomes a 0/0 creature with haste that's still a land. Put two +1/+1 counters on it. When it dies or is exiled, return it to the battlefield tapped. Activate each exhaust ability only once.",
];

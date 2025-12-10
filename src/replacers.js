const manaCostExpr = /^(?:{[0-9wubrgcs]})+$/i;
const numberExpr = /^(?:0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)$/i;
const aOrWordNumberExpr = /^(?:a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|X)$/i;
const targetExpr = /^(?:It|They|This creature)$/

function isPlural(p1, p2) {
    return p2.startsWith(p1)
        && p1.length + 1 === p2.length
        && p2.slice(-1) === 's';
}

const varReplacers = [{
    id: '<manacost>',
    replace: parts => {
        const match = parts.every(part => {
            return manaCostExpr.test(part);
        });
        if (match) return '<manacost>';
    }
}, {
    id: '<target>',
    replace: parts => {
        const match = parts.every(part => {
            return targetExpr.test(part);
        });
        if (match) return '<target>';
    }
}, {
    id: '<this_token_is>',
    replace: (parts, label) => {
        const tokenExpr = new RegExp(`(?:It's|A ${label} is)`, 'i');
        const match = parts.every(part => {
            return tokenExpr.test(part);
        });
        if (match) return '<this_token_is>';
    }
}, {
    id: '<number>',
    replace: parts => {
        const match = parts.every(part => {
            return numberExpr.test(part);
        });
        if (match) return '<number>';
    }
}, {
    id: '<number:a_or_word>',
    replace: parts => {
        const match = parts.every(part => {
            return aOrWordNumberExpr.test(part);
        });
        if (match) return '<number:a_or_word>';
    }
}, {
    id: '<number:plural:s>',
    replace: parts => {
        if (parts.length !== 2) return false;
        const [p1, p2] = parts.sort((a, b) => a.length - b.length);
        if (isPlural(p1, p2))
            return p1 + '<number:plural:s>';
    }
}];

export function getReplacement(parts, label) {
    for (const r of varReplacers) {
        const res = r.replace(parts, label);
        if (res) return res;
    }
}

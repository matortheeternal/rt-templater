export default class Replacer {
    id = '';
    expr = null;

    replace(parts, label) {
        const match = parts.every(part => {
            return this.expr.test(part);
        });
        if (match) return this.id;
    }
}

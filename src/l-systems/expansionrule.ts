
class ExpansionRule {
    /**
     * Somewhere in another class, we will be creating
     * a list of rules map<String, ExpansionRule>, where \
     * the expansion rule is represented as a map, so
     * the string is actually just mapped to a list of <threshold, string>
     * Assumes lowest threshold to highest threshold sorted
     */
    expansions: {key: number, value: string}[];

    constructor(map: {key: number, value: string}[]) {
        this.expansions = map;
    }

    /**
     *  returns the result of mapping a character to a set of new characters
     *  - calls random number generator
     *  - map to the threshold represented in map and return string
     */ 
    getExpansion(): string {
        var mappedval: number;
        mappedval = Math.random();

        for (let i = this.expansions.length - 1; i >= 0 ; i--) {
            if (mappedval >= this.expansions[i].key) {
                return this.expansions[i].value;
            }
        }
    }

}

export default ExpansionRule;
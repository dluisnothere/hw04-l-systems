import ExpansionRule from 'expansionrule';
import Turtle from 'turtle';

class LSystemParser {
    axiom: string;
    rules: Map<string, ExpansionRule>;
    currString: string;
    numIters: number;

    constructor(ax: string, ruleMap: Map<string, ExpansionRule>, iters: number) {
        this.rules = ruleMap;
        this.axiom = ax;
        this.currString = this.axiom; //to start with
        this.numIters = iters;
    }

    /**
     * Returns true if character is NOT a symbol
     * @param char character to be tested
     */
    isCharacter(char: string) {
        return (/[A-Z]/).test(char);
    }

    /**
     * Recursive function that:
     * - iterates over characters in currString
     * - modifies turtle stack
     * - keeps track of current depth
     * - recursive?
     * @param curDepth 
     */
    parseRecursive(currDepth: number) {

        if (currDepth < this.numIters) {
            var currChar: string;
            var ruleForChar: ExpansionRule; 
            var stringReplacement: string;

            var newString = "";

            for (let i = 0; i < this.currString.length; i++) {
                //console.log(this.currString.charAt(i));
                currChar = this.currString.charAt(i);
                if (this.isCharacter(currChar)) {
                    if (this.rules.has(currChar)) {
                        ruleForChar = this.rules.get(currChar);
                        stringReplacement = ruleForChar.getExpansion();
                        newString += stringReplacement;    
                    }
                } else {
                    // JUST SKIP THIS CHARACTER and add it to the newstring appropriately.
                    newString += currChar;
                }
            }

            currDepth += 1;
            this.currString = newString;
            this.parseRecursive(currDepth);
        }
        //if maxed out depth, then no need to continue or do anything.
    }

    /**
     * Void function that calls the recursive helper function
     */
    parseCaller() {
        let curDepth = 0;
        this.parseRecursive(curDepth);

        //DEBUG LOG
        console.log(this.currString);
    }

    /**
     * Resets the string to the original axiom
     */
    resetString() {
        this.currString = this.axiom;
    }

}

export default LSystemParser
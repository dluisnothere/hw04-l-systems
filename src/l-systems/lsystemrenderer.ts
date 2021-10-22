import Turtle from 'turtle';
import {mat4} from 'gl-matrix';

class LSystemRenderer {
    expandedGrammar: string;
    turtleStack: Turtle[];
    transformList: mat4[];

    constructor(grammar: string) {
        this.expandedGrammar = grammar;
        this.turtleStack = [];
        this.transformList = [];
    }

    traverseGrammar() {
        
    }
}

export default LSystemRenderer;
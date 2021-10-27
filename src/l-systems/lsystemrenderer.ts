import Turtle from './turtle';
import { vec3, vec4, mat4 } from 'gl-matrix';
import DrawingRule from './drawingrule';
import Square from '../geometry/Square';
import { ENGINE_METHOD_STORE } from 'constants';
//import { toRadian } from 'gl-matrix/src/gl-matrix/common';

class LSystemRenderer {
    expandedGrammar: string;
    turtleStack: Turtle[];
    transformList: DrawingRule[];

    segLength: number;

    constructor(grammar: string, length: number) {
        this.expandedGrammar = grammar;
        this.turtleStack = [];
        this.transformList = [];
        this.segLength = length; 
    }

    /**
     * Returns true if character is NOT a symbol
     * @param char character to be tested
     */
    isCharacter(char: string) {
        return (/[A-Z]/).test(char);
    }

    toRadian(deg: number) {
        return deg * (Math.PI / 180.0);
    }

    traverseGrammar() {
        // for now, only 2d, but in 3d, randomly choose axis
        let turtPos = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
        //let turtOri = vec4.fromValues(0.0, 0.0, 0.0, 0.0);
        let turt = new Turtle(turtPos, 0, this.segLength);
        
        // traverse string
        for(let i = 0; i < this.expandedGrammar.length; i++) {

            let currChar = this.expandedGrammar.substring(i, i + 1);

            // turtle
            // make new turtle when old turtle goes on the stack (AKA marks pivot point)
            let zAxis = vec3.fromValues(0.0, 0.0, 1.0);
            let yAxis = vec3.fromValues(0.0, 1.0, 0.0);

            if (this.isCharacter(currChar)) {
                turt.marchForward(yAxis, this.segLength);
            } else if (currChar == "+") {
                turt.rotate(zAxis, this.toRadian(30.0));
                continue;
            } else if (currChar == "-") {
                let zAxis = vec3.fromValues(0.0, 0.0, 1.0);
                turt.rotate(zAxis, this.toRadian(-30.0));
                continue;
            }

            let sq = new Square();

            let drawRule = new DrawingRule(sq, turt.getTransform());
            this.transformList.push(drawRule);
        }

        // traverse list of transforms
        console.log("renderer transformList");
        console.log(this.transformList);
    }
}

export default LSystemRenderer;
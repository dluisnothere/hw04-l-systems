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

    angle: number;

    systemOrigin: vec4;

    segLength: number;

    constructor(origin: vec4, grammar: string, length: number, angle: number) {
        this.systemOrigin = origin;
        this.expandedGrammar = grammar;
        this.turtleStack = [];
        this.transformList = [];
        this.segLength = length;
        this.angle = angle; 
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
        //let turtPos = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
        //let turtOri = vec4.fromValues(0.0, 0.0, 0.0, 0.0);
        let turt = new Turtle(this.systemOrigin, 0);
        
        // traverse string
        for(let i = 0; i < this.expandedGrammar.length; i++) {

            let currChar = this.expandedGrammar.substring(i, i + 1);

            // turtle
            // make new turtle when old turtle goes on the stack (AKA marks pivot point)
            let zAxis = vec3.fromValues(0.0, 0.0, 1.0);
            let yAxis = vec3.fromValues(0.0, 1.0, 0.0);
            let xAxis = vec3.fromValues(1.0, 0.0, 0.0);

            if (this.isCharacter(currChar)) {
                turt.marchForward(yAxis, this.segLength);
            } else if (currChar == "+") {
                turt.rotate(zAxis, this.toRadian(this.angle));
                continue;
            } else if (currChar == "-") {
                turt.rotate(zAxis, this.toRadian(-this.angle));
                continue;
            } else if (currChar == "&") {
                turt.rotate(xAxis, this.toRadian(this.angle));
                continue;
            } else if (currChar == "^") {
                turt.rotate(xAxis, this.toRadian(-this.angle));
                continue;
            } else if (currChar == "|") {
                turt.rotate(yAxis, this.toRadian(this.angle));
                continue;
            } else if (currChar == "/") {
                turt.rotate(yAxis, this.toRadian(-this.angle));
                continue;
            } else if (currChar == '[') {
                // create new turtle with all the transform history
                // add old turtle to stack
                this.turtleStack.push(turt);
                //let newTurtStart = turt.getTransform() * this.systemOrigin;
                let newTurt = new Turtle(this.systemOrigin, 0);

                newTurt.currTransform = mat4.copy(newTurt.currTransform, turt.currTransform);
                turt = newTurt;
                continue;
            } else if (currChar == ']') {
                let topTurtle = this.turtleStack.pop();
                turt = topTurtle;
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
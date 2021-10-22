import {vec4} from 'gl-matrix';
import DrawingRule from './drawingrule';

class Turtle {
    currPosition: vec4;
    currOrientation: vec4; //forward vector
    recursionDepth: number;
    drawRule: DrawingRule;

    constructor(pos: vec4, ori: vec4, depth: number ) {
        this.currPosition = pos;
        this.currOrientation = ori;
        this.recursionDepth = depth;
        this.drawRule = null;
    }
}

export default Turtle;
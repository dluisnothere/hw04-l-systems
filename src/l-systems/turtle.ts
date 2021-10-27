import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { vec3, vec4, mat4 } from 'gl-matrix';
import DrawingRule from './drawingrule';

class Turtle {
    // currPosition: mat4;
    // currOrientation: mat4; //forward vector
    currTransform: mat4;
    //stepSize: number;
    //angle: number;

    startPos: vec4;
    //startOri: vec4;

    //currTranslation: mat4;
    //currRotation: mat4;

    //currPosition: vec4;
    //currOrientation: vec4;

    recursionDepth: number;
    drawRule: DrawingRule;

    constructor(pos: vec4, depth: number, stepSize: number) {
        this.recursionDepth = depth;
        this.startPos = pos;
        
        //this.currPosition = pos;
        //this.currOrientation = ori;

        this.currTransform = mat4.create();

        //this.stepSize = stepSize;
    }

    getTransform() : mat4 {
        return this.currTransform;
    }

    marchForward(marchVector: vec3, stepSize: number) {
        //vec4.add(this.currPosition, this.currPosition, vec4.fromValues(0.0, this.stepSize, 0.0, 0.0));
        let newTransMatrix = mat4.fromValues(1.0, 0.0, 0.0, stepSize * marchVector[0],
                                            0.0, 1.0, 0.0, stepSize * marchVector[1],
                                            0.0, 0.0, 1.0, stepSize * marchVector[2],
                                            0.0, 0.0, 0.0, 1.0);
        mat4.multiply(this.currTransform, this.currTransform, newTransMatrix);
    }

    // assumes rotateAxis is always one of the three axes
    // will always have 0s or 1s
    rotate(rotateAxis: vec3, angle: number) {
        //vec4.add(this.currOrientation, this.currOrientation, vec4.fromValues(rotateAxis[0], rotateAxis[1], rotateAxis[2], 0.0));
        let newRotMatrix = mat4.create();
        mat4.rotateX(newRotMatrix, newRotMatrix, rotateAxis[0] * angle);
        mat4.rotateY(newRotMatrix, newRotMatrix, rotateAxis[1] * angle);
        mat4.rotateZ(newRotMatrix, newRotMatrix, rotateAxis[2] * angle);

        mat4.multiply(this.currTransform, this.currTransform, newRotMatrix);
    }
}

export default Turtle;
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { vec3, vec4, mat4 } from 'gl-matrix';
import DrawingRule from './drawingrule';

class Turtle {
    currTransform: mat4;

    startPos: vec4;

    recursionDepth: number;
    drawRule: DrawingRule;

    constructor(pos: vec4, depth: number) {
        this.recursionDepth = depth;
        this.startPos = pos;
        
        this.currTransform = mat4.create();

    }

    getTransform() : mat4 {
        return this.currTransform;
    }

    marchForward(marchVector: vec3, stepSize: number) {
        let newTransMatrix = mat4.fromValues(1.0, 0.0, 0.0, stepSize * marchVector[0],
                                            0.0, 1.0, 0.0, stepSize * marchVector[1],
                                            0.0, 0.0, 1.0, stepSize * marchVector[2],
                                            0.0, 0.0, 0.0, 1.0);
        mat4.multiply(this.currTransform, newTransMatrix, this.currTransform);
    }

    // assumes rotateAxis is always one of the three axes
    // will always have 0s or 1s
    rotate(rotateAxis: vec3, angle: number) {
        let newRotMatrix = mat4.create();
        mat4.rotateX(newRotMatrix, newRotMatrix, rotateAxis[0] * angle);
        mat4.rotateY(newRotMatrix, newRotMatrix, rotateAxis[1] * angle);
        mat4.rotateZ(newRotMatrix, newRotMatrix, rotateAxis[2] * angle);

        mat4.multiply(this.currTransform, newRotMatrix, this.currTransform);
    }
}

export default Turtle;
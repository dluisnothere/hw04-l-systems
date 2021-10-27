import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { vec3, vec4, mat4 } from 'gl-matrix';
import DrawingRule from './drawingrule';

class Turtle {
    currPosition: mat4;
    currOrientation: mat4; //forward vector
    recursionDepth: number;
    drawRule: DrawingRule;

    constructor(pos: vec4, ori: vec4, depth: number ) {
        this.recursionDepth = depth;
        this.drawRule = null;

        // set orientation
        // let oriMatrix = mat4.fromValues(ori[0], 0.0, 0.0, 0.0,
        //                                 0.0, ori[1], 0.0, 0.0,
        //                                 0.0, 0.0, ori[2], 0.0,
        //                                 0.0, 0.0, 0.0, 1.0);
        let oriMatrix = mat4.create();
        mat4.rotateX(oriMatrix, oriMatrix, ori[0]);
        mat4.rotateY(oriMatrix, oriMatrix, ori[1]);
        mat4.rotateZ(oriMatrix, oriMatrix, ori[2]);

        this.currOrientation = oriMatrix;

        // set position
        let posMatrix = mat4.fromValues(1.0, 0.0, 0.0, pos[0],
                                        0.0, 1.0, 0.0, pos[1],
                                        0.0, 0.0, 1.0, pos[2],
                                        0.0, 0.0, 0.0, 1.0);
        // let posMatrix = mat4.create();
        // mat4.translate(posMatrix, posMatrix, vec3.fromValues(pos[0], pos[1], pos[2]));
        this.currPosition = posMatrix;
    }

    getLocalTransform() : mat4 {
        let transform = mat4.create();
        console.log("position:");
        console.log(this.currPosition);
        mat4.multiply(transform, this.currOrientation, this.currPosition);
        return transform;
    }
}

export default Turtle;
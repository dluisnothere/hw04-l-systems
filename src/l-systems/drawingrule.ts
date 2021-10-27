import Turtle from 'turtle';
import Drawable from '../rendering/gl/Drawable';
import Square from '../geometry/Square';
import { vec4, mat4 } from 'gl-matrix';

/**
 * Represents the result of mapping a character to an
 * L-System drawing operation 
 */
class DrawingRule {

    // each component will have its own drawing rule to discern between branches and leaves. 
    shape: Square;
    // store leaves in a separate array of transform
    transform: mat4;

    // square for now. Will be a mesh later
    constructor(finalShape: Square, trans: mat4) {
        this.shape = finalShape;
        this.transform = trans;
    }
}

export default DrawingRule;
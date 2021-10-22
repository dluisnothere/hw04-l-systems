import Turtle from 'turtle';
import Drawable from '../rendering/gl/Drawable';
import Square from '../geometry/Square';
import { mat4 } from 'gl-matrix';

/**
 * Represents the result of mapping a character to an
 * L-System drawing operation 
 */
class DrawingRule {

    // each component will have its own drawing rule to discern between branches and leaves. 
    shape: Square;

    // square for now. Will be a mesh later
    constructor(finalShape: Square) {
        this.shape = finalShape;
    }

    getTransform(character: String, turtle: Turtle): mat4 {

    }

}

export default DrawingRule;
import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  colors: Float32Array;
  offsets: Float32Array; // Data for bufTranslate

  //TODO
  transVec41: Float32Array;
  transVec42: Float32Array;
  transVec43: Float32Array;
  transVec44: Float32Array;


  constructor() {
    super(); // Call the constructor of the super class. This is required.
  }

  create() {

  this.indices = new Uint32Array([0, 1, 2,
                                  0, 2, 3]);
  this.positions = new Float32Array([-0.5, -0.5, 0, 1,
                                     0.5, -0.5, 0, 1,
                                     0.5, 0.5, 0, 1,
                                     -0.5, 0.5, 0, 1]);

    this.generateIdx();
    this.generatePos();
    this.generateCol();
    this.generateTranslate();

    //TODO
    this.generateTransVec41();
    this.generateTransVec42();
    this.generateTransVec43();
    this.generateTransVec44();



    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
  }

  //set instance VBO LSystem
  //TODO
  setInstanceLSystemVBOs(tv41: Float32Array, tv42: Float32Array, tv43: Float32Array, tv44: Float32Array, colors: Float32Array) {
    this.transVec41 = tv41;
    this.transVec42 = tv42;
    this.transVec43 = tv43;
    this.transVec44 = tv44;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec41);
    gl.bufferData(gl.ARRAY_BUFFER, this.transVec41, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec42);
    gl.bufferData(gl.ARRAY_BUFFER, this.transVec42, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec43);
    gl.bufferData(gl.ARRAY_BUFFER, this.transVec43, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec44);
    gl.bufferData(gl.ARRAY_BUFFER, this.transVec44, gl.STATIC_DRAW);

    this.colors = colors;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
  }
};

export default Square;

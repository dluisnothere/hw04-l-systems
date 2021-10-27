import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufTranslate: WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;

  //buf vec4s for matrix
  //TODO 
  bufTransVec41: WebGLBuffer;
  bufTransVec42: WebGLBuffer;
  bufTransVec43: WebGLBuffer;
  bufTransVec44: WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  translateGenerated: boolean = false;
  uvGenerated: boolean = false;

  // buf vec4s generated
  //TODO
  transVec41Generated: boolean = false;
  transVec42Generated: boolean = false;
  transVec43Generated: boolean = false;
  transVec44Generated: boolean = false;


  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTranslate);
    gl.deleteBuffer(this.bufUV);

    gl.deleteBuffer(this.bufTransVec41);
    gl.deleteBuffer(this.bufTransVec42);
    gl.deleteBuffer(this.bufTransVec43);
    gl.deleteBuffer(this.bufTransVec44);
  }

  generateIdx() {
    this.idxGenerated = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posGenerated = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norGenerated = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTranslate() {
    this.translateGenerated = true;
    this.bufTranslate = gl.createBuffer();
  }

  generateUV() {
    this.uvGenerated = true;
    this.bufUV = gl.createBuffer();
  }

  //add binds for the vec4s
  //TODO
  generateTransVec41() {
    this.transVec41Generated = true;
    this.bufTransVec41 = gl.createBuffer();
  }

  generateTransVec42() {
    this.transVec42Generated = true;
    this.bufTransVec42 = gl.createBuffer();
  }

  generateTransVec43() {
    this.transVec43Generated = true;
    this.bufTransVec43 = gl.createBuffer();
  }

  generateTransVec44() {
    this.transVec44Generated = true;
    this.bufTransVec44 = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTranslate(): boolean {
    if (this.translateGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    }
    return this.translateGenerated;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }

  // bind transform vec4s
  //TODO
  bindTransVec41(): boolean {
    if (this.transVec41Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec41);
    }
    return this.transVec41Generated;
  }

  bindTransVec42(): boolean {
    if (this.transVec42Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec42);
    }
    return this.transVec42Generated;
  }

  bindTransVec43(): boolean {
    if (this.transVec43Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec43);
    }
    return this.transVec43Generated;
  }

  bindTransVec44(): boolean {
    if (this.transVec44Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransVec44);
    }
    return this.transVec44Generated;
  }


  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;

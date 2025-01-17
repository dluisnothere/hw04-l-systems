import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as Loader from 'webgl-obj-loader';

class Mesh extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  uvs: Float32Array;
  center: vec4;
  offsets: Float32Array; // Data for bufTranslate


  transVec41: Float32Array;
  transVec42: Float32Array;
  transVec43: Float32Array;
  transVec44: Float32Array;

  objString: string;

  constructor(objString: string, center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    //console.log("objstring");
    //console.log(objString);
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);

    this.objString = objString;
  }

  create() {  
    let posTemp: Array<number> = [];
    let norTemp: Array<number> = [];
    let uvsTemp: Array<number> = [];
    let idxTemp: Array<number> = [];

    var loadedMesh = new Loader.Mesh(this.objString);

    //posTemp = loadedMesh.vertices;
    for (var i = 0; i < loadedMesh.vertices.length; i++) {
      posTemp.push(loadedMesh.vertices[i]);
      if (i % 3 == 2) posTemp.push(1.0);
    }

    for (var i = 0; i < loadedMesh.vertexNormals.length; i++) {
      norTemp.push(loadedMesh.vertexNormals[i]);
      if (i % 3 == 2) norTemp.push(0.0);
    }

    uvsTemp = loadedMesh.textures;
    idxTemp = loadedMesh.indices;

    // white vert color for now
    this.colors = new Float32Array(posTemp.length);
    for (var i = 0; i < posTemp.length; ++i){
      this.colors[i] = 1.0;
    }

    this.indices = new Uint32Array(idxTemp);
    this.normals = new Float32Array(norTemp);
    this.positions = new Float32Array(posTemp);
    this.uvs = new Float32Array(uvsTemp);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateUV();
    this.generateCol();
    this.generateTranslate();


    this.generateTransVec41();
    this.generateTransVec42();
    this.generateTransVec43();
    this.generateTransVec44();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    console.log(`Created Mesh from OBJ`);
    this.objString = ""; // hacky clear
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
  }

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

export default Mesh;

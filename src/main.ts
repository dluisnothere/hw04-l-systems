import {vec3, vec4, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import ExpansionRule from './l-systems/expansionrule';
import LSystemParser from './l-systems/lsystemparser';
import LSystemRenderer from './l-systems/lsystemrenderer';
import Mesh from './geometry/Mesh';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};


let square: Square;
let cylinder: Mesh;
let flower: Mesh;
let creature: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let lsystem: LSystemParser;
let lrender: LSystemRenderer;

function loadScene() {
  square = new Square();
  square.create();
  
  function readTextFile(file: string)
  {
    var obj: string;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                obj = allText;
            }
        }
    }
    rawFile.send(null);
    return obj;
  }

  // CYLINDER MESH CREATE
  let cylinderString = readTextFile("./cylinder3.obj");

  cylinder = new Mesh(cylinderString, vec3.fromValues(0.0,0.0,0.0));
  cylinder.create();

  // FLOWER MESH CREATE
  let flowerString = readTextFile("./ball.obj");

  flower = new Mesh(flowerString, vec3.fromValues(0.0, 0.0, 0.0));
  flower.create();

  // SEA CREATURE CREATE
  let creatureString = readTextFile("./fish.obj");

  creature = new Mesh(creatureString, vec3.fromValues(0.0,0.0,0.0));
  creature.create();

  // BACKGROUND CREATE

  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU

  // CONSTRUCT L SYSTEM
  let ruleMap = new Map<string, ExpansionRule>();
  ruleMap.set("A", new ExpansionRule([{key: 0.0, value: "F[BA]/F//[AB]/F//B"}]));
  ruleMap.set("B", new ExpansionRule([{key: 0.0, value: "-F&A+&C"}]));
  ruleMap.set("F", new ExpansionRule([{key: 0.0, value: "F"}]));

  let iterations = 5;

  lsystem = new LSystemParser("D[[AA]-[AB]]+////++A--", ruleMap, iterations);
  lsystem.parseCaller();

  let worldorigin = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  lrender = new LSystemRenderer(worldorigin, lsystem.currString, 1.0, 18.0);
  lrender.traverseGrammar();

  // set up branch lsystem transforms
  let brtransVec41Array = [];
  let brtransVec42Array = [];
  let brtransVec43Array = [];
  let brtransVec44Array = [];

  // set up flower transforms
  let fltransVec41Array = [];
  let fltransVec42Array = [];
  let fltransVec43Array = [];
  let fltransVec44Array = [];

  // set up sea creature transforms:
  let crtransVec41Array = [];
  let crtransVec42Array = [];
  let crtransVec43Array = [];
  let crtransVec44Array = [];

  // set up base transform

  let nBranchInstances = 0;
  let nFlowerInstances = 0;
  let nCreatureInstances = 0;

  let lSystemTransforms = lrender.transformList;

  for (let i = 0; i < lSystemTransforms.length; i++) {
    let shapeNum = lSystemTransforms[i].shape;
    let currentMat = lSystemTransforms[i].transform;

    //base 
    if (shapeNum == 0) {

    } else if (shapeNum == 1) {
      brtransVec41Array.push(currentMat[0]);
      brtransVec41Array.push(currentMat[4]);
      brtransVec41Array.push(currentMat[8]);
      brtransVec41Array.push(currentMat[12]);
  
      brtransVec42Array.push(currentMat[1]);
      brtransVec42Array.push(currentMat[5]);
      brtransVec42Array.push(currentMat[9]);
      brtransVec42Array.push(currentMat[13]);
  
      brtransVec43Array.push(currentMat[2]);
      brtransVec43Array.push(currentMat[6]);
      brtransVec43Array.push(currentMat[10]);
      brtransVec43Array.push(currentMat[14]);
  
      brtransVec44Array.push(currentMat[3]);
      brtransVec44Array.push(currentMat[7]);
      brtransVec44Array.push(currentMat[11]);
      brtransVec44Array.push(currentMat[15]);
  
      nBranchInstances += 1;
    } else if (shapeNum == 2) {

      fltransVec41Array.push(currentMat[0]);
      fltransVec41Array.push(currentMat[4]);
      fltransVec41Array.push(currentMat[8]);
      fltransVec41Array.push(currentMat[12]);
  
      fltransVec42Array.push(currentMat[1]);
      fltransVec42Array.push(currentMat[5]);
      fltransVec42Array.push(currentMat[9]);
      fltransVec42Array.push(currentMat[13]);
  
      fltransVec43Array.push(currentMat[2]);
      fltransVec43Array.push(currentMat[6]);
      fltransVec43Array.push(currentMat[10]);
      fltransVec43Array.push(currentMat[14]);
  
      fltransVec44Array.push(currentMat[3]);
      fltransVec44Array.push(currentMat[7]);
      fltransVec44Array.push(currentMat[11]);
      fltransVec44Array.push(currentMat[15]);
  
      nFlowerInstances += 1;
    } else if (shapeNum == 3) {

      crtransVec41Array.push(currentMat[0]);
      crtransVec41Array.push(currentMat[4]);
      crtransVec41Array.push(currentMat[8]);
      crtransVec41Array.push(currentMat[12]);
  
      crtransVec42Array.push(currentMat[1]);
      crtransVec42Array.push(currentMat[5]);
      crtransVec42Array.push(currentMat[9]);
      crtransVec42Array.push(currentMat[13]);
  
      crtransVec43Array.push(currentMat[2]);
      crtransVec43Array.push(currentMat[6]);
      crtransVec43Array.push(currentMat[10]);
      crtransVec43Array.push(currentMat[14]);
  
      crtransVec44Array.push(currentMat[3]);
      crtransVec44Array.push(currentMat[7]);
      crtransVec44Array.push(currentMat[11]);
      crtransVec44Array.push(currentMat[15]);
  
      nCreatureInstances += 1;
    }
  }

  // BRANCHES 
  let brtransVec41 : Float32Array = new Float32Array(brtransVec41Array);
  let brtransVec42 : Float32Array = new Float32Array(brtransVec42Array);
  let brtransVec43 : Float32Array = new Float32Array(brtransVec43Array);
  let brtransVec44 : Float32Array = new Float32Array(brtransVec44Array);

  let broffsetsArray = [];
  let brcolorsArray = [];

  for(let i = 0; i < nBranchInstances; i++) {
    for(let j = 0; j < nBranchInstances; j++) {

      broffsetsArray.push(0);
      broffsetsArray.push(0);
      broffsetsArray.push(0);

      brcolorsArray.push(219.0 / 255.0);
      brcolorsArray.push(64.0 / 255.0);
      brcolorsArray.push(108.0 / 255.0);
      brcolorsArray.push(1.0); // Alpha channel
    }
  }
  let broffsets: Float32Array = new Float32Array(broffsetsArray);
  let brcolors: Float32Array = new Float32Array(brcolorsArray);

  cylinder.setInstanceLSystemVBOs(brtransVec41, brtransVec42, brtransVec43, brtransVec44, brcolors);
  cylinder.setInstanceVBOs(broffsets, brcolors);
  cylinder.setNumInstances(nBranchInstances);

  // FLOWERS

  let fltransVec41 : Float32Array = new Float32Array(fltransVec41Array);
  let fltransVec42 : Float32Array = new Float32Array(fltransVec42Array);
  let fltransVec43 : Float32Array = new Float32Array(fltransVec43Array);
  let fltransVec44 : Float32Array = new Float32Array(fltransVec44Array);

  let floffsetsArray = [];
  let flcolorsArray = [];

  for(let i = 0; i < nFlowerInstances; i++) {
    for(let j = 0; j < nFlowerInstances; j++) {

      floffsetsArray.push(0);
      floffsetsArray.push(0);
      floffsetsArray.push(0);

      flcolorsArray.push(1.0);
      flcolorsArray.push(1.0);
      flcolorsArray.push(1.0);
      flcolorsArray.push(0.5); // Alpha channel
    }
  }
  let floffsets: Float32Array = new Float32Array(floffsetsArray);
  let flcolors: Float32Array = new Float32Array(flcolorsArray);

  flower.setInstanceLSystemVBOs(fltransVec41, fltransVec42, fltransVec43, fltransVec44, flcolors);
  flower.setInstanceVBOs(floffsets, flcolors);
  flower.setNumInstances(nFlowerInstances);

  // CREATURES 

  let crtransVec41 : Float32Array = new Float32Array(crtransVec41Array);
  let crtransVec42 : Float32Array = new Float32Array(crtransVec42Array);
  let crtransVec43 : Float32Array = new Float32Array(crtransVec43Array);
  let crtransVec44 : Float32Array = new Float32Array(crtransVec44Array);

  let croffsetsArray = [];
  let crcolorsArray = [];

  for(let i = 0; i < nCreatureInstances; i++) {
    for(let j = 0; j < nCreatureInstances; j++) {

      croffsetsArray.push(0);
      croffsetsArray.push(0);
      croffsetsArray.push(0);

      crcolorsArray.push(255.0 / 255.0);
      crcolorsArray.push(117.0 / 255.0);
      crcolorsArray.push(43.0 / 255.0);
      crcolorsArray.push(1.0); // Alpha channel
    }
  }
  let croffsets: Float32Array = new Float32Array(croffsetsArray);
  let crcolors: Float32Array = new Float32Array(crcolorsArray);

  creature.setInstanceLSystemVBOs(crtransVec41, crtransVec42, crtransVec43, crtransVec44, crcolors);
  creature.setInstanceVBOs(croffsets, crcolors);
  creature.setNumInstances(nCreatureInstances);

}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 20, 0), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  // 0.7
  renderer.setClearColor(0.7, 0.7, 0.7, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      cylinder, square, flower, creature
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();

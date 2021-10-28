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

let objString: string;

let square: Square;
let mesh: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let lsystem: LSystemParser;
let lrender: LSystemRenderer;

function loadScene() {
  square = new Square();
  square.create();

  //let objString: string;
  
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

  let objString = readTextFile("src/cylinder4.obj");

  mesh = new Mesh(objString, vec3.fromValues(0.0,0.0,0.0));
  mesh.create();

  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU

  // CONSTRUCT L SYSTEM
  let ruleMap = new Map<string, ExpansionRule>();
  ruleMap.set("A", new ExpansionRule([{key: 0.0, value: "F[BA]///[A]///B"}]));
  ruleMap.set("B", new ExpansionRule([{key: 0.0, value: "-F&A+-&"}]));
  ruleMap.set("F", new ExpansionRule([{key: 0.0, value: "F"}]));

  let iterations = 5;

  lsystem = new LSystemParser("[[AA]-[AB]]+////++A--", ruleMap, iterations);
  lsystem.parseCaller();

  let worldorigin = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  lrender = new LSystemRenderer(worldorigin, lsystem.currString, 1.0, 20.0);
  lrender.traverseGrammar();

  // set up lsystem transforms
  let transVec41Array = [];
  let transVec42Array = [];
  let transVec43Array = [];
  let transVec44Array = [];

  let nInstances = 0;

  let lSystemTransforms = lrender.transformList;

  for (let i = 0; i < lSystemTransforms.length; i++) {
    let currentMat = lSystemTransforms[i].transform;
    transVec41Array.push(currentMat[0]);
    transVec41Array.push(currentMat[4]);
    transVec41Array.push(currentMat[8]);
    transVec41Array.push(currentMat[12]);

    transVec42Array.push(currentMat[1]);
    transVec42Array.push(currentMat[5]);
    transVec42Array.push(currentMat[9]);
    transVec42Array.push(currentMat[13]);

    transVec43Array.push(currentMat[2]);
    transVec43Array.push(currentMat[6]);
    transVec43Array.push(currentMat[10]);
    transVec43Array.push(currentMat[14]);

    transVec44Array.push(currentMat[3]);
    transVec44Array.push(currentMat[7]);
    transVec44Array.push(currentMat[11]);
    transVec44Array.push(currentMat[15]);

    nInstances += 1;
  }

  let transVec41 : Float32Array = new Float32Array(transVec41Array);
  let transVec42 : Float32Array = new Float32Array(transVec42Array);
  let transVec43 : Float32Array = new Float32Array(transVec43Array);
  let transVec44 : Float32Array = new Float32Array(transVec44Array);

  console.log("lsystemtrans");
  console.log(lSystemTransforms);

  console.log("count");
  console.log(nInstances);

  console.log("length of vec");
  console.log(transVec41.length);
  let offsetsArray = [];
  let colorsArray = [];

  for(let i = 0; i < nInstances; i++) {
    for(let j = 0; j < nInstances; j++) {

      offsetsArray.push(0);
      offsetsArray.push(0);
      offsetsArray.push(0);

      colorsArray.push(1.0);
      colorsArray.push(i / nInstances);
      colorsArray.push(j / nInstances);
      colorsArray.push(1.0); // Alpha channel
    }
  }
  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);

  // new matrix to set vbo transformations
  //square.setInstanceLSystemVBOs(transVec41, transVec42, transVec43, transVec44, colors);
  //square.setInstanceVBOs(offsets, colors);
  //square.setNumInstances(nInstances); // grid of "particles"
  
  mesh.setInstanceLSystemVBOs(transVec41, transVec42, transVec43, transVec44, colors);
  mesh.setInstanceVBOs(offsets, colors);
  mesh.setNumInstances(nInstances);
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
  //gl.enable(gl.BLEND);
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
      mesh,
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

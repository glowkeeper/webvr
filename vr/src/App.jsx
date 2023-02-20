import { useEffect } from 'react'

//import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js'
import { Color3 } from '@babylonjs/core/Maths/math.color.js'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
//import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js'
import { Scene } from '@babylonjs/core/scene.js'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'
import { WebXRExperienceHelper } from '@babylonjs/core/XR/webXRExperienceHelper.js'

import "@babylonjs/core/Helpers/sceneHelpers";
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
// import { DefaultLoadingScreen } from '@babylonjs/core/Loading/loadingScreen';
import "@babylonjs/loaders/glTF";

// Makes scene.beginAnimation is not a function error go away
import "@babylonjs/core/Animations/animatable"

// Required for EnvironmentHelper
import '@babylonjs/core/Materials/Textures/Loaders'

// Enable GLTF/GLB loader for loading controller models from WebXR Input registry
import '@babylonjs/loaders/glTF'

// Without this next import, an error message like this occurs loading controller models:
//  Build of NodeMaterial failed" error when loading controller model
//  Uncaught (in promise) Build of NodeMaterial failed: input rgba from block
//  FragmentOutput[FragmentOutputBlock] is not connected and is not optional.
import '@babylonjs/core/Materials/Node/Blocks'

import './App.css'

function App() {

  const createScene = (engine) => {

    const scene = new Scene(engine)
    scene.createDefaultEnvironment()

    return scene

  }

  const createCamera = (canvas, scene) => {

    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    return camera

  }

  const createLight = (scene) => {

    //console.log('in light!')
    
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    return light
  }

  const loadAssets = async (scene) => {

    try {

      const result = await SceneLoader.ImportMeshAsync("", "/assets/", "designStudioWithCeiling.glb", scene) 
      return result
      
    } catch (error) {

      console.error('Error:', error)
      return null
      
    } 
  }

  const setXR = async (scene) => {   

    const env = scene.createDefaultEnvironment();
    const xrHelper = await WebXRDefaultExperience.CreateAsync(scene)

    if (!xrHelper.baseExperience) {
      
      console.log("no xr support")
    
    } else {

      console.log("xr support! Good to go!")

      const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
      featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, {
        xrInput: xr.input,
        // add options here
        floorMeshes: [env.ground],
        optionalFeatures: true
      });
    }
  }

  const render = (engine, scene) => {
    engine.runRenderLoop(() => {
      scene.render()
    })
  }

  const init = async () => {

    const canvas = document.getElementById("myCanvas");
    if ( canvas ) {

      // Create engine and a scene
      const babylonEngine = new Engine(canvas, true)

      const scene = createScene(babylonEngine)
      const camera = createCamera(canvas, scene)
      const light = createLight(scene)

      const mesh = await loadAssets(scene)
      if ( mesh ) {

        setXR(scene)
        render(babylonEngine, scene)
      }
    }
  }
  
  useEffect(() => { 

    init()    

  }, []);

  return (
    <div className="App">
      <div>
        <h1>Design Studio</h1>
        <canvas
          id="myCanvas"
          width="1024"
          height="768"
        >
          Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    </div>
  )
}

export default App
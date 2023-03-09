import { useEffect } from 'react'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
//import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js'
import { Color3 } from '@babylonjs/core/Maths/math.color.js'
import { Engine } from '@babylonjs/core/Engines/engine.js'
//import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
//import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js'
import { Scene } from '@babylonjs/core/scene.js'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js'
 import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'
//import { WebXRExperienceHelper } from '@babylonjs/core/XR/webXRExperienceHelper.js'
import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager.js'
import "@babylonjs/core/Helpers/sceneHelpers";
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

import { WebXRState } from '@babylonjs/core/XR/webXRTypes'

import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture.js'

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

import { TerrainMaterial } from '@babylonjs/materials/terrain/terrainMaterial'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'

import './App.css'

const rgbScalar = 256

function App() {

  const createScene = (engine) => {

    const scene = new Scene(engine)
    return scene

  }

  const createEnvironment = (scene) => {
    //xrCamera.setTransformationFromNonVRCamera();

    const terrain = MeshBuilder.CreateGroundFromHeightMap("terrain", "assets/textures/heightMap.png", {width: 1000, height: 1000, subdivisions: 1000, minHeight: 0, maxHeight: 5, updateable: false}, scene)

    const terrainMaterial = new TerrainMaterial("assets/terrainMaterial", scene)
    terrainMaterial.mixTexture = new Texture("assets/textures/mixMap.png", scene)
    terrainMaterial.diffuseTexture1 = new Texture("assets/textures/grass.png", scene)
    terrainMaterial.diffuseTexture2 = new Texture("assets/textures/rock.png", scene)
    terrainMaterial.diffuseTexture3 = new Texture("assets/textures/floor.png", scene)

    terrainMaterial.bumpTexture1 = new Texture("assets/textures/grassn.png", scene)
    terrainMaterial.bumpTexture2 = new Texture("assets/textures/rockn.png", scene)
    terrainMaterial.bumpTexture3 = new Texture("assets/textures/floor_bump.png", scene)

    terrain.material = terrainMaterial

    scene.ambientColor = new Color3(235 / rgbScalar, 149 / rgbScalar, 52 / rgbScalar);

    // const groundMaterial = new StandardMaterial("ground", scene);
    // groundMaterial.backFaceCulling = false;
    // groundMaterial.diffuseColor = new Color3(48 / rgbScalar, 138 / rgbScalar, 59 / rgbScalar);
    // groundMaterial.diffuseTexture = new Texture("assets/textures/grass.png", scene);

    const environment = scene.createDefaultEnvironment({ 
      createSkybox: false,
      // skyboxSize: 1000,
      // skyboxColor: Color3.Teal(),
      enableGroundShadow: true,
      createGround: true,
      groundSize: 1000,
      enableGroundMirror: true,
      groundYBias: 1 
    })

    //environment.setMainColor(new Color3(116 / rgbScalar, 185 / rgbScalar, 255 / rgbScalar))
    // environment.ground.parent.position.y = 0;
    // // environment.ground.position.y = 0
    // environment.ground.material = groundMaterial;
    environment.ground.material = terrain.material
    
    const skyboxMaterial = new StandardMaterial("skyBox", scene);      
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;      
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;      
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

    scene.fogColor = new Color3(179 / rgbScalar, 156 / rgbScalar, 118 / rgbScalar);
    scene.fogDensity = 0.0001
    scene.fogMode = Scene.FOGMODE_EXP

    return environment
  }

  const createCamera = (canvas, scene) => {

    /*const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());*/
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), scene)
    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new Vector3(0, 100, 200))
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

      // const asset = SceneLoader.Append("/assets/", "designStudioWithCeiling.glb", scene)
      // console.log('asset', asset)   

      const asset = await SceneLoader.ImportMeshAsync("", "/assets/", "designStudioWithCeiling.glb", scene) 
      console.log('asset', asset)      

      asset.meshes.forEach(mesh => {
        mesh.material = new StandardMaterial("");
        mesh.material.diffuseColor = new Color3(213 / rgbScalar, 36 / rgbScalar, 36 / rgbScalar);
        mesh.position.addInPlace(new Vector3(0, 0.5, -100))
      })

      return asset
      
    } catch (error) {

      console.error('Error:', error)
      return null
      
    } 
  }

  const setXR = async (scene, environment, camera) => {   

    //console.log('env', environment)

    const xrHelper = await WebXRDefaultExperience.CreateAsync(scene)

    if (xrHelper.baseExperience) {

      console.log("xr support! Good to go!", xrHelper)

      const featuresManager = xrHelper.baseExperience.featuresManager
      featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
        xrInput: xrHelper.input,
        floorMeshes: [environment.ground],
        defaultTargetMeshOptions: {
          teleportationFillColor: "#55FF99",
          teleportationBorderColor: "blue",
        },
      });

      xrHelper.input.xrCamera.position.set(0, 10, -100);


      console.log('features', featuresManager)
    
    } else {

        console.log("no xr support?", error) 
    
    } 
  }

  const render = (engine, scene) => {
    engine.runRenderLoop(() => {
      scene.render()
    })

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  const init = async () => {

    const canvas = document.getElementById("myCanvas");
    if ( canvas ) {

      // Create engine and a scene
      const babylonEngine = new Engine(canvas, true)

      const scene = createScene(babylonEngine)
      const environment = createEnvironment(scene)
      const camera = createCamera(canvas, scene)
      const light = createLight(scene)

      const assets = await loadAssets(scene)
      if ( assets ) {

        setXR(scene, environment, camera)
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
        <h1>WebXR Design Studio</h1>
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
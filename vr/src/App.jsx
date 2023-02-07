import { useEffect } from 'react'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
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
  
  useEffect(() => {
    const canvas = document.getElementById("myCanvas");

    // Create engine and a scene
    const babylonEngine = new Engine(canvas, true)
    const scene = new Scene(babylonEngine)

    // Add a basic light
    new HemisphericLight('light1', new Vector3(0, 2, 0), scene)

    // Create a default environment (skybox, ground mesh, etc)
    const envHelper = new EnvironmentHelper({
      skyboxSize: 30,
      groundColor: new Color3(0.5, 0.5, 0.5),
    }, scene)

    // Add a camera for the non-VR view in browser
    const camera = new ArcRotateCamera("Camera", -(Math.PI / 4) * 3, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
    camera.attachControl(true)

    // Add a sphere to have something to look at
    const sphereD = 1.0
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
    sphere.position.x = 0
    sphere.position.y = sphereD * 2
    sphere.position.z = 0
    const rMat = new StandardMaterial("matR", scene)
    rMat.diffuseColor = new Color3(1.0, 0, 0)
    sphere.material = rMat

    // Setup default WebXR experience
    // Use the enviroment floor to enable teleportation
    WebXRDefaultExperience.CreateAsync(scene, {
      floorMeshes: [envHelper?.ground],
      optionalFeatures: true,
    })

    // Run render loop
    babylonEngine.runRenderLoop(() => {
      scene.render()
    })

  }, []);

  return (
    <div className="App">
      <div>
        <h1>HTML5 Canvas + React.js</h1>
        <canvas
          id="myCanvas"
          width="200"
          height="100"
          style={{ border: "10px solid #d3d3d3" }}
        >
          Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    </div>
  )
}

export default App
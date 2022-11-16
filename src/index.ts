import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    // addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    // await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/m_armchair.glb")

    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    onUpdate()

    function setupScrollAnimation() {
      const tl = gsap.timeline()
    
      //first section
    
    tl
    .to(position, {x: -3.85, y: 1.82, z: 6.44,
      scrollTrigger: {
        trigger: ".second", 
        start:"top bottom", 
        end: "top top", 
        scrub: true,
        immediateRender: false
      },
      onUpdate})

      .to(".section--one--container", {xPercent:'-150', opacity:0,
        scrollTrigger: {
          trigger: ".second", 
          start:"top bottom", 
          end: "top 80%", 
          scrub: 1,
          immediateRender: false
        },
        onUpdate})

    .to(target, {x: 0.43, y: 0.63, z: 2.45,
      scrollTrigger: {
        trigger: ".second", 
        start:"top bottom", 
        end: "top top",
        scrub: true,
        immediateRender: false
      }})

      //last section

      .to(position, {x: 3.29, y: 7.73, z: 5.04,
        scrollTrigger: {
          trigger: ".third", 
          start:"top bottom", 
          end: "top top",
          scrub: true,
          immediateRender: false
        },
        onUpdate})
  
      .to(target, {x: -0.48, y: 1.46, z: 2.08,
        scrollTrigger: {
          trigger: ".third", 
          start:"top bottom", 
          end: "top top",
          scrub: true,
          immediateRender: false
        }})

    }

    setupScrollAnimation()

    //WEBGI UPDATE
    let needsUpdate = true

    function onUpdate() {
      needsUpdate = true
      // viewer.renderer.resetShadows()
      viewer.setDirty
    }

    viewer.addEventListener('preFrame', () => {
      if(needsUpdate){
        camera.positionTargetUpdated(true)
        needsUpdate = false
      }
    })
}


setupViewer()

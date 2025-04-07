"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Color } from "three"

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isHighResLoaded, setIsHighResLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return

    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Create a starfield
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 10000
    const positions = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Create an atmospheric glow using a custom shader
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const atmosphereFragmentShader = `
     uniform vec3 glowColor;
     varying vec3 vNormal;
     void main() {
       float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
       gl_FragColor = vec4(glowColor, 1.0) * intensity;
     }
   `
    const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new Color(0x3a86ff) },
      },
    })
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphereMesh)

    // Create wireframe globe
    const wireframeGeometry = new THREE.SphereGeometry(5, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a86ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframeGlobe)

    // Create solid globe (initially invisible)
    const solidGeometry = new THREE.SphereGeometry(4.9, 64, 64)
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a237e,
      transparent: true,
      opacity: 0,
    })
    const solidGlobe = new THREE.Mesh(solidGeometry, solidMaterial)
    scene.add(solidGlobe)

    // Store original vertex positions for glitch effect
    const originalWireframePositions = wireframeGeometry.attributes.position.array.slice()
    const originalSolidPositions = solidGeometry.attributes.position.array.slice()

    // Create vertex noise arrays for continuous glitch
    const wireframeNoiseFactors = new Float32Array(wireframeGeometry.attributes.position.count)
    const solidNoiseFactors = new Float32Array(solidGeometry.attributes.position.count)

    // Initialize noise factors with random values
    for (let i = 0; i < wireframeNoiseFactors.length; i++) {
      wireframeNoiseFactors[i] = Math.random() * 2 - 1
    }

    for (let i = 0; i < solidNoiseFactors.length; i++) {
      solidNoiseFactors[i] = Math.random() * 2 - 1
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    camera.position.z = 10

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = false

    const colors = [
      new Color(0x3a86ff), // Blue
      new Color(0x8338ec), // Purple
      new Color(0xff006e), // Pink
    ]
    let colorIndex = 0
    let nextColorIndex = 1
    let colorT = 0
    const colorTransitionSpeed = 0.005

    const lerpColor = (a: Color, b: Color, t: number) => {
      const color = new Color()
      color.r = a.r + (b.r - a.r) * t
      color.g = a.g + (b.g - a.g) * t
      color.b = a.b + (b.b - a.b) * t
      return color
    }

    // Create a glitch overlay for continuous effect
    const glitchOverlayGeometry = new THREE.PlaneGeometry(30, 30)
    const glitchOverlayMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const glitchOverlay = new THREE.Mesh(glitchOverlayGeometry, glitchOverlayMaterial)
    glitchOverlay.position.z = 5
    scene.add(glitchOverlay)

    let animationId: number
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.001 // Very slow time increment for glitch effect

      // Apply continuous slow glitch effect
      const glitchIntensity = (Math.sin(time * 0.2) * 0.5 + 0.5) * 0.015 // Slow sine wave for glitch intensity
      const scanlineEffect = Math.sin(time * 0.5) * 0.5 + 0.5 // Scanline effect

      // Apply subtle vertex displacement
      const wireframePositions = wireframeGeometry.attributes.position.array
      const solidPositions = solidGeometry.attributes.position.array

      // Apply different glitch patterns based on position
      for (let i = 0; i < wireframePositions.length; i += 3) {
        const vertexIndex = i / 3
        const noiseFactor = wireframeNoiseFactors[vertexIndex]

        // Create a wave-like distortion that moves slowly
        const waveX = Math.sin(time * 0.3 + noiseFactor * 10) * glitchIntensity
        const waveY = Math.cos(time * 0.2 + noiseFactor * 5) * glitchIntensity
        const waveZ = Math.sin(time * 0.4 + noiseFactor * 7) * glitchIntensity

        // Apply distortion
        wireframePositions[i] = originalWireframePositions[i] + waveX
        wireframePositions[i + 1] = originalWireframePositions[i + 1] + waveY
        wireframePositions[i + 2] = originalWireframePositions[i + 2] + waveZ
      }

      // Apply similar effect to solid globe if loaded
      if (isHighResLoaded) {
        for (let i = 0; i < solidPositions.length; i += 3) {
          const vertexIndex = i / 3
          const noiseFactor = solidNoiseFactors[vertexIndex]

          // Create a wave-like distortion that moves slowly
          const waveX = Math.sin(time * 0.3 + noiseFactor * 10) * glitchIntensity * 0.7
          const waveY = Math.cos(time * 0.2 + noiseFactor * 5) * glitchIntensity * 0.7
          const waveZ = Math.sin(time * 0.4 + noiseFactor * 7) * glitchIntensity * 0.7

          // Apply distortion
          solidPositions[i] = originalSolidPositions[i] + waveX
          solidPositions[i + 1] = originalSolidPositions[i + 1] + waveY
          solidPositions[i + 2] = originalSolidPositions[i + 2] + waveZ
        }
      }

      wireframeGeometry.attributes.position.needsUpdate = true
      solidGeometry.attributes.position.needsUpdate = true

      // Scanline effect - subtle overlay opacity changes
      glitchOverlayMaterial.opacity = scanlineEffect * 0.02

      // Color transition logic
      colorT += colorTransitionSpeed
      if (colorT >= 1) {
        colorT = 0
        colorIndex = nextColorIndex
        nextColorIndex = (nextColorIndex + 1) % colors.length
      }

      const currentColor = lerpColor(colors[colorIndex], colors[nextColorIndex], colorT)

      // Update materials with new color
      if (wireframeGlobe.material instanceof THREE.MeshBasicMaterial) {
        wireframeGlobe.material.color = currentColor.clone()

        // Add subtle color distortion
        const colorDistortion = Math.sin(time * 0.7) * 0.02
        wireframeGlobe.material.color.offsetHSL(
          Math.sin(time * 0.5) * 0.01,
          colorDistortion,
          Math.cos(time * 0.3) * 0.01,
        )
      }

      if (solidGlobe.material instanceof THREE.MeshPhongMaterial) {
        solidGlobe.material.color = currentColor.clone()

        // Add subtle opacity variation
        if (isHighResLoaded) {
          const opacityVariation = Math.sin(time * 0.6) * 0.05
          solidGlobe.material.opacity = Math.min(1, Math.max(0.8, 0.95 + opacityVariation))
        }
      }

      if (atmosphereMesh.material instanceof THREE.ShaderMaterial) {
        // Add subtle glow color variation
        const glowColor = currentColor.clone()
        glowColor.offsetHSL(Math.sin(time * 0.4) * 0.02, 0, 0)
        atmosphereMesh.material.uniforms.glowColor.value = glowColor

        // Add subtle glow size pulsation
        const glowPulse = 1 + Math.sin(time * 0.3) * 0.03
        atmosphereMesh.scale.set(glowPulse, glowPulse, glowPulse)
      }

      // Rotate the globes, atmosphere, and starfield for dynamic effect
      wireframeGlobe.rotation.y += 0.001
      solidGlobe.rotation.y += 0.001
      atmosphereMesh.rotation.y += 0.0005
      stars.rotation.y += 0.0001
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Load high-resolution textures
    const textureLoader = new THREE.TextureLoader()
    const loadTexture = (url: string) =>
      new Promise((resolve) => {
        textureLoader.load(url, (texture) => resolve(texture))
      })

    Promise.all([
      loadTexture("/earth-texture-compressed.jpg"),
      loadTexture("/earth-bump-compressed.jpg"),
      loadTexture("/earth-specular-compressed.jpg"),
    ]).then(([texture, bumpMap, specularMap]) => {
      const highResMaterial = new THREE.MeshPhongMaterial({
        map: texture as THREE.Texture,
        bumpMap: bumpMap as THREE.Texture,
        bumpScale: 0.05,
        specularMap: specularMap as THREE.Texture,
        specular: new THREE.Color("grey"),
      })

      // Transition to the high-res textured globe
      const transitionDuration = 1 // seconds
      const startTime = Date.now()

      const transitionToHighRes = () => {
        const elapsedTime = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsedTime / transitionDuration, 1)

        solidGlobe.material = highResMaterial
        solidGlobe.material.opacity = progress
        wireframeMaterial.opacity = 0.5 * (1 - progress)

        if (progress < 1) {
          requestAnimationFrame(transitionToHighRes)
        } else {
          setIsHighResLoaded(true)
          scene.remove(wireframeGlobe)
        }
        renderer.render(scene, camera)
      }

      transitionToHighRes()
    })

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    const hintTimer = setTimeout(() => {
      setShowHint(false)
    }, 3000) // Hide hint after 3 seconds

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      mountRef.current?.removeChild(renderer.domElement)
      controls.dispose()
      clearTimeout(hintTimer)
    }
  }, [])

  return (
    <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0">
      {showHint && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-30 text-white text-sm px-3 py-1 rounded-full transition-opacity duration-1000 opacity-80 hover:opacity-100">
          Drag to explore
        </div>
      )}
    </div>
  )
}


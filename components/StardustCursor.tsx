"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  size: number
  color: THREE.Color
  alpha: number
  life: number
  maxLife: number
  active: boolean
}

export default function StardustCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const mouseSpeed = useRef<number>(0)
  const isActive = useRef<boolean>(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      0.1,
      1000,
    )
    camera.position.z = 10

    // Determine particle count based on device
    const isMobile = window.innerWidth < 768
    const maxParticles = isMobile ? 75 : 150

    // Create particle system
    const particles: Particle[] = []
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(maxParticles * 3)
    const colors = new Float32Array(maxParticles * 4) // RGBA

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 4))

    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Create particle texture (glowing dot)
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load("/particle.png", (texture) => {
      particleMaterial.map = texture
      particleMaterial.needsUpdate = true
    })

    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Initialize particle pool
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        size: 0,
        color: new THREE.Color(),
        alpha: 0,
        life: 0,
        maxLife: 0,
        active: false,
      })
    }

    // Define color palette
    const colorPalette = [
      new THREE.Color("#8A2BE2"), // Purple
      new THREE.Color("#4169E1"), // Royal Blue
      new THREE.Color("#00BFFF"), // Deep Sky Blue
      new THREE.Color("#F8F8FF"), // White
    ]

    // Function to spawn a new particle
    const spawnParticle = (x: number, y: number, speed: number) => {
      // Find an inactive particle
      const particle = particles.find((p) => !p.active)
      if (!particle) return

      // Activate particle
      particle.active = true

      // Set position
      particle.position.set(x - window.innerWidth / 2, -y + window.innerHeight / 2, 0)

      // Set velocity based on mouse speed and random direction
      const angle = Math.random() * Math.PI * 2
      const speedFactor = Math.min(speed * 0.05, 2)
      particle.velocity.set(
        Math.cos(angle) * speedFactor * (Math.random() * 0.5 + 0.5),
        Math.sin(angle) * speedFactor * (Math.random() * 0.5 + 0.5),
        0,
      )

      // Set size
      particle.size = Math.random() * 2.5 + 0.5

      // Set color
      const colorIndex = Math.floor(Math.random() * colorPalette.length)
      particle.color.copy(colorPalette[colorIndex])

      // Set life
      particle.alpha = Math.random() * 0.5 + 0.5
      particle.life = 0
      particle.maxLife = Math.random() * 1.5 + 0.5 // 0.5 to 2 seconds
    }

    // Update particles
    const updateParticles = (deltaTime: number) => {
      const positions = particleGeometry.attributes.position.array as Float32Array
      const colors = particleGeometry.attributes.color.array as Float32Array

      let activeCount = 0

      particles.forEach((particle, i) => {
        if (!particle.active) return

        // Update life
        particle.life += deltaTime

        if (particle.life >= particle.maxLife) {
          particle.active = false
          return
        }

        activeCount++

        // Update position
        particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime))

        // Add some physics - slight gravity effect
        particle.velocity.y -= 0.01 * deltaTime

        // Slow down over time
        particle.velocity.multiplyScalar(0.99)

        // Calculate alpha based on life
        const lifeRatio = particle.life / particle.maxLife
        const alpha = particle.alpha * (1 - lifeRatio)

        // Update position in buffer
        const i3 = i * 3
        positions[i3] = particle.position.x
        positions[i3 + 1] = particle.position.y
        positions[i3 + 2] = particle.position.z

        // Update color in buffer
        const i4 = i * 4
        colors[i4] = particle.color.r
        colors[i4 + 1] = particle.color.g
        colors[i4 + 2] = particle.color.b
        colors[i4 + 3] = alpha
      })

      particleGeometry.attributes.position.needsUpdate = true
      particleGeometry.attributes.color.needsUpdate = true

      return activeCount
    }

    // Animation loop
    let lastTime = 0
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      // Calculate mouse speed
      if (isActive.current) {
        const dx = mousePosition.current.x - lastMousePosition.current.x
        const dy = mousePosition.current.y - lastMousePosition.current.y
        mouseSpeed.current = Math.sqrt(dx * dx + dy * dy)

        lastMousePosition.current.x = mousePosition.current.x
        lastMousePosition.current.y = mousePosition.current.y

        // Spawn particles based on mouse speed
        const particlesToSpawn = Math.floor(mouseSpeed.current * 0.2)
        for (let i = 0; i < particlesToSpawn; i++) {
          spawnParticle(mousePosition.current.x, mousePosition.current.y, mouseSpeed.current)
        }
      }

      // Update particles
      const activeCount = updateParticles(deltaTime)

      // Render scene
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    // Start animation
    requestAnimationFrame(animate)

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY

      if (!isActive.current) {
        isActive.current = true
        lastMousePosition.current.x = e.clientX
        lastMousePosition.current.y = e.clientY
      }
    }

    const handleMouseLeave = () => {
      isActive.current = false
    }

    const handleResize = () => {
      // Update camera
      camera.left = -window.innerWidth / 2
      camera.right = window.innerWidth / 2
      camera.top = window.innerHeight / 2
      camera.bottom = -window.innerHeight / 2
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", handleResize)

    // Create a fallback particle texture if loading fails
    const createFallbackTexture = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 32, 32)

        const texture = new THREE.CanvasTexture(canvas)
        particleMaterial.map = texture
        particleMaterial.needsUpdate = true
      }
    }

    createFallbackTexture()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)

      scene.remove(particleSystem)
      particleGeometry.dispose()
      particleMaterial.dispose()
      if (particleMaterial.map) particleMaterial.map.dispose()
      renderer.dispose()

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none"
      style={{ cursor: "none" }}
    />
  )
}


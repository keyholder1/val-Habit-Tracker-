'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function InteractiveBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 50

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement)

        // Create particles
        const particlesCount = 3000
        const positions = new Float32Array(particlesCount * 3)
        const velocities = new Float32Array(particlesCount * 3)
        const colors = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100
            positions[i + 1] = (Math.random() - 0.5) * 100
            positions[i + 2] = (Math.random() - 0.5) * 100

            velocities[i] = (Math.random() - 0.5) * 0.02
            velocities[i + 1] = (Math.random() - 0.5) * 0.02
            velocities[i + 2] = (Math.random() - 0.5) * 0.02

            // Gradient colors (purple to blue)
            const color = new THREE.Color()
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6)
            colors[i] = color.r
            colors[i + 1] = color.g
            colors[i + 2] = color.b
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        // Mouse movement handler
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
        }

        // Window resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', handleResize)

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)

            const positions = particles.geometry.attributes.position.array as Float32Array

            for (let i = 0; i < particlesCount * 3; i += 3) {
                // Apply velocities
                positions[i] += velocities[i]
                positions[i + 1] += velocities[i + 1]
                positions[i + 2] += velocities[i + 2]

                // Mouse interaction
                const dx = mouseRef.current.x * 30 - positions[i]
                const dy = mouseRef.current.y * 30 - positions[i + 1]
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 15) {
                    const force = (15 - distance) / 15
                    positions[i] -= dx * force * 0.03
                    positions[i + 1] -= dy * force * 0.03
                }

                // Boundary wrapping
                if (positions[i] > 50) positions[i] = -50
                if (positions[i] < -50) positions[i] = 50
                if (positions[i + 1] > 50) positions[i + 1] = -50
                if (positions[i + 1] < -50) positions[i + 1] = 50
                if (positions[i + 2] > 50) positions[i + 2] = -50
                if (positions[i + 2] < -50) positions[i + 2] = 50
            }

            particles.geometry.attributes.position.needsUpdate = true
            particles.rotation.y += 0.0005

            renderer.render(scene, camera)
        }

        animate()

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }
            geometry.dispose()
            material.dispose()
            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    )
}

'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface AntigravityProps {
    count?: number
    magnetRadius?: number
    ringRadius?: number
    waveSpeed?: number
    waveAmplitude?: number
    particleSize?: number
    lerpSpeed?: number
    color?: string
    autoAnimate?: boolean
    particleVariance?: number
    rotationSpeed?: number
    depthFactor?: number
    pulseSpeed?: number
    particleShape?: 'capsule' | 'sphere'
    fieldStrength?: number
}

function Particles({
    count = 300,
    magnetRadius = 6,
    ringRadius = 7,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 1.0,
    lerpSpeed = 0.05,
    color = "#5227FF",
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10
}: AntigravityProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const { positions, velocities, phases } = useMemo(() => {
        const positions = []
        const velocities = []
        const phases = []
        for (let i = 0; i < count; i++) {
            positions.push((Math.random() - 0.5) * 20)
            positions.push((Math.random() - 0.5) * 20)
            positions.push((Math.random() - 0.5) * 10 - 5) // Slight depth variance
            velocities.push(Math.random() * 0.02)
            phases.push(Math.random() * Math.PI * 2)
        }
        return {
            positions: new Float32Array(positions),
            velocities: new Float32Array(velocities),
            phases: new Float32Array(phases)
        }
    }, [count])

    const { viewport } = useThree()
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const targetPositions = useMemo(() => new Float32Array(positions), [positions])

    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.getElapsedTime()
        const mouse = state.pointer

        // Mouse in world coordinates at Z=0
        const mx = (mouse.x * viewport.width) / 2
        const my = (mouse.y * viewport.height) / 2

        for (let i = 0; i < count; i++) {
            const ix = i * 3
            const iy = i * 3 + 1
            const iz = i * 3 + 2

            // Base Wave Motion
            if (autoAnimate) {
                targetPositions[iy] += Math.sin(time * waveSpeed + phases[i]) * 0.02 * waveAmplitude
                targetPositions[ix] += Math.cos(time * waveSpeed * 0.5 + phases[i]) * 0.01 * waveAmplitude
            }

            // Magnet / Repulsion Logic
            const dx = mx - targetPositions[ix]
            const dy = my - targetPositions[iy]
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < magnetRadius) {
                const force = fieldStrength * (1 - dist / magnetRadius)
                const angle = Math.atan2(dy, dx)
                targetPositions[ix] -= Math.cos(angle) * force * 0.05
                targetPositions[iy] -= Math.sin(angle) * force * 0.05
            }

            // Return to original 'ring' or area (simple containment for now)
            // If too far, pull back
            if (targetPositions[ix] > 15) targetPositions[ix] -= 0.1
            if (targetPositions[ix] < -15) targetPositions[ix] += 0.1
            if (targetPositions[iy] > 15) targetPositions[iy] -= 0.1
            if (targetPositions[iy] < -15) targetPositions[iy] += 0.1

            // Lerp current position to target
            // Actually, we are updating targetPositions directly, so just use them
            // For smoother lerp we'd need separate current vs target state, but this is simple enough

            dummy.position.set(
                targetPositions[ix],
                targetPositions[iy],
                targetPositions[iz]
            )

            // Rotation
            dummy.rotation.x = time * rotationSpeed + phases[i]
            dummy.rotation.z = time * rotationSpeed * 0.5 + phases[i]

            // Scale
            dummy.scale.setScalar(particleSize)

            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' ? (
                <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
            ) : (
                <sphereGeometry args={[0.2, 16, 16]} />
            )}
            <meshStandardMaterial
                color={color}
                roughness={0.4}
                metalness={0.6}
                emissive={color}
                emissiveIntensity={0.2}
            />
        </instancedMesh>
    )
}

export default function Antigravity(props: AntigravityProps) {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Particles {...props} />
            </Canvas>
        </div>
    )
}

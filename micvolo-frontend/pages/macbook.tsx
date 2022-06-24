import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, ContactShadows } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a as three } from '@react-spring/three'
import { a as web } from '@react-spring/web'

const vec = new THREE.Vector3()

// @ts-ignore
function Model({ open, hinge, ...props }) {
    const group = useRef()
    // Load model
    // @ts-ignore
    const { nodes, materials } = useGLTF('/3d/mac-draco.glb')
    // Take care of cursor state on hover
    const [hovered, setHovered] = useState(false)
    useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])
    // Make it float in the air when it's opened
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        state.camera.position.lerp(vec.set(0, 0, open ? -24 : -32), 0.1)
        state.camera.lookAt(0, 0, 0)
        // @ts-ignore
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, open ? Math.cos(t / 2) / 8 + 0.25 : 0, 0.1)
        // @ts-ignore
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(t / 4) / 4 : 0, 0.1)
        // @ts-ignore
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, open ? Math.sin(t / 4) / 4 : 0, 0.1)
        // @ts-ignore
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, open ? (-2 + Math.sin(t)) / 3 : -4.3, 0.1)
    })
    // The view was auto-generated by: https://github.com/pmndrs/gltfjsx
    // Events and spring animations were added afterwards
    return (
        <group
            // @ts-ignore
            ref={group}
            {...props}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onPointerOut={(e) => setHovered(false)}
            dispose={null}>
            <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
                <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
                    <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
                    <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
                    <mesh material={materials['screen.001']} geometry={nodes['Cube008_2'].geometry} />
                </group>
            </three.group>
            <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
            <group position={[0, -0.1, 3.39]}>
                <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
                <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
            </group>
            <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
        </group>
    )
}

export default function App() {

    // This flag controls open state, alternates between true & false
    const [open, setOpen] = useState(false)
    // We turn this into a spring animation that interpolates between 0 and 1
    const props = useSpring({ open: Number(open) })
    return (
        <web.main className="absolute inset-0" style={{ background: props.open.to([0, 1], ['black', '#1900ff'])}}>
            <web.h1 className="absolute top-[50%] left-[50%] font-semibold -tracking-[.075em] inline-block text-8xl text-white" style={{ opacity: props.open.to([0, 1], [1, 0]), transform: props.open.to((o) => `translate3d(-50%,${o * 50 - 100}px,0)`) }}>
                Stra Studio
            </web.h1>
            <Canvas camera={{ position: [0, 0, 0], fov: 35 }}>
                <Suspense fallback={null}>
                    <group rotation={[0, Math.PI, 0]} onClick={(e) => (e.stopPropagation(), setOpen(!open))}>
                        <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
                    </group>
                    <Environment preset="city" />
                </Suspense>
                <ContactShadows rotation-x={Math.PI / 2} position={[0, -4.5, 0]} opacity={0.4} width={20} height={20} blur={2} far={4.5} />
            </Canvas>
        </web.main>
    )
}

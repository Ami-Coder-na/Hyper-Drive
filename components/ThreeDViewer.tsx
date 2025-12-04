import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MousePointer2, ZoomIn, ZoomOut, Rotate3D } from 'lucide-react';

interface ThreeDViewerProps {
  type: string;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const vehicleRef = useRef<THREE.Group | null>(null);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Transparent background to blend with UI
    scene.background = null; 

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 50); // Neon Blue light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xbc13fe, 2, 50); // Neon Purple light
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Procedural Vehicle Generation
    const vehicleGroup = new THREE.Group();
    
    // Materials - Holographic Wireframe look
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.1
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.0,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
    });

    // Determine geometry based on type (Basic approximations)
    if (type === 'BIKE') {
        // Frame
        const frameGeo = new THREE.BoxGeometry(2.5, 0.5, 0.4);
        const frame = new THREE.Mesh(frameGeo, bodyMaterial);
        frame.position.y = 0.5;
        vehicleGroup.add(frame);

        // Wheels
        const wheelGeo = new THREE.TorusGeometry(0.6, 0.1, 8, 16);
        const wheel1 = new THREE.Mesh(wheelGeo, wireframeMaterial);
        wheel1.position.set(-1, 0, 0);
        vehicleGroup.add(wheel1);
        
        const wheel2 = new THREE.Mesh(wheelGeo, wireframeMaterial);
        wheel2.position.set(1, 0, 0);
        vehicleGroup.add(wheel2);
    } else {
        // Cyber Truck / Car Style
        // Lower Chassis
        const chassisGeo = new THREE.BoxGeometry(3.6, 0.6, 1.8);
        const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
        chassis.position.y = 0.5;
        vehicleGroup.add(chassis);

        // Upper Cabin (Angular)
        const cabinGeo = new THREE.ConeGeometry(1.5, 1.2, 4);
        const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
        cabin.rotation.y = Math.PI / 4;
        cabin.scale.z = 0.8;
        cabin.position.y = 1.3;
        vehicleGroup.add(cabin);
        
        // Add wireframe overlay to chassis
        const chassisWire = new THREE.Mesh(chassisGeo, wireframeMaterial);
        chassisWire.position.y = 0.5;
        vehicleGroup.add(chassisWire);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
        wheelGeo.rotateX(Math.PI / 2);
        
        const positions = [
            [-1.2, 0, 0.9],
            [1.2, 0, 0.9],
            [-1.2, 0, -0.9],
            [1.2, 0, -0.9]
        ];

        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wireframeMaterial);
            wheel.position.set(pos[0], pos[1], pos[2]);
            vehicleGroup.add(wheel);
        });
    }

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 10, 0x00f3ff, 0x333333);
    gridHelper.position.y = -0.5;
    vehicleGroup.add(gridHelper);

    vehicleRef.current = vehicleGroup;
    scene.add(vehicleGroup);
    setLoading(false);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Idle rotation
      if (!isDragging.current && vehicleRef.current) {
         vehicleRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      // Simple geometry dispose omitted for brevity in this mock
    };
  }, [type]);

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !vehicleRef.current) return;

    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;

    vehicleRef.current.rotation.y += deltaX * 0.01;
    vehicleRef.current.rotation.x += deltaY * 0.01;

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomSpeed = 0.005;
    const newZ = cameraRef.current.position.z + e.deltaY * zoomSpeed;
    // Clamp zoom
    cameraRef.current.position.z = Math.min(Math.max(newZ, 3), 10);
  };

  const handleZoom = (direction: 'IN' | 'OUT') => {
      if (!cameraRef.current) return;
      const amount = direction === 'IN' ? -1 : 1;
      const newZ = cameraRef.current.position.z + amount;
      cameraRef.current.position.z = Math.min(Math.max(newZ, 3), 10);
  };

  return (
    <div className="relative w-full h-full group">
        <div 
            ref={containerRef} 
            className="w-full h-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        />
        
        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="text-neon-blue font-bold animate-pulse">Initializing Holo-Deck...</span>
            </div>
        )}

        {/* HUD Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={() => handleZoom('IN')}
                className="p-2 hover:bg-neon-blue/20 rounded-full text-white transition-colors"
                title="Zoom In"
            >
                <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/20 self-center" />
             <div className="flex items-center gap-2 px-2">
                <Rotate3D className="w-4 h-4 text-neon-blue animate-spin-slow" />
                <span className="text-[10px] text-neon-blue font-mono">INTERACTIVE 3D</span>
            </div>
            <div className="w-px h-6 bg-white/20 self-center" />
             <button 
                onClick={() => handleZoom('OUT')}
                className="p-2 hover:bg-neon-blue/20 rounded-full text-white transition-colors"
                title="Zoom Out"
            >
                <ZoomOut className="w-5 h-5" />
            </button>
        </div>
        
        {/* Helper Hint */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-3 py-1 rounded-lg border border-white/10 pointer-events-none">
            <div className="flex items-center gap-2 text-[10px] text-white/70">
                <MousePointer2 className="w-3 h-3" />
                <span>Drag to Rotate • Scroll to Zoom</span>
            </div>
        </div>
    </div>
  );
};

export default ThreeDViewer;

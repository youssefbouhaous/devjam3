import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonToast,
  IonFab,
  IonFabButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonRange,
  IonCard,
  IonCardContent,
  IonLoading
} from '@ionic/react';
import { 
  camera, 
  cube, 
  arrowBack, 
  add, 
  remove, 
  sync, 
  pin, 
  expand, 
  contract,
  refresh
} from 'ionicons/icons';
import './ARView.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTF type

const EnhancedARComponent: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State variables
  const [isARMode, setIsARMode] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('chair.glb');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isModelPlaced, setIsModelPlaced] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [debugMessage, setDebugMessage] = useState('');
  
  // Model transformation state
  const [scale, setScale] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const [positionZ, setPositionZ] = useState(-3); // Moved closer to camera for better visibility
  
  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Interaction variables
  const touchStartRef = useRef({ x: 0, y: 0 });
  const previousTouchRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(0);
  const isDoubleTapRef = useRef(false);
  const tapTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  // Available models - using all models from your directory
  const availableModels = [
    { value: 'a.glb', label: 'Model A' },
    { value: 'b.glb', label: 'Model B' },
    { value: 'c.glb', label: 'Model C' },
    { value: 'd.glb', label: 'Model D' },
    { value: 'chair.glb', label: 'Chair' },
    { value: 'sofa.glb', label: 'Sofa' },
    { value: 'plane.glb', label: 'Plane' }
  ];

  // Start AR experience
  const startAR = async () => {
    setIsARMode(true);
    
    // Start camera after state update
    setTimeout(() => {
      startCamera();
    }, 100);
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      
      setToastMessage('Camera started');
      setShowToast(true);
      
      // Initialize Three.js
      initThreeJS();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setToastMessage('Error accessing camera. Please check permissions.');
      setShowToast(true);
    }
  };

  // Stop AR experience
  const stopAR = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    // Stop animation loop
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clean up Three.js
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    
    setIsARMode(false);
    setIsModelLoaded(false);
    setIsModelPlaced(false);
    
    // Reset transformation values
    setScale(1);
    setRotationY(0);
    setPositionZ(-3);
  };

  // Initialize Three.js
  const initThreeJS = () => {
    if (!canvasRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 0;
    cameraRef.current = camera;
    
    // Create renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Use SRGBColorSpace instead of sRGBEncoding (which is deprecated)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Add lights - enhanced lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights from multiple directions for better illumination
    const pointLight1 = new THREE.PointLight(0xffffff, 1.0);
    pointLight1.position.set(0, 0, 5); // Front
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
    pointLight2.position.set(5, 5, 5); // Top-right
    scene.add(pointLight2);
    
    // Add a virtual ground plane to help with placement
    createGroundPlane();
    
    // Load the selected model
    loadGLBModel(selectedModel);
    
    // Add a simple helper cube to verify that rendering works
    addDebugCube();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set up touch event handlers for canvas
    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouchStart);
      canvasRef.current.addEventListener('touchmove', handleTouchMove);
      canvasRef.current.addEventListener('touchend', handleTouchEnd);
    }
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', handleTouchStart);
        canvasRef.current.removeEventListener('touchmove', handleTouchMove);
        canvasRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  };
  
  // Add a simple debug cube to verify Three.js is working
  const addDebugCube = () => {
    if (!sceneRef.current) return;
    
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -3);
    sceneRef.current.add(cube);
    
    setDebugMessage('Debug cube added');
  };
  
  // Create a semi-transparent ground plane to help with model placement
  const createGroundPlane = () => {
    if (!sceneRef.current) return;
    
    // Remove existing ground if any
    if (groundRef.current && sceneRef.current.children.includes(groundRef.current)) {
      sceneRef.current.remove(groundRef.current);
    }
    
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x808080,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2; // Rotate to be horizontal
    plane.position.y = -2; // Position below the model
    
    sceneRef.current.add(plane);
    groundRef.current = plane;
  };

  // Load GLB model
  const loadGLBModel = (modelPath: string) => {
    if (!sceneRef.current) return;
    
    setIsModelLoaded(false);
    setShowLoading(true);
    setLoadingProgress(0);
    
    // Remove existing model if any
    if (modelRef.current && sceneRef.current.children.includes(modelRef.current)) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    const loader = new GLTFLoader();
    const modelUrl = `/assets/models/${modelPath}`;
    
    console.log('Loading model:', modelUrl);
    setDebugMessage(`Loading model: ${modelUrl}`);
    
    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        console.log('Model loaded successfully:', modelPath);
        setDebugMessage(`Model loaded: ${modelPath}`);
        
        const model = gltf.scene;
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Log the size of the model
        const size = box.getSize(new THREE.Vector3());
        console.log('Model size:', size);
        
        // Scale model to reasonable size
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          // Use a larger scale factor for better visibility
          const scaleFactor = 3 / maxDim;
          model.scale.multiplyScalar(scaleFactor);
        }
        
        // Position in front of camera - closer for better visibility
        model.position.set(0, 0, positionZ);
        
        // Make model materials emissive for better visibility
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = child.material as THREE.MeshStandardMaterial;
            if (material.isMeshStandardMaterial) {
              material.emissive = new THREE.Color(0x333333);
              material.emissiveIntensity = 0.5;
            }
          }
        });
        
        // Apply current transformations
        updateModelTransform(model);
        
        // Add to scene
        sceneRef.current?.add(model);
        modelRef.current = model;
        
        setIsModelLoaded(true);
        setShowLoading(false);
        setToastMessage(`${modelPath} loaded successfully`);
        setShowToast(true);
      },
      (xhr) => {
        const progress = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(`Loading model: ${progress}%`);
        setLoadingProgress(progress);
      },
      (error) => {
        console.error('Error loading model:', error);
        setDebugMessage(`Error loading model: ${error.message}`);
        setShowLoading(false);
        setToastMessage(`Error loading ${modelPath}: ${error.message}`);
        setShowToast(true);
      }
    );
  };
  
  // Update model transformations
  const updateModelTransform = (model = modelRef.current) => {
    if (!model) return;
    
    // Apply scale
    model.scale.set(scale, scale, scale);
    
    // Apply rotation
    model.rotation.y = THREE.MathUtils.degToRad(rotationY);
    
    // Apply position - only update z if needed
    const currentPos = model.position;
    model.position.set(currentPos.x, currentPos.y, positionZ);
  };

  // Animation loop
  const animate = () => {
    if (!isARMode) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Update model transforms if needed
    if (modelRef.current) {
      updateModelTransform();
    }
    
    // Render scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Touch event handlers
  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    
    // Store initial touch position
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      previousTouchRef.current = { x: touch.clientX, y: touch.clientY };
      
      // Detect double tap
      const currentTime = new Date().getTime();
      const tapLength = currentTime - tapTimeRef.current;
      
      if (tapLength < 300 && tapLength > 0) {
        isDoubleTapRef.current = true;
        resetModelTransformation();
      } else {
        isDoubleTapRef.current = false;
      }
      
      tapTimeRef.current = currentTime;
      isDraggingRef.current = true;
    }
    // For pinch to zoom
    else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      isDraggingRef.current = false;
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    
    if (!isModelLoaded || !modelRef.current) return;
    
    // Handle rotation/movement with one finger
    if (event.touches.length === 1 && isDraggingRef.current) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - previousTouchRef.current.x;
      const deltaY = touch.clientY - previousTouchRef.current.y;
      
      // Top half of screen: rotate the model
      if (touch.clientY < window.innerHeight / 2) {
        // Update rotation based on horizontal movement
        setRotationY(prev => (prev + deltaX * 0.5) % 360);
      } 
      // Bottom half: move the model horizontally
      else {
        if (modelRef.current) {
          const currentPos = modelRef.current.position;
          modelRef.current.position.set(
            currentPos.x + deltaX * 0.01,
            currentPos.y - deltaY * 0.01,
            currentPos.z
          );
        }
      }
      
      previousTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
    // Handle pinch-to-zoom with two fingers
    else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const scaleFactor = distance / touchDistanceRef.current;
      
      // Update scale based on pinch gesture
      if (scaleFactor !== 1) {
        setScale(prev => {
          const newScale = prev * scaleFactor;
          // Limit scale to reasonable range
          return Math.min(Math.max(newScale, 0.2), 10);
        });
        
        touchDistanceRef.current = distance;
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) {
      isDraggingRef.current = false;
    }
  };

  // Reset model transformation
  const resetModelTransformation = () => {
    setScale(1);
    setRotationY(0);
    setPositionZ(-3);
    
    // Reset position if it was moved
    if (modelRef.current) {
      modelRef.current.position.set(0, 0, -3);
    }
    
    setToastMessage('Model reset');
    setShowToast(true);
  };

  // "Place" the model - simulating anchoring in AR
  const placeModel = () => {
    setIsModelPlaced(true);
    
    // Hide the ground plane when model is placed
    if (groundRef.current) {
      groundRef.current.visible = false;
    }
    
    setToastMessage('Model placed');
    setShowToast(true);
  };

  // Change the current model
  const changeModel = (modelPath: string) => {
    setSelectedModel(modelPath);
    loadGLBModel(modelPath);
    setIsModelPlaced(false);
    
    // Show the ground plane again
    if (groundRef.current) {
      groundRef.current.visible = true;
    }
  };

  // Handle model slider changes
  useEffect(() => {
    if (modelRef.current) {
      updateModelTransform();
    }
  }, [scale, rotationY, positionZ]);

  // Handle selected model change
  useEffect(() => {
    if (isARMode && sceneRef.current) {
      loadGLBModel(selectedModel);
    }
  }, [selectedModel, isARMode]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isARMode ? 'AR View' : 'AR Model Viewer'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {isARMode ? (
          <div className="ar-container">
            {/* Camera feed */}
            <video 
              ref={videoRef} 
              className="camera-feed" 
              autoPlay 
              playsInline
            />
            
            {/* Three.js canvas */}
            <canvas 
              ref={canvasRef} 
              className="ar-overlay-canvas" 
            />
            
            {/* Debug info */}
            <div className="debug-info">
              <p>Model loaded: {isModelLoaded ? 'Yes' : 'No'}</p>
              <p>Selected: {selectedModel}</p>
              <p>Debug: {debugMessage}</p>
            </div>
            
            {/* Top controls */}
            <div className="ar-top-controls">
              <IonButton
                onClick={stopAR}
                shape="round"
                color="light"
              >
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
              
              <div className="model-selector">
                <IonSelect
                  interface="popover"
                  value={selectedModel}
                  onIonChange={(e) => changeModel(e.detail.value)}
                  disabled={isModelPlaced}
                >
                  {availableModels.map((model) => (
                    <IonSelectOption key={model.value} value={model.value}>
                      {model.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </div>
            
            {/* Place button */}
            {isModelLoaded && !isModelPlaced && (
              <IonFab vertical="bottom" horizontal="center" slot="fixed">
                <IonFabButton color="primary" onClick={placeModel}>
                  <IonIcon icon={pin} />
                </IonFabButton>
              </IonFab>
            )}
            
            {/* Model controls */}
            {isModelLoaded && (
              <div className="model-controls-panel">
                <IonCard>
                  <IonCardContent>
                    <div className="control-label">Scale</div>
                    <IonRange
                      min={0.2}
                      max={5}
                      step={0.1}
                      value={scale}
                      onIonChange={(e) => setScale(e.detail.value as number)}
                      disabled={!isModelLoaded}
                    >
                      <IonIcon slot="start" icon={contract} />
                      <IonIcon slot="end" icon={expand} />
                    </IonRange>
                    
                    <div className="control-label">Rotate</div>
                    <IonRange
                      min={0}
                      max={360}
                      step={1}
                      value={rotationY}
                      onIonChange={(e) => setRotationY(e.detail.value as number)}
                      disabled={!isModelLoaded}
                    >
                      <IonIcon slot="start" icon={sync} />
                      <IonIcon slot="end" icon={sync} />
                    </IonRange>
                    
                    <div className="control-label">Distance</div>
                    <IonRange
                      min={-6}
                      max={-1}
                      step={0.1}
                      value={positionZ}
                      onIonChange={(e) => setPositionZ(e.detail.value as number)}
                      disabled={!isModelLoaded}
                    >
                      <IonIcon slot="start" icon={add} />
                      <IonIcon slot="end" icon={remove} />
                    </IonRange>
                    
                    <IonButton 
                      expand="block" 
                      fill="outline" 
                      onClick={resetModelTransformation}
                    >
                      <IonIcon slot="start" icon={refresh} />
                      Reset Model
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
            
            {/* Touch instructions */}
            {isModelLoaded && (
              <div className="touch-instructions">
                <div className="instruction">Top: Drag to rotate</div>
                <div className="instruction">Bottom: Drag to move</div>
                <div className="instruction">Pinch: Scale</div>
                <div className="instruction">Double-tap: Reset</div>
              </div>
            )}
          </div>
        ) : (
          <div className="model-selection-container">
            <IonCard>
              <IonCardContent>
                <h2>AR Model Viewer</h2>
                <p>Choose a model to view in AR mode:</p>
                
                <IonList>
                  {availableModels.map((model) => (
                    <IonItem 
                      key={model.value} 
                      button
                      detail
                      onClick={() => setSelectedModel(model.value)}
                      className={selectedModel === model.value ? 'selected-model' : ''}
                    >
                      <IonIcon icon={cube} slot="start" />
                      <IonLabel>{model.label}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
                
                <IonButton 
                  expand="block" 
                  onClick={startAR}
                  className="start-ar-button"
                >
                  <IonIcon slot="start" icon={camera} />
                  View in AR
                </IonButton>
                
                <p className="note">
                  This app allows you to view 3D models in augmented reality.
                  You can rotate, scale, and place models in your environment.
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
        
        <IonLoading
          isOpen={showLoading}
          message={`Loading model (${loadingProgress}%)...`}
        />
      </IonContent>
    </IonPage>
  );
};

export default EnhancedARComponent;
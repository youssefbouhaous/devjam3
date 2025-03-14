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
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle
} from '@ionic/react';
import { camera, cube, arrowBack, scan, add, remove, reload } from 'ionicons/icons';
import './ARCamera.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARGLBComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const touchStartDistanceRef = useRef(0);
  const modelScaleRef = useRef(1);
  
  // Sample 3D models - using actual GLB paths
  const models = [
    { id: 1, name: 'Chair', path: '/assets/models/chair.glb' },
    // Add more models as needed
  ];

  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Request camera with standard resolution to prevent zooming issues
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 }, // Standardized resolution
          height: { ideal: 720 }  // Standardized resolution
        }
      });
      
      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      
      setToastMessage('Camera started');
      setShowToast(true);
      setShowModelSelector(false);
      
      // Initialize Three.js after camera starts
      initThreeJS();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setToastMessage('Error accessing camera. Please check permissions.');
      setShowToast(true);
    }
  };

  // Stop camera and AR
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
    setShowModelSelector(true);
    setIsModelLoaded(false);
    setLoadingProgress(0);
  };

  // Initialize Three.js
  const initThreeJS = () => {
    if (!canvasRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with a wider field of view
    const camera = new THREE.PerspectiveCamera(
      60, // Reduced FOV to avoid excessive zoom
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8; // Position camera farther back
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load GLB model
    loadGLBModel();
    
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
    
    // Handle touch events for interaction
    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouchStart);
      canvasRef.current.addEventListener('touchmove', handleTouchMove);
      canvasRef.current.addEventListener('touchend', handleTouchEnd);
    }
    
    // Set cleanup function
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
      
      if (sceneRef.current && modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  };

  // Load GLB model
  const loadGLBModel = () => {
    if (!sceneRef.current || !selectedModel) return;
    
    // Remove existing model if any
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    const loader = new GLTFLoader();
    setIsModelLoaded(false);
    
    loader.load(
      selectedModel, // Use the selected model path
      (gltf) => {
        const model = gltf.scene;
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale model to a larger size
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 4 / maxDim; // Increased scale factor for better visibility
          model.scale.multiplyScalar(scale);
        }
        
        // Position in front of camera - moved closer and centered vertically
        model.position.set(0, 0, -7); // Positioned farther away to be fully visible
        
        // Add to scene
        sceneRef.current?.add(model);
        modelRef.current = model;
        setIsModelLoaded(true);
        
        setToastMessage('Model loaded successfully!');
        setShowToast(true);
      },
      (xhr) => {
        // Loading progress
        const progress = (xhr.loaded / xhr.total) * 100;
        setLoadingProgress(Math.round(progress));
      },
      (error) => {
        console.error('Error loading model:', error);
        setToastMessage('Error loading model. Please try again.');
        setShowToast(true);
      }
    );
  };

  // Animation loop
  const animate = () => {
    if (!isARMode) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Touch interaction handlers
  const handleTouchStart = (event: TouchEvent) => {
    if (!modelRef.current) return;
    
    event.preventDefault();
    
    if (event.touches.length === 1) {
      // Single touch - for rotation or movement
      const touch = event.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      
      // If touch is in top half, rotate, otherwise move
      if (touch.clientY < window.innerHeight / 2) {
        setIsRotating(true);
        setIsDragging(false);
      } else {
        setIsRotating(false);
        setIsDragging(true);
      }
    } 
    else if (event.touches.length === 2) {
      // Two touches - for scaling
      setIsRotating(false);
      setIsDragging(false);
      
      // Calculate distance between two touches
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      touchStartDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!modelRef.current) return;
    
    event.preventDefault();
    
    if (event.touches.length === 1 && (isDragging || isRotating)) {
      // Handle single touch movement
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;
      
      if (isRotating) {
        // Rotate model
        modelRef.current.rotation.y += deltaX * 0.01;
        modelRef.current.rotation.x += deltaY * 0.01;
      } 
      else if (isDragging) {
        // Move model
        modelRef.current.position.x += deltaX * 0.01;
        modelRef.current.position.y -= deltaY * 0.01;
      }
      
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    } 
    else if (event.touches.length === 2) {
      // Handle pinch to scale
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const scale = distance / touchStartDistanceRef.current;
      
      if (scale !== 1) {
        const newScale = modelScaleRef.current * scale;
        modelRef.current.scale.set(newScale, newScale, newScale);
        
        // Update for next move
        modelScaleRef.current = newScale;
        touchStartDistanceRef.current = distance;
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) {
      setIsDragging(false);
      setIsRotating(false);
    }
  };

  // Manual controls for model manipulation
  const scaleModel = (factor: number) => {
    if (!modelRef.current) return;
    
    modelScaleRef.current *= factor;
    modelRef.current.scale.multiplyScalar(factor);
  };

        const resetModel = () => {
    if (!modelRef.current) return;
    
    // Reset position - use the same coordinates as initial placement
    modelRef.current.position.set(0, 0, -7);
    
    // Reset rotation
    modelRef.current.rotation.set(0, 0, 0);
    
    // Reset scale - we'll scale back to our initial model scale
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      // Calculate the scale to reset to our initial sizing
      modelRef.current.scale.set(1, 1, 1); // Reset to base scale first
      const scale = 4 / maxDim;  // Match our initial scale factor
      modelRef.current.scale.multiplyScalar(scale);
      modelScaleRef.current = scale;
    } else {
      // Fallback if we can't calculate
      modelRef.current.scale.set(1, 1, 1);
      modelScaleRef.current = 1;
    }
    
    setToastMessage('Model position reset');
    setShowToast(true);
  };

  // Handle model selection
  const handleModelSelect = (modelPath: string) => {
    setSelectedModel(modelPath);
    setToastMessage(`Selected ${modelPath.split('/').pop()}`);
    setShowToast(true);
  };

  // Start AR experience
  const startAR = async () => {
    if (!selectedModel) {
      setToastMessage('Please select a model first');
      setShowToast(true);
      return;
    }
    
    setIsARMode(true);
    
    // Start camera after state update
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraStream]);

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
            <video 
              ref={videoRef} 
              className="camera-feed" 
              autoPlay 
              playsInline
            />
            <canvas 
              ref={canvasRef} 
              className="ar-overlay-canvas" 
            />
            
            <div className="ar-controls">
              <IonButton
                onClick={stopAR}
                shape="round"
                color="light"
              >
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
              
              {!isModelLoaded && (
                <div className="loading-indicator">
                  <p>Loading model: {loadingProgress}%</p>
                </div>
              )}
              
              {isModelLoaded && (
                <p className="ar-instructions">
                  Top half: Touch to rotate<br/>
                  Bottom half: Touch to move<br/>
                  Pinch: Scale model
                </p>
              )}
            </div>
            
            {isModelLoaded && (
              <div className="ar-model-controls">
                <IonButton onClick={() => scaleModel(1.2)} color="light" shape="round">
                  <IonIcon slot="icon-only" icon={add} />
                </IonButton>
                <IonButton onClick={() => scaleModel(0.8)} color="light" shape="round">
                  <IonIcon slot="icon-only" icon={remove} />
                </IonButton>
                <IonButton onClick={resetModel} color="light" shape="round">
                  <IonIcon slot="icon-only" icon={reload} />
                </IonButton>
              </div>
            )}
          </div>
        ) : (
          <div className="model-selection-container">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Select a 3D Model</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Choose a model to view in AR mode</p>
                
                <IonList>
                  {models.map((model) => (
                    <IonItem 
                      key={model.id} 
                      button 
                      detail
                      onClick={() => handleModelSelect(model.path)}
                      className={selectedModel === model.path ? 'selected-model' : ''}
                    >
                      <IonIcon 
                        slot="start" 
                        icon={cube} 
                      />
                      <IonLabel>{model.name}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
                
                <IonButton 
                  expand="block" 
                  onClick={startAR}
                  disabled={!selectedModel}
                  className="start-ar-button"
                >
                  <IonIcon slot="start" icon={camera} />
                  View in AR
                </IonButton>
                
                <p className="note">
                  Make sure you have your .glb model files in the 
                  public/assets/models directory.
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
      </IonContent>
    </IonPage>
  );
};

export default ARGLBComponent;
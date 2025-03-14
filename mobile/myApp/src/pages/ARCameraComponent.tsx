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
import { camera, cube, arrowBack, scan } from 'ionicons/icons';
import './ARCamera.css';
import * as THREE from 'three';

const ARCameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Sample 3D models
  const models = [
    { id: 1, name: 'Cube', path: 'cube', color: '#e91e63' },
    { id: 2, name: 'Sphere', path: 'sphere', color: '#4caf50' },
    { id: 3, name: 'Torus', path: 'torus', color: '#ff9800' },
  ];

  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
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
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a 3D model based on selection
    createModel();
    
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
    
    // Set cleanup function
    const cleanupThreeJS = () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (sceneRef.current && modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
      
      if (modelRef.current) {
        if (modelRef.current.geometry) {
          modelRef.current.geometry.dispose();
        }
        
        if (modelRef.current.material) {
          if (Array.isArray(modelRef.current.material)) {
            modelRef.current.material.forEach(material => material.dispose());
          } else {
            modelRef.current.material.dispose();
          }
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
    
    return cleanupThreeJS;
  };

  // Create 3D model
  const createModel = () => {
    if (!sceneRef.current) return;
    
    // Remove existing model if any
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Get selected model info
    const modelData = models.find(model => model.path === selectedModel);
    const color = modelData ? modelData.color : '#1e88e5';
    
    let geometry: THREE.BufferGeometry;
    
    // Create geometry based on selection
    switch (selectedModel) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
        break;
      case 'cube':
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
    }
    
    // Create material and mesh
    const material = new THREE.MeshStandardMaterial({ 
      color,
      roughness: 0.3,
      metalness: 0.3
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -3); // Position in front of camera
    
    sceneRef.current.add(mesh);
    modelRef.current = mesh;
  };

  // Animation loop
  const animate = () => {
    if (!isARMode) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    if (modelRef.current) {
      modelRef.current.rotation.x += 0.01;
      modelRef.current.rotation.y += 0.01;
    }
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Handle model selection
  const handleModelSelect = (modelPath: string) => {
    setSelectedModel(modelPath);
    setToastMessage(`Selected ${modelPath}`);
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
          <IonTitle>{isARMode ? 'AR Camera View' : 'AR Camera Demo'}</IonTitle>
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
              <p className="ar-instructions">
                Moving your device to place the 3D model
              </p>
            </div>
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
                        style={{color: model.color}}
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
                  Start AR View
                </IonButton>
                
                <p className="note">
                  Note: This is a simplified AR experience that overlays 3D models on your camera feed.
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

export default ARCameraComponent;
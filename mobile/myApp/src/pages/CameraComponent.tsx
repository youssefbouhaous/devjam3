import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonToast
} from '@ionic/react';
import { camera, arrowBack } from 'ionicons/icons';
import './Camera.css';

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Request permission and access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use the back camera
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        }
      });
      
      // Set the stream as the video source
      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setIsCameraActive(true);
      
      setToastMessage('Camera started');
      setShowToast(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setToastMessage('Error accessing camera. Please check permissions.');
      setShowToast(true);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      // Stop all tracks in the stream
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      
      // Clear the video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsCameraActive(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isCameraActive ? 'Camera View' : 'Camera Demo'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {isCameraActive ? (
          <div className="camera-container">
            <video 
              ref={videoRef} 
              className="camera-video" 
              autoPlay 
              playsInline
            />
            
            <div className="camera-controls">
              <IonButton
                onClick={stopCamera}
                shape="round"
                color="light"
              >
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="camera-start-container">
            <IonButton
              onClick={startCamera}
              expand="block"
              className="start-camera-button"
            >
              <IonIcon slot="start" icon={camera} />
              Start Camera
            </IonButton>
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

export default CameraComponent;
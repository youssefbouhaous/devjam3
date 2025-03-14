import React from 'react';
import { IonPage } from '@ionic/react';
import EnhancedARComponent from './EnhancedARComponent';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <EnhancedARComponent />
    </IonPage>
  );
};

export default Home;
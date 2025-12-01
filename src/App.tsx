import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

// Importar SOLO páginas que EXISTEN
import Home from './pages/Home';
import About from './pages/About';
// SearchBar.tsx y TaskFilters.tsx son COMPONENTES, no páginas
// No los importes aquí, se usan dentro de Home.tsx

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const configureStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('🔄 Configurando Status Bar...');
          
          await StatusBar.setOverlaysWebView({ 
            overlay: false 
          });
          
          await StatusBar.setStyle({ 
            style: Style.Light 
          });
          
          await StatusBar.setBackgroundColor({ 
            color: '#ffffff' 
          });
          
          await StatusBar.show();
          
          console.log('✅ Status Bar configurado correctamente');
          
        } catch (error) {
          console.log('ℹ️ Status Bar no disponible en web:', error);
        }
      }
    };

    configureStatusBar();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Home />
          </Route>
          <Route path="/about" exact={true}>
            <About />
          </Route>
          {/* NO añadas rutas para páginas que no existen */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
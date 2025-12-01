import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton
} from '@ionic/react';
import { 
  logoIonic, 
  logoReact, 
  logoCapacitor,
  person,
  school,
  calendar,
  document
} from 'ionicons/icons';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Acerca de</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        {/* Header de la App */}
        <IonCard color="primary">
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.5rem', textAlign: 'center' }}>
              MasterTasks
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              Aplicación móvil para gestión de tareas académicas y personales
            </p>
          </IonCardContent>
        </IonCard>

        {/* Información del Proyecto */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon icon={document} />
              Información del Proyecto
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={school} slot="start" color="primary" />
                <IonLabel>
                  <h3>Curso</h3>
                  <p>Desarrollo de Aplicaciones Móviles Multiplataforma</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={document} slot="start" color="primary" />
                <IonLabel>
                  <h3>Código</h3>
                  <p>APP-MOB-2025-01</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={calendar} slot="start" color="primary" />
                <IonLabel>
                  <h3>Fecha de Lanzamiento</h3>
                  <p>Diciembre 2025</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Información del Desarrollador */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon icon={person} />
              Desarrollador
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonLabel>
                  <h3>Nombre</h3>
                  <p>Guillermo Díaz</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Correo Electrónico</h3>
                  <p>guillermodiazvg5@hotmail.com</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Rol</h3>
                  <p>Desarrollador Full Stack</p>
                </IonLabel>
              </IonItem>
               <IonItem>
                <IonLabel>
                  <h3>Colaboradores</h3>
                  <p>Daniel Blanco Perdomo</p>
                  <p>Juan Duarte Barrera</p>
                  <p>Daniel Esputiñan Cruz</p>
                  <p>Jose Dimate Martinez</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Tecnologías Utilizadas */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tecnologías</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={logoIonic} slot="start" color="primary" />
                <IonLabel>
                  <h3>Ionic Framework</h3>
                  <p>v7.2.1 - UI Components</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={logoReact} slot="start" color="primary" />
                <IonLabel>
                  <h3>React</h3>
                  <p>Library for user interfaces</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={logoCapacitor} slot="start" color="primary" />
                <IonLabel>
                  <h3>Capacitor</h3>
                  <p>v7.4.4 - Cross-platform native runtime</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>TypeScript</h3>
                  <p>Lenguaje de programación</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Versión de la App */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Versión</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 8px 0', color: 'var(--ion-color-primary)' }}>
                v1.0.0
              </h2>
              <p style={{ margin: 0, color: 'var(--ion-color-medium)' }}>
                Fase 2 - Sistema de Filtros
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Enlace al Repositorio */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <IonButton 
            fill="outline" 
            color="primary"
            href="https://github.com/Guillermodiazvg5/App-MasterTask---Multiplataforma"
            target="_blank"
          >
            Ver Código en GitHub
          </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default About;
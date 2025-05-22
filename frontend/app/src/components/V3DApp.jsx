import React from 'react';
import { createApp } from '../v3dApp/Model1.js';
import '../v3dApp/Model1.css';
import {commonjs} from "globals";

class V3DApp extends React.Component {
  #app = null;
  #PL = null;
  #switchButton = null;
  #infoPanel = null;
  #infoPoints = [];


  #defaultCameraSettings = {}; // do przechowywania zmiennych domyślnych kamer

  #currentCamera = null;
  #uuid = window.crypto.randomUUID();
  #containerId = `v3d-container-${this.#uuid}`;
  #fsButtonId = `fullscreen-button-${this.#uuid}`;
  #sceneURL = '/v3dApp/Model1.gltf';


   // Room data for info points
  #roomData = {
    'InfoPoint_kitchen+livingroom': { name: 'Kuchnia z salonem', area: '33.5 m²' },
    'InfoPoint_corridor': { name: 'Korytarz', area: '15.2 m²' },
    'InfoPoint_office': { name: 'Biuro', area: '6.6 m²' },
    'InfoPoint_bathroom': { name: 'Łazienka', area: '6 m²' },
    'InfoPoint_room1': { name: 'Pokój 1', area: '10.5 m²' },
    'InfoPoint_room2': { name: 'Pokój 2', area: '12.4 m²' },
    'InfoPoint_room3': { name: 'Pokój 3', area: '13.5 m²' },
    'InfoPoint_toilet': { name: 'Toaleta', area: '2 m²' },
    'InfoPoint_wardrobe': { name: 'Garderoba', area: '3.1 m²' },
  };

  async loadApp() {
    if (!document.getElementById(this.#containerId)) {
      console.error(`Container element with id ${this.#containerId} not found`);
      return;
    }

    ({ app: this.#app, PL: this.#PL } = await createApp({
      containerId: this.#containerId,
      fsButtonId: this.#fsButtonId,
      sceneURL: this.#sceneURL,
    }));

  const waitForCameras = async () => {
    let retries = 20;
    while (
      (!this.#app?.scene ||
        !this.#app.scene.getObjectByName('Camera(orbit)') ||
        !this.#app.scene.getObjectByName('Camera(FPS)')) &&
      retries-- > 0
    ) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    if (!this.#app?.scene) {
      console.warn('Scene is still not available after retries');
      return;
    }
  };
  await waitForCameras();

  this.getDefaultCamerasSettings()
   this.initCameraSwitchButton();
  this.#currentCamera = 'Camera(orbit)';
        // Initialize room info functionality
    this.findInfoPoints();
  }

  // Find and setup info points
  findInfoPoints() {
    if (!this.#app || !this.#app.scene) {
      console.warn('App or scene not initialized yet');
      return;

    }

    // Clear existing info points
    this.#infoPoints = [];

    // Find all objects whose name starts with "InfoPoint_"
    this.#app.scene.traverse((object) => {
      if (object.name.startsWith('InfoPoint_')) {
        console.log(`Found info point: ${object.name}`);

        // Create visible indicator
        const geometry = new window.v3d.SphereGeometry(0.1, 16, 16);
        const material = new window.v3d.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.7,
          transparent: true,
        });
        const indicator = new window.v3d.Mesh(geometry, material);

        // Position indicator at the empty object's location
        indicator.position.copy(object.position);
        indicator.quaternion.copy(object.quaternion);
        indicator.scale.copy(object.scale);

        // Important settings for collision detection
        indicator.userData.infoPointName = object.name;
        indicator.visible = true;
        indicator.renderOrder = 999;
        indicator.matrixWorldNeedsUpdate = true;

        this.#app.scene.add(indicator);
        this.#infoPoints.push(indicator);
      }
    });
    console.log(`Found ${this.#infoPoints.length} info points`);

    // Ustaw początkową widoczność punktów na podstawie aktualnej kamery
    const isOrbitCamera = this.#currentCamera === 'Camera(orbit)';
    this.toggleInfoPoints(this.#currentCamera);
    console.log(`Initial info points visibility: ${isOrbitCamera} for camera: ${this.#currentCamera}`);

    // Create info panel and setup click detection
    this.createInfoPanel();
    this.setupClickDetection();
  }

    // Create information panel
  createInfoPanel() {
    console.log('Creating info panel');

    // Remove existing panel if it exists
    if (this.#infoPanel && this.#infoPanel.parentNode) {
      this.#infoPanel.parentNode.removeChild(this.#infoPanel);
    }

    this.#infoPanel = document.createElement('div');
    this.#infoPanel.id = `info-panel-${this.#uuid}`;

    // Styling
    this.#infoPanel.style.position = 'absolute';
    this.#infoPanel.style.backgroundColor = 'rgba(238, 231, 231, 0.47)';
    this.#infoPanel.style.color = 'white';
    this.#infoPanel.style.padding = '15px';
    this.#infoPanel.style.borderRadius = '5px';
    this.#infoPanel.style.border = '2px solid rgb(234, 235, 224)';
    this.#infoPanel.style.display = 'none';
    this.#infoPanel.style.zIndex = '9999';
    this.#infoPanel.style.pointerEvents = 'none';
    this.#infoPanel.style.fontFamily = 'Arial, sans-serif';
    this.#infoPanel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    this.#infoPanel.style.minWidth = '200px';

    const container = document.getElementById(this.#containerId);
    if (container) {
      container.appendChild(this.#infoPanel);
      console.log('Panel added to container:', container);
    } else {
      console.error('Container not found');
    }
  }
 // Setup click detection for info points
  setupClickDetection() {
    const raycaster = new window.v3d.Raycaster();
    const mouse = new window.v3d.Vector2();

    const container = document.getElementById(this.#containerId);
    if (container) {
      container.addEventListener('click', (event) => {
        // console.log('Click detected');

        // Calculate mouse position
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        // console.log('Mouse position:', mouse.x, mouse.y);

        // Update raycaster
        raycaster.setFromCamera(mouse, this.#app.camera);

        // Check intersections with info points
        const intersects = raycaster.intersectObjects(this.#infoPoints);
        // console.log('Number of intersections:', intersects.length);

        if (intersects.length > 0) {
          console.log('Hit point:', intersects[0].object.userData.infoPointName);
          const infoPointName = intersects[0].object.userData.infoPointName;
          const room = this.#roomData[infoPointName];

          if (room) {
            this.showRoomInfo(room, event.clientX, event.clientY);
          } else {
            console.log('No data for room:', infoPointName);
          }
        } else {
          this.hideRoomInfo();
        }
      });
    } else {
      console.error('Container not found for click detection');
    }
  }
  // Show room information
  showRoomInfo(room, x, y) {
    console.log('Attempting to show info:', room, x, y);

    if (!this.#infoPanel) {
      console.error('Info panel does not exist!');
      return;
    }

    this.#infoPanel.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">${room.name}</h3>
      <p style="margin: 0; font-size: 14px;">Powierzchnia: ${room.area}</p>
    `;

    this.#infoPanel.style.left = `${x + 15}px`;
    this.#infoPanel.style.top = `${y - 15}px`;
    this.#infoPanel.style.display = 'block';
    console.log('Panel should be visible now:', this.#infoPanel);
  }

  // Hide room information
  hideRoomInfo() {
    if (this.#infoPanel) {
      this.#infoPanel.style.display = 'none';
    }
  }

  // Toggle info points visibility
  // toggleInfoPoints(cameraName) {
  //   console.log(`toggleInfoPoints called with: ${cameraName}, points count: ${this.#infoPoints.length}`);
  //   // if (show === 'Camera(orbit)'){
  //   //   this.#infoPoints.forEach((point, index) => {
  //   //     point.visible = true;
  //   //
  //   //   console.log(`Point ${index} (${point.userData.infoPointName}) visibility set to: ${show}`);
  //   //   });
  //   // }
  //   // else if (show === 'Camera(FPS)'){
  //   //   this.#infoPoints.forEach((point, index) => {
  //   //     point.visible = false;
  //   //
  //   //   console.log(`Point ${index} (${point.userData.infoPointName}) visibility set to: ${show}`);
  //   //   });
  //   // }
  //
  //   const shouldShow = cameraName === 'Camera(orbit)';
  //
  //     this.#infoPoints.forEach((point, index) => {
  //       point.visible = shouldShow;
  //       console.log('czy widac pilki:' + shouldShow )
  //       this.#app.render();
  //
  //       point.matrixWorldNeedsUpdate = true;  // Wymusza aktualizację
  //       console.log(`Point ${index} visibility changed from ... to ${point.visible}`);
  //
  //       // Sprawdź czy punkt jest rzeczywiście w scenie
  //       if (!point.parent) {
  //         console.warn(`Point ${index} is not in scene!`);
  //       }
  //     });
  //
  //     // Wymusi ponowne renderowanie
  //     if (this.#app && this.#app.scene) {
  //       if (this.#app.render) {
  //         this.#app.render();
  //       }
  // }
  //
  // }
toggleInfoPoints(cameraName) {
    console.log(`toggleInfoPoints called with: ${cameraName}, points count: ${this.#infoPoints.length}`);

    const shouldShow = cameraName === 'Camera(orbit)';
    console.log('shouldShow:', shouldShow);

    // Najpierw ustaw wszystkie punkty
    this.#infoPoints.forEach((point, index) => {
        const previousVisibility = point.visible;
        point.visible = shouldShow;
        point.matrixWorldNeedsUpdate = true;

        // Dodatkowe wymuszenie aktualizacji dla Three.js
        if (point.material) {
            point.material.needsUpdate = true;
        }

        console.log(`Point ${index} (${point.userData.infoPointName}) visibility: ${previousVisibility} -> ${point.visible}`);

        // Sprawdź czy punkt jest w scenie
        if (!point.parent) {
            console.warn(`Point ${index} is not in scene!`);
        }
    });

    // Wymusi pełną aktualizację sceny
    if (this.#app && this.#app.scene) {
        this.#app.scene.updateMatrixWorld(true);

        // Alternatywnie, spróbuj też tego podejścia:
        this.#app.scene.traverse((object) => {
            if (object.userData && object.userData.infoPointName) {
                object.visible = shouldShow;
            }
        });

        // Dopiero teraz renderuj
        if (this.#app.render) {
            this.#app.render();
        }
    }

    // Debug: sprawdź stan punktów po aktualizacji
    setTimeout(() => {
        console.log('=== Stan punktów po aktualizacji ===');
        this.#infoPoints.forEach((point, index) => {
            console.log(`Point ${index}: visible=${point.visible}, inScene=${!!point.parent}`);
        });
    }, 100);
}

  getDefaultCamerasSettings() {
      if (!this.#app || !this.#app.scene) {
    console.warn('App or scene not initialized yet');
    return;

  }

    const cameraOrbit = this.#app.scene.getObjectByName('Camera(orbit)');
    const cameraFPS = this.#app.scene.getObjectByName('Camera(FPS)');

    if (!this.#defaultCameraSettings['Camera(orbit)']) {
        this.#defaultCameraSettings['Camera(orbit)'] = {
            position: cameraOrbit.position.clone(),
            quaternion: cameraOrbit.quaternion.clone(),
            target: this.#app.controls?.target?.clone()
          };
        console.log("Camera(orbit) position saved")
        }
    if (!this.#defaultCameraSettings['Camera(FPS)']) {
        this.#defaultCameraSettings['Camera(FPS)'] = {
            position: cameraFPS.position.clone(),
            quaternion: cameraFPS.quaternion.clone(),
            target: this.#app.controls?.target?.clone()
          };
        console.log("Camera(FPS) position saved")
        }
  }
  initCameraSwitchButton() {

    if (this.#switchButton && this.#switchButton.parentNode) { // usuwa stary przycisk, jeśli juz był
      this.#switchButton.parentNode.removeChild(this.#switchButton);
    }

    this.#switchButton = document.createElement('button');
    this.#switchButton.id = 'camera-switch-button';


    let currentCameraIndex = 0;   // mówi która kamera jest aktywna
    const cameraNames = ['Camera(orbit)', 'Camera(FPS)'];

    const updateButtonText = () => {
      const texts = ['Walk in the apartment', 'Top view'];
      this.#switchButton.innerHTML = texts[(currentCameraIndex + 1) % cameraNames.length];
    };


    this.#switchButton.innerHTML = 'Walk in the apartment';

    // Style the button
    this.#switchButton.style.position = 'absolute';
    this.#switchButton.style.bottom = '20px';
    this.#switchButton.style.right = '20px';
    this.#switchButton.style.zIndex = '100';
    this.#switchButton.style.padding = '10px 15px';
    this.#switchButton.style.backgroundColor = '#333';
    this.#switchButton.style.color = 'white';
    this.#switchButton.style.border = 'none';
    this.#switchButton.style.borderRadius = '5px';
    this.#switchButton.style.cursor = 'pointer';

    this.#switchButton.style.transition = 'background-color 0.3s';
    this.#switchButton.addEventListener('mouseover', () => {
      this.#switchButton.style.backgroundColor = '#555';
    });
    this.#switchButton.addEventListener('mouseout', () => {
      this.#switchButton.style.backgroundColor = '#333';
    });


    // const defaultCameraSettings = {};    // info o domyślnych ustawieniach kamery

    this.#switchButton.addEventListener('click', () => {
      if (!this.#app) return;
      updateButtonText();
      currentCameraIndex = (currentCameraIndex + 1) % cameraNames.length;
      const nextCamera = cameraNames[currentCameraIndex];
      const camera = this.#app.scene.getObjectByName(nextCamera);

      if (camera && camera.isCamera) {
        const defaults = this.#defaultCameraSettings[nextCamera];

        if (defaults) {
          camera.position.copy(defaults.position);
          camera.quaternion.copy(defaults.quaternion);
          this.#app.setCamera(camera);

          if (this.#app.controls && defaults.target) {
            this.#app.controls.target.copy(defaults.target);
            this.#app.controls.update();
          }

          // Poprawiona logika ukrywania/pokazywania punktów
          this.toggleInfoPoints(nextCamera);


          // Zaktualizuj aktualną kamerę
          this.#currentCamera = nextCamera;

          console.log(`Switched to ${nextCamera}`);
      } else {
        console.warn(`Camera ${nextCamera} not found`);
      }
             } else {
      console.warn(`Camera ${nextCamera} not found`);
    }
    });

    const container = document.getElementById(this.#containerId);
    if (container) {
      container.appendChild(this.#switchButton);
    }
  }

  disposeApp() {
    if (this.#switchButton && this.#switchButton.parentNode) {
      this.#switchButton.parentNode.removeChild(this.#switchButton);
    }
    if (this.#infoPanel && this.#infoPanel.parentNode) {
      this.#infoPanel.parentNode.removeChild(this.#infoPanel);
    }

    this.#app?.dispose();
    this.#app = null;
    this.#PL?.dispose();
    this.#PL = null;
    this.#infoPoints = [];
  }

  componentDidMount() {
    setTimeout(() => this.loadApp(), 100);
  }

  componentWillUnmount() {
    this.disposeApp();
  }

  render() {
    return (
      <div id={this.#containerId} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          id={this.#fsButtonId}
          className="fullscreen-button fullscreen-open"
          title="Toggle fullscreen mode"
        ></div>
      </div>
    );
  }
}

export default V3DApp;
import React from 'react';
import { createApp } from '../v3dApp/Model1.js';
import '../v3dApp/Model1.css';
import {commonjs} from "globals";

class V3DApp extends React.Component {
  #app = null;
  #PL = null;
  #switchButton = null;

  #defaultCameraSettings = {}; // do przechowywania zmiennych domyślnych kamer


  #uuid = window.crypto.randomUUID();
  #containerId = `v3d-container-${this.#uuid}`;
  #fsButtonId = `fullscreen-button-${this.#uuid}`;
  #sceneURL = '/v3dApp/Model1.gltf';

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

        console.log(`Switched to ${nextCamera}`);
      } else {
        console.warn(`Camera ${nextCamera} not found`);
      }
             } else {
      console.warn(`Camera ${nextCameraName} not found`);
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

    this.#app?.dispose();
    this.#app = null;
    this.#PL?.dispose();
    this.#PL = null;
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
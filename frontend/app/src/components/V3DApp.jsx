import React from 'react';
import { createApp } from '../v3dApp/Model1.js';
import '../v3dApp/Model1.css';

class V3DApp extends React.Component {
  #app = null;
  #PL = null;
  #switchButton = null;

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

   this.initCameraSwitchButton();
  }

  initCameraSwitchButton() {

    if (this.#switchButton && this.#switchButton.parentNode) {
      this.#switchButton.parentNode.removeChild(this.#switchButton);
    }

    this.#switchButton = document.createElement('button');
    this.#switchButton.id = 'camera-switch-button';
    this.#switchButton.innerHTML = 'Switch Camera';

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

    let currentCameraIndex = 0;
    const cameraNames = ['Camera(FPS)', 'Camera(orbit)'];
    const defaultCameraSettings = {};

    this.#switchButton.addEventListener('click', () => {
      if (!this.#app) return;

      currentCameraIndex = (currentCameraIndex + 1) % cameraNames.length;
      const nextCamera = cameraNames[currentCameraIndex];
      const camera = this.#app.scene.getObjectByName(nextCamera);

      if (camera && camera.isCamera) {
        if (!defaultCameraSettings[nextCamera]) {
          defaultCameraSettings[nextCamera] = {
            position: camera.position.clone(),
            quaternion: camera.quaternion.clone(),
            target: this.#app.controls?.target?.clone()
          };
        }

        const defaults = defaultCameraSettings[nextCamera];
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
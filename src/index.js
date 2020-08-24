import { component, useState, useEffect, State } from 'haunted';
import * as PIXI from 'pixi.js';
import css from './style.css';
import './images/logo.png';

const Application = PIXI.Application;
const loader = PIXI.Loader.shared;
const resources = loader.resources;
const Sprite = PIXI.Sprite;

PIXI.utils.TextureCache['images/logo.png'];

const App = () => {
  const [engine, setEngine] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [sprites, setSprites] = useState({});

  useEffect(() => {
    if (loading) {
      console.log('---PIXI LOADING PROGRESS', loadingProgress);
    }
    if (!loading && loadingProgress === 100) {
      const logo = new Sprite(resources.logo.texture);
      setSprites((state) => ({ ...state, logo }));
      engine.stage.addChild(logo);
    }
  }, [loading, loadingProgress]);

  useEffect(() => {
    if (loading) {
      loader.add('logo', 'images/logo.png');
      loader.onProgress.add(({ progress }) => setLoadingProgress(progress));
      loader.load(({ progress }) => {
        console.log('---PIXI TEXTURES LOADED');
        setLoadingProgress(100);
        setLoading(false);
      });
    }
  }, [loading]);

  useEffect(() => {
    if (engine) {
      console.log('---RESIZING PIXI');
      engine.renderer.resize(dimensions.width, dimensions.height);
    }
  }, [engine, dimensions]);

  useEffect(() => {
    const listener = window.addEventListener(
      'resize',
      ({ target: { innerHeight: height, innerWidth: width } }) => {
        setDimensions({ width, height });
      }
    );

    return () => window.removeEventListener(listener);
  }, []);

  useEffect(() => {
    const _engine = new Application({
      width: dimensions.width,
      height: dimensions.height,
      autoResize: true,
    });
    document.body.appendChild(_engine.view);
    setEngine(_engine);
  }, []);

  return null;
};
customElements.define('knaves-out', component(App));

import { Renderer, BatchRenderer, Filter } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { Ticker } from '@pixi/ticker';
import { BlurFilter } from '@pixi/filter-blur';
import { Graphics } from '@pixi/graphics';

// import CustomFilter from './CustomFilter.js';
import DefaultFilter from '@lib/filters/DefaultFilter.js'
// import WaveFilter from './filters/WaveFilter.js';

// import size from 'size'
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

Renderer.registerPlugin('batch', BatchRenderer);

class App {
  
  constructor() {
    const canvas = document.createElement('canvas');
    const canvasContainer = document.querySelector(`#app`);
    canvasContainer.appendChild(canvas);

    // fake
    const gpu = { tier: 4 };

    const dpr = gpu.tier >= 2 ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    /**
     * Init
     */
    const renderer = new Renderer({
      view: canvas,
      width: size.width * 0.98,
      height: size.height * 0.98,
      antialias: true,
      resolution: dpr,
      autoDensity: true,
      powerPreference: 'high-performance',
      backgroundColor: 0x0000ff
    });
    const stage = new Container();
    stage.interactiveChildren = false;

    /**
     * Resize
     */
    window.addEventListener('resize', () => {
      // Update sizes
      size.width = window.innerWidth;
      size.height = window.innerHeight;

      renderer.resize(size.width * 0.98, size.height * 0.98);
    });

    /**
     * Scene
     */
    // const container = new Container();
    // stage.addChild(container);

    const sprite = Sprite.from('https://source.unsplash.com/random');
    stage.addChild(sprite);
    sprite.anchor.set(0.5, 0.5);
    sprite.x = size.width * 0.5;
    sprite.y = size.height * 0.5;
    // sprite.width = size.width * 0.8;
    sprite.scale.set(0.3, 0.3);

    /**
     * filters
     */
    const filter = new DefaultFilter();
    // const blurFilter = new BlurFilter(10);
    const waveFilter = null;
    // const waveFilter = new WaveFilter();
    sprite.filters = [filter];

    /**
     * Graphics
     */
    const graphics = new Graphics();
    graphics.lineStyle(10, 0xffff00, 1);
    graphics.beginFill(0xc34288, 1);
    graphics.drawCircle(size.width * 0.8, size.width * 0.5, 100);
    graphics.endFill();
    stage.addChild(graphics);

    /**
     * Ticker
     */
    const ticker = new Ticker();
    ticker.maxFPS = 60;
    ticker.add(onRequestAnimationFrame, renderer.context, -25);
    ticker.start();

    let count = 0;
    function onRequestAnimationFrame(delta) {
      count += 0.005;

      // const blurAmount = Math.cos(count);
      // blurFilter.blur = 20 * (blurAmount);

      if (waveFilter) {
        waveFilter.uTime += 0.001;
      }

      // render
      // renderer.resize(size.width, size.height);
      renderer.render(stage);
    }
  }
}

new App()
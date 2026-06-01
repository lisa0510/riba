import Phaser from "phaser";
import "./style.css";
import Menu from "./scenes/menu.js";
import Shop from "./scenes/shop.js";
import Tutorial from "./scenes/tutorial.js";
import Intro from "./scenes/introtext.js";
import Ending from "./scenes/ending.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  scene: [Menu, Intro,Tutorial, Shop,Ending],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080
  }
};

new Phaser.Game(config);
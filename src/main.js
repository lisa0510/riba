import Phaser from "phaser";
import "./style.css";
import Menu from "./scenes/menu.js";
import Game from "./scenes/game.js";
import Tutorial from "./scenes/tutorial.js";
import Intro from "./scenes/intro.js";
import Ending from "./scenes/ending.js";
import FontFaceObserver from "fontfaceobserver";

const roboto = new FontFaceObserver("Roboto");
const quantico = new FontFaceObserver("Quantico");
const crimson = new FontFaceObserver("Crimson Text");

Promise.all([
  roboto.load(),
  quantico.load(),
  crimson.load()
]).then(() => {
  new Phaser.Game(config);
});


const config = {
  type: Phaser.AUTO,
  parent: "app",
  scene: [Menu, Intro, Tutorial, Game, Ending],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080
  }
};

new Phaser.Game(config);
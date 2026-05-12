import Phaser from "phaser";
import { endingData } from "../data/endingData.js";

export default class Ending extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  create(data) {
  const { width, height } = this.scale;

  const endingKey = data.ending || "ending1";
  const currentEnding = endingData[endingKey];

  const endingNumber = endingKey.replace("ending", "");

  this.add.rectangle(
    width / 2,
    height / 2,
    width,
    height,
    0x000000
  );

  // Ending Text
  this.add.text(
    width / 2,
    height / 2,
    currentEnding.text,
    {
      fontSize: `${Math.max(24, height * 0.04)}px`,
      fontFamily: "Roboto",
      fontStyle: "italic",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width * 0.7 }
    }
  ).setOrigin(0.5);

  // Ending Label
  let endingLabel;

  if (endingKey.includes("endingPerfect")) {
    endingLabel = "Geheimes Ende entdeckt!";
  } else {
    endingLabel = `Ende ${endingNumber} von 4`;
  }

  this.add.text(
    width / 2,
    height * 0.6,
    endingLabel,
    {
      fontSize: `${Math.max(24, height * 0.02)}px`,
      color: "#aaaaaa",
      fontFamily: "Roboto",
      align: "center"
    }
  ).setOrigin(0.5);

  // Restart Hint
  const restartText = this.add.text(
    width / 2,
    height * 0.92,
    "[ PRESS ANY KEY OR CLICK TO START AGAIN ]",
    {
      fontSize: `${Math.max(20, height * 0.015)}px`,
      color: "#666666",
      fontFamily: "Roboto",
      align: "center"
    }
  )
    .setOrigin(0.5);

  // subtle floating animation
  this.tweens.add({
    targets: restartText,
    alpha: 0.4,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut"
  });

  const restartGame = () => {
    this.cameras.main.fadeOut(600, 0, 0, 0);

    this.time.delayedCall(600, () => {
      this.scene.start("Menu");
    });
  };

  this.input.keyboard.once("keydown", restartGame);
  this.input.once("pointerdown", restartGame);
}
}
import Phaser from "phaser";
import { endingData } from "../data/endingData.js";

export default class Ending extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  preload() {
    this.load.audio("ending1", "assets/audio/narration/ending1.wav");
    this.load.audio("ending2", "assets/audio/narration/ending2.wav");
    this.load.audio("ending3", "assets/audio/narration/ending3.wav");
    this.load.audio("ending4", "assets/audio/narration/ending4.wav");
    this.load.audio("ending5", "assets/audio/narration/ending5.wav");
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

    if (currentEnding.voice) {
      this.endingVoice = this.sound.add(currentEnding.voice, {
        volume: 1
      });

      this.endingVoice.play();
    }

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

    this.tweens.add({
      targets: restartText,
      alpha: 0.4,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut"
    });

    const restartGame = () => {
      if (this.endingVoice) {
        this.endingVoice.stop();
        this.endingVoice.destroy();
        this.endingVoice = null;
      }

      this.cameras.main.fadeOut(600, 0, 0, 0);

      this.time.delayedCall(600, () => {
        this.scene.start("Menu");
      });
    };

    this.input.keyboard.once("keydown", restartGame);
    this.input.once("pointerdown", restartGame);
  }
}
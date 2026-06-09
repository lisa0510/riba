import Phaser from "phaser";
import { endingData } from "../data/endingData.js";

// Endszene des Spiels.
// Zeigt abhängig vom erreichten Ending den passenden Text, die Sprachaufnahme sowie den Neustart des Spiels an.
export default class Ending extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  preload() {
    this.load.audio("ending1", "assets/Riba_Version_07_Audio/narration/ending1.wav");
    this.load.audio("ending2", "assets/Riba_Version_07_Audio/narration/ending2.wav");
    this.load.audio("ending3", "assets/Riba_Version_07_Audio/narration/ending3.wav");
    this.load.audio("ending4", "assets/Riba_Version_07_Audio/narration/ending4.wav");
    this.load.audio("ending5", "assets/Riba_Version_07_Audio/narration/ending5.wav");
  }

  // Übernimmt das zuvor berechnete Ending aus der Game-Scene.
  create(data) {
    const { width, height } = this.scale;

    // Falls kein Ending übergeben wurde, wird als Fallback Ending 1 verwendet.
    const endingKey = data.ending || "ending1";

    // Lädt die Daten des erreichten Endes aus der zentralen endingData-Datei.
    const currentEnding = endingData[endingKey];

    const endingNumber = endingKey.replace("ending", "");

    // Schwarzer Hintergrund für eine ruhige
    // und fokussierte Darstellung des Endings.
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000
    );

    // Spielt die Sprachaufnahme des erreichten Endes ab.
    if (currentEnding.voice) {
      this.endingVoice = this.sound.add(currentEnding.voice, {
        volume: 1
      });

      this.endingVoice.play();
    }

    // Zeigt den narrativen Abschlusstext des Endings an.
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

    // Das geheime Ende wird anders bezeichnet als die vier regulären Enden.
    if (endingKey.includes("endingPerfect")) {
      endingLabel = "Geheimes Ende entdeckt!";
    } else {
      endingLabel = `Ende ${endingNumber} von 4`;
    }

    // Zeigt dem Spieler an, welches Ende erreicht wurde.
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

    // Hinweis zum Neustart des Spiels.
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
    ).setOrigin(0.5);

    // Pulsierende Animation, damit die Neustart-Aufforderung besser wahrgenommen wird.
    this.tweens.add({
      targets: restartText,
      alpha: 0.4,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut"
    });

    // Beendet die Ending-Scene und startet das Spiel erneut beim Hauptmenü.
    const restartGame = () => {

      // Laufende Sprachaufnahme stoppen, bevor die Szene gewechselt wird.
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
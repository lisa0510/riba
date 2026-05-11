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

    this.add.text(
      width / 2,
      height / 2,
      currentEnding.text,
      {
        fontSize: "35px",
        fontFamily: "Roboto",
        fontStyle: "italic",
        color: "#ffffff",
        padding: { x: 40, y: 25 },
        align: "left",
        wordWrap: { width: width * 0.8 }
      }
    ).setOrigin(0.5);

    let endingLabel;

    if (endingKey.includes("endingPerfect")) {
      endingLabel = "Geheime Ende entdeckt!";
    } else {
      endingLabel = `Ende ${endingNumber} von 4`;
    }

    this.add.text(
      width / 2,
      height * 0.9,
      endingLabel,
      {
        fontSize: "25px",
        color: "#ffffff",
        fontFamily: "Roboto",
        padding: { x: 16, y: 8 }
      }
    ).setOrigin(0.5);
  }
}
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
      height * 0.65,
      currentEnding.text,
      {
        fontSize: "26px",
        color: "#eb3232",
        backgroundColor: "#000000aa",
        padding: { x: 25, y: 18 },
        align: "center",
        wordWrap: { width: width * 0.7 }
      }
    ).setOrigin(0.5);

    this.add.text(
      width / 2,
      height * 0.9,
      `Ende ${endingNumber} von 4`,
      {
        fontSize: "22px",
        color: "#b65c5c",
        fontFamily: "Roboto",
        backgroundColor: "#000000aa",
        padding: { x: 16, y: 8 }
      }
    ).setOrigin(0.5);
  }
}
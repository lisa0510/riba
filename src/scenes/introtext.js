import Phaser from "phaser";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }
  preload() {
  this.load.audio("intro", "assets/audio/narration/intro.wav");
  this.load.audio("background", "assets/audio/underwater.mp3");
  }

  create() {
    const { width, height } = this.scale;
    const isSmallScreen = width < 1200 || height < 750;
    const headerSize = isSmallScreen ? "17px" : "24px";
    const bodySize = isSmallScreen ? "15px" : "22px";
    const hintSize = isSmallScreen ? "14px" : "18px";

    const panelW = width * 0.8;
    const panelH = height * 0.7;
    const panelX = width / 2;
    const panelY = height * 0.5;

    this.add.rectangle(width / 2, height / 2, width, height, 0x111816);
    this.introVoice = this.sound.add("intro", {
        volume: 3
      });

    this.introVoice.play();
    this.backgroundMusic = this.sound.add("background", {
      volume: 0.3
    });
    this.backgroundMusic.play();

    this.add.rectangle(panelX, panelY, panelW * 0.9, panelH * 0.75, 0x07130e, 0.95)
      .setStrokeStyle(2, 0x3cff9b, 0.7);

    this.add.rectangle(panelX, panelY - panelH * 0.42, panelW * 0.9, 8, 0x3cff9b, 0.85);

    this.add.text(
      panelX,
      panelY - panelH * 0.52,
      "UNTERWASSER-ARBEITSSTATION ADRIA-03 // SYSTEMPROTOKOLL",
      {
        fontSize: headerSize,
        color: "#3cff9b",
        fontFamily: "Quantico",
        align: "center",
        wordWrap: { width: panelW * 0.9 }
      }
    ).setOrigin(0.5);

    this.add.text(
      width * 0.14,
      height * 0.08,
      "TIEFE: -420M\nO2: STABIL\nTEMP: 8°C",
      {
        fontSize: isSmallScreen ? "12px" : "15px",
        color: "#70ffad",
        fontFamily: "Quantico",
        lineSpacing: 6
      }
    );

    this.add.text(
      width * 0.78,
      height * 0.08,
      "CREW ID: JL305\nSTATION: ADRIA-03\nDATUM: 30.12.2126",
      {
        fontSize: isSmallScreen ? "12px" : "15px",
        color: "#70ffad",
        fontFamily: "Quantico",
        lineSpacing: 6
      }
    );

    for (let y = 0; y < height; y += 8) {
      this.add.rectangle(width / 2, y, width, 1, 0x3cff9b, 0.035);
    }

    const introText = `Als die Sonne begann, die Erdoberfläche zu verbrennen, befand sich eine Gruppe von Sättigungstaucherinnen in ihrer Arbeitsstation in der Adria.

Die Versäuerung der Ozeane war ein Nebeneffekt, der das Überleben stark erschwerte, da sich die essbaren Lebewesen auf unbekannte Weise veränderten. So wurde die Nahrung knapp, und die überlebenden Menschen mussten lernen, das Fischfleisch von den Kiemen und jenen Stellen zu befreien, die sich für sie als giftig erwiesen hatten.

Dein Name ist Mona. Du bist eines der Crewmitglieder und hast dich dazu entschlossen, die Aufgabe der Zubereitung der Fische zu übernehmen.
Du weisst jedoch nicht, wie lange deine Psyche diese Lebenssituation noch aushalten kann.`;

    const mainText = this.add.text(
      panelX,
      panelY,
      "",
      {
        fontSize: bodySize,
        color: "#b7ffd8",
        fontFamily: "Quantico",
        align: "left",
        wordWrap: { width: panelW * 0.78 },
        lineSpacing: isSmallScreen ? 6 : 10
      }
    ).setOrigin(0.5);

    let index = 0;
    let isFinished = false;

    const typeEvent = this.time.addEvent({
      delay: isSmallScreen ? 35 : 50,
      loop: true,
      callback: () => {
        mainText.setText(introText.slice(0, index));
        index++;

        if (index > introText.length) {
          typeEvent.remove(false);
          isFinished = true;
          hintText.setText("[ MAUSTASTE KLICKEN ZUM FORTFAHREN ]");
        }
      }
    });

    const hintText = this.add.text(
      width / 2,
      height * 0.91,
      "[ MAUSTASTE KLICKEN ZUM ÜBERSPRINGEN ]",
      {
        fontSize: hintSize,
        color: "#3cff9b",
        fontFamily: "Quantico",
        align: "center"
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: hintText,
      alpha: 0.35,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut"
    });

    const goNext = () => {
      if (this.introVoice && this.introVoice.isPlaying) {
        this.introVoice.stop();
      }

      if (!isFinished) {
        typeEvent.remove(false);
        mainText.setText(introText);
        hintText.setText("[ MAUSTASTE KLICKEN ZUM FORTFAHREN ]");
        isFinished = true;
        return;
      }
      this.backgroundMusic.stop();
      this.scene.start("Tutorial");
    };

    this.input.keyboard.on("keydown", goNext);
    this.input.on("pointerdown", goNext);
  }
}
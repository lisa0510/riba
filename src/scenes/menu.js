import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("background", "assets/Fish02/UI/Fisch_Menü_UI.png");
    this.load.image("eye", "assets/Fish02/UI/FischAuge_Menü_UI.png");
    this.load.image("headphones", "assets/Fish02/UI/Kopfhörer_Symbol_UI.png");

    this.load.audio("background_music", "assets/audio/underwater.mp3");
    this.load.audio("menu_button", "assets/audio/menubutton.mp3");
  }

  create() {

    this.input.setDefaultCursor(
      "url(assets/Fish05/cursor.png), auto"
    );

    const { width, height } = this.scale;

    if (!this.bgMusic || !this.bgMusic.isPlaying) {
      this.bgMusic = this.sound.add("background_music", {
        loop: true,
        volume: 0.6
      });

      this.bgMusic.play();
    }

    // BACKGROUND
    const bg = this.add.image(
      width / 2,
      height / 2,
      "background"
    );

    bg.setDisplaySize(width, height);

    // EYE
    this.eyeCenterX = width / 2;
    this.eyeCenterY = height * 0.35;

    this.eye = this.add.image(
      this.eyeCenterX,
      this.eyeCenterY,
      "eye"
    );

    this.eye.setScale(width < 1200 ? 0.28 : 0.4);

    this.maxEyeDistance = width < 1200 ? 28 : 40;

    const menuX = width < 1200
      ? width * 0.16
      : width * 0.12;

    const titleY = height < 750
      ? height * 0.14
      : height * 0.1;

    const startY = height * 0.5;
    const creditsY = height * 0.62;

    const titleFontSize = Math.max(
      70,
      width * 0.09
    );

    const buttonFontSize = Math.max(
      28,
      width * 0.035
    );

    const buttonPaddingX = Math.max(
      12,
      width * 0.012
    );

    const buttonPaddingY = Math.max(
      8,
      height * 0.01
    );

    this.add.text(menuX, titleY, "RIBA", {
      fontSize: `${titleFontSize}px`,
      fill: "#fff",
      fontFamily: '"Roboto"',
      fontWeight: "900"
    }).setOrigin(0.5);

    // START BUTTON
    const startButton = this.add.text(
      menuX,
      startY,
      "START",
      {
        fontSize: `${buttonFontSize}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        backgroundColor: "#000000aa",
        padding: {
          x: buttonPaddingX,
          y: buttonPaddingY
        }
      }
    )
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: false,
        cursor: "url(assets/Fish05/cursorhover.png), pointer"
      });

    startButton.on("pointerover", () => {
      startButton.setStyle({
        fill: "rgb(0, 4, 255)"
      });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({
        fill: "#fff"
      });
    });

    startButton.on("pointerdown", () => {

      this.sound.play("menu_button", { volume: 0.6 });

      if (this.bgMusic) {
        this.bgMusic.stop();
      }

      this.time.delayedCall(150, () => {
        this.scene.start("Intro");
      });
    });

    // CREDITS BUTTON
    const creditsButton = this.add.text(
      menuX,
      creditsY,
      "Credits",
      {
        fontSize: `${buttonFontSize}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto Condensed"',
        backgroundColor: "#000000aa",
        padding: {
          x: buttonPaddingX,
          y: buttonPaddingY
        }
      }
    )
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: false,
        cursor: "url(assets/Fish05/cursorhover.png), pointer"
      });

    creditsButton.on("pointerover", () => {
      creditsButton.setStyle({
        fill: "rgb(0, 4, 255)"
      });
    });

    creditsButton.on("pointerout", () => {
      creditsButton.setStyle({
        fill: "#fff"
      });
    });

    creditsButton.on("pointerdown", () => {
      this.sound.play("menu_button", { volume: 0.6 });
      this.createCreditsPopup();
    });

    this.createPopup();
  }

  createPopup() {

    const { width, height } = this.scale;

    this.popupOverlay = this.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      1
    )
      .setOrigin(0)
      .setInteractive()
      .setDepth(100);

    this.popupContainer = this.add.container(
      width / 2,
      0
    ).setDepth(101);

    const headerText = this.add.text(
      0,
      height * 0.2,
      ' "Wenn das Wasser steigt, muss man versuchen darin zu überleben." ',
      {
        fontSize: `${Math.max(20, height * 0.04)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        align: "center",
        wordWrap: {
          width: width * 0.8
        }
      }
    ).setOrigin(0.5);

    const popupImg = this.add.image(
      0,
      height / 2,
      "headphones"
    )
      .setScale(width < 1200 ? 0.14 : 0.2);

    const infoText = this.add.text(
      0,
      popupImg.y + height * 0.2,
      "Trage Kopfhörer für eine bessere Erfahrung.",
      {
        fontSize: `${Math.max(18, height * 0.03)}px`,
        fill: "#bbbbbb",
        align: "center",
        fontFamily: '"Roboto"'
      }
    ).setOrigin(0.5);

    const hintText = this.add.text(
      0,
      height * 0.9,
      "[ MAUSTASTE KLICKEN ZUM FORTFAHREN ]",
      {
        fontSize: `${Math.max(16, height * 0.02)}px`,
        fill: "#666666",
        fontFamily: '"Roboto"'
      }
    )
      .setOrigin(0.5)
      .setName("waveText");

    this.popupContainer.add([
      headerText,
      popupImg,
      infoText,
      hintText
    ]);

    const closePopup = () => {

      if (this.popupContainer) {
        this.popupContainer.destroy();
      }

      if (this.popupOverlay) {
        this.popupOverlay.destroy();
      }

      this.input.keyboard.off(
        "keydown",
        closePopup
      );

      this.input.off(
        "pointerdown",
        closePopup
      );
    };

    this.time.delayedCall(200, () => {

      this.input.keyboard.on(
        "keydown",
        closePopup
      );

      this.input.on(
        "pointerdown",
        closePopup
      );
    });
  }

  createCreditsPopup() {

    const { width, height } = this.scale;

    if (this.creditsOverlay) return;

    this.creditsOverlay = this.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      0.94
    )
      .setOrigin(0)
      .setDepth(200);

    this.creditsContainer = this.add.container(
      width / 2,
      height / 2
    ).setDepth(201);

    const title = this.add.text(
      0,
      -height * 0.4,
      "CREDITS",
      {
        fontSize: `${Math.max(42, height * 0.065)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        fontWeight: "900"
      }
    ).setOrigin(0.5);

    const subtitle = this.add.text(
      0,
      -height * 0.3,
      "Bachelorarbeit 2026, Digital Ideation",
      {
        fontSize: `${Math.max(22, height * 0.02)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"'
      }
    ).setOrigin(0.5);

    const leftColumn = this.add.text(
      -width * 0.15,
      -height * 0.13,
      "Game Developer\nLisa Landolt",
      {
        fontSize: `${Math.max(20, height * 0.025)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    const rightColumn = this.add.text(
      width * 0.15,
      -height * 0.13,
      "Game Art Designer\nJennifer Beeler",
      {
        fontSize: `${Math.max(20, height * 0.025)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    const bottomCredits = this.add.text(
      0,
      height * 0.22,
      `Synchronsprecherinnen
Sara Noaman als Narratorin
Saskia Helg als Klara, Mona und Fisch

Game Soundtrack
Till Bierich

Mentor*innen
Léa Coquoz  Art, Story und Game Design
Ruth Bosch  Art, Story und Game Design
Benji Oser Technische Betreuung`,
      {
        fontSize: `${Math.max(22, height * 0.02)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        align: "center",
        lineSpacing: 12
      }
    ).setOrigin(0.5);

    const closeButton = this.add.text(
      width * 0.43,
      -height * 0.4,
      "✕",
      {
        fontSize: `${Math.max(34, height * 0.055)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"'
      }
    )
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: false,
        cursor: "url(assets/Fish05/cursorhover.png), pointer"
      });

    closeButton.on("pointerover", () => {
      closeButton.setStyle({
        fill: "rgb(0, 4, 255)"
      });
    });

    closeButton.on("pointerout", () => {
      closeButton.setStyle({
        fill: "#ffffff"
      });
    });

    closeButton.on("pointerdown", () => {

      this.sound.play("menu_button");

      this.tweens.add({
        targets: this.creditsContainer,
        alpha: 0,
        duration: 180,
        onComplete: () => {

          this.creditsContainer.destroy();
          this.creditsOverlay.destroy();

          this.creditsContainer = null;
          this.creditsOverlay = null;
        }
      });
    });

    this.creditsContainer.add([
      title,
      subtitle,
      leftColumn,
      rightColumn,
      bottomCredits,
      closeButton
    ]);

    this.creditsContainer.setAlpha(0);

    this.tweens.add({
      targets: this.creditsContainer,
      alpha: 1,
      duration: 250,
      ease: "Power2"
    });
  }

  update(time) {

    if (
      this.popupContainer &&
      this.popupContainer.active
    ) {

      this.popupContainer.iterate((child) => {

        if (child.name === "waveText") {

          child.y +=
            Math.sin(time * 0.002) * 0.25;

          child.angle =
            Math.sin(time * 0.001) * 0.5;
        }
      });
    }

    if (
      (this.popupOverlay &&
        this.popupOverlay.active) ||

      (this.creditsOverlay &&
        this.creditsOverlay.active)
    ) return;

    const pointer = this.input.activePointer;

    const angle = Phaser.Math.Angle.Between(
      this.eyeCenterX,
      this.eyeCenterY,
      pointer.x,
      pointer.y
    );

    const dist = Phaser.Math.Distance.Between(
      this.eyeCenterX,
      this.eyeCenterY,
      pointer.x,
      pointer.y
    );

    const constrainedDist = Math.min(
      dist * 2,
      this.maxEyeDistance
    );

    this.eye.x =
      this.eyeCenterX +
      Math.cos(angle) * constrainedDist;

    this.eye.y =
      this.eyeCenterY +
      Math.sin(angle) * constrainedDist;
  }
}
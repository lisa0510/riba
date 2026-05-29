import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("background", "assets/Fish02/UI/Fisch_Menü_UI.png");
    this.load.image("eye", "assets/Fish02/UI/FischAuge_Menü_UI.png");
    this.load.image("headphones", "assets/Fish02/UI/Kopfhörer_Symbol_UI.png");

    this.load.audio("background_music", "assets/audio/soundtrack.wav");
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
        volume: 2
      });

      this.bgMusic.play();
    }

    const bg = this.add.image(
      width / 2,
      height / 2,
      "background"
    );

    bg.setDisplaySize(width, height);
    this.bubbles = this.add.group();

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.createBubble();
      }
    });

    // EYE
    this.eyeCenterX = width / 2;
    this.eyeCenterY = height * 0.35;

    this.eye = this.add.image(
      this.eyeCenterX,
      this.eyeCenterY,
      "eye"
    );

    this.eye.setScale(width < 1200 ? 0.23 : 0.3);

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

    const buttonW = Math.max(230, width * 0.16);
    const buttonH = Math.max(58, height * 0.07);

    const startButtonBg = this.add.rectangle(
      menuX,
      startY,
      buttonW,
      buttonH,
      0xffffff,
      0.12
    )
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff, 0.35)
      .setDepth(5)
      .setInteractive({
        useHandCursor: false,
        cursor: "url(assets/Fish05/cursorhover.png), pointer"
      });

    const startButtonGlow = this.add.rectangle(
      menuX,
      startY,
      buttonW + 10,
      buttonH + 10,
      0x9be7ff,
      0.08
    )
      .setOrigin(0.5)
      .setDepth(4);

    const startButtonText = this.add.text(
      menuX,
      startY,
      "START GAME",
      {
        fontSize: `${Math.max(24, width * 0.022)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        letterSpacing: 2
      }
    )
      .setOrigin(0.5)
      .setDepth(6);

    this.tweens.add({
      targets: startButtonGlow,
      alpha: 0.18,
      scaleX: 1.04,
      scaleY: 1.12,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    startButtonBg.on("pointerover", () => {
      startButtonBg.setFillStyle(0xffffff, 0.15);
      startButtonBg.setStrokeStyle(2, 0xffffff, 0.75);
      startButtonText.setStyle({ fill: "rgb(210, 242, 245)" });

      this.tweens.add({
        targets: [startButtonBg, startButtonGlow, startButtonText],
        scaleX: 1.06,
        scaleY: 1.06,
        duration: 120,
        ease: "Power2"
      });
    });

    startButtonBg.on("pointerout", () => {
      startButtonBg.setFillStyle(0xffffff, 0.12);
      startButtonBg.setStrokeStyle(2, 0xffffff, 0.35);
      startButtonText.setStyle({ fill: "#ffffff" });

      this.tweens.add({
        targets: [startButtonBg, startButtonGlow, startButtonText],
        scaleX: 1,
        scaleY: 1,
        duration: 120,
        ease: "Power2"
      });
    });

    startButtonBg.on("pointerdown", () => {
      this.sound.play("menu_button", { volume: 0.1 });
      if (this.bgMusic) {
        this.bgMusic.stop();
        this.bgMusic.destroy();
        this.bgMusic = null;
      }

      this.tweens.add({
        targets: [startButtonBg, startButtonGlow, startButtonText],
        alpha: 0,
        duration: 180,
        ease: "Power2",
        onComplete: () => {
          this.scene.start("Intro");
        }
      });
    });


    const creditsButtonBg = this.add.rectangle(
      menuX,
      creditsY,

      buttonW,
      buttonH,

      0xffffff,
      0.12
    )
      .setOrigin(0.5)
      .setStrokeStyle(
        2,
        0xffffff,
        0.35
      )
      .setDepth(5)
      .setInteractive({
        useHandCursor: false,
        cursor:
          "url(assets/Fish05/cursorhover.png), pointer"
      });

    const creditsButtonGlow = this.add.rectangle(
      menuX,
      creditsY,

      buttonW + 10,
      buttonH + 10,

      0x9be7ff,
      0.08
    )
      .setOrigin(0.5)
      .setDepth(4);

    const creditsButtonText = this.add.text(
      menuX,
      creditsY,

      "CREDITS",
      {
        fontSize: `${Math.max(24, width * 0.022)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        letterSpacing: 2
      }
    )
      .setOrigin(0.5)
      .setDepth(6);

    // AMBIENT PULSE
    this.tweens.add({
      targets: creditsButtonGlow,
      alpha: 0.18,
      scaleX: 1.04,
      scaleY: 1.12,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    // HOVER
    creditsButtonBg.on("pointerover", () => {

      creditsButtonBg.setFillStyle(
        0xffffff,
        0.15
      );

      creditsButtonBg.setStrokeStyle(
        2,
        0xffffff,
        0.75
      );

      creditsButtonText.setStyle({
        fill: "rgb(210, 242, 245)"
      });

      this.tweens.add({
        targets: [
          creditsButtonBg,
          creditsButtonGlow,
          creditsButtonText
        ],

        scaleX: 1.06,
        scaleY: 1.06,

        duration: 120,
        ease: "Power2"
      });
    });

    // OUT
    creditsButtonBg.on("pointerout", () => {

      creditsButtonBg.setFillStyle(
        0xffffff,
        0.12
      );

      creditsButtonBg.setStrokeStyle(
        2,
        0xffffff,
        0.35
      );

      creditsButtonText.setStyle({
        fill: "#ffffff"
      });

      this.tweens.add({
        targets: [
          creditsButtonBg,
          creditsButtonGlow,
          creditsButtonText
        ],

        scaleX: 1,
        scaleY: 1,

        duration: 120,
        ease: "Power2"
      });
    });

    // CLICK
    creditsButtonBg.on("pointerdown", () => {

      this.sound.play(
        "menu_button",
        { volume: 0.1 }
      );

      this.tweens.add({
        targets: [
          creditsButtonBg,
          creditsButtonGlow,
          creditsButtonText
        ],

        scaleX: 0.96,
        scaleY: 0.96,

        duration: 70,
        yoyo: true,
        ease: "Power2"
      });

      this.createCreditsPopup();
    });

    this.createPopup();
  }

  createBubble() {
    const { width, height } = this.scale;

    const bubbleSize = Phaser.Math.Between(6, 20);
    const startX = Phaser.Math.Between(0, width);
    const startY = height + bubbleSize + 20;

    const bubble = this.add.circle(
      startX,
      startY,
      bubbleSize,
      0xffffff,
      0.12
    )
      .setStrokeStyle(2, 0xffffff, 0.16)
      .setDepth(1);

    const drift = Phaser.Math.Between(-80, 80);
    const duration = Phaser.Math.Between(5000, 9000);

    this.tweens.add({
      targets: bubble,
      x: startX + drift,
      y: -bubbleSize,
      alpha: 0,
      duration: duration,
      ease: "Sine.easeInOut",
      onComplete: () => {
        bubble.destroy();
      }
    });

    this.tweens.add({
      targets: bubble,
      scaleX: 1.25,
      scaleY: 0.95,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
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
      height * 0.87
    ).setDepth(201);

    const title = this.add.text(
      0,
      0,
      "CREDITS",
      {
        fontSize: `${Math.max(42, height * 0.065)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        fontWeight: "900",
        align: "center"
      }
    ).setOrigin(0.5);

    const credits = [
      ["Lisa Landolt", "Game Entwicklerin"],
      ["Jennifer Beeler", "Game Art Designerin"],
      ["", ""],

      ["SYNCHRONSPRECHERINNEN", ""],
      ["Sara Noaman", "Narratorin"],
      ["Saskia Helg", "Klara, Mona und Fisch"],


      ["SOUNDTRACK", ""],
      ["Till Bierich", "Soundtrack Komponist"],


      ["MENTOR*INNEN", ""],
      ["Léa Coquoz", "Mentorin Art, Story und Game Design"],
      ["Ruth Bosch", "Mentorin Art, Story und Game Design"],
      ["Benji Oser", "Technische Betreuung"]
    ];

    const rowStartY = height * 0.18;
    const rowGap = Math.max(55, height * 0.07);

    const creditObjects = [title];

    credits.forEach((credit, index) => {
      const y = rowStartY + index * rowGap;

      if (credit[1] === "") {
        const sectionText = this.add.text(
          0,
          y,
          credit[0],
          {
            fontSize: `${Math.max(24, height * 0.025)}px`,
            fill: "#ffffff",
            fontFamily: '"Roboto"',
            align: "center"
          }
        ).setOrigin(0.5);

        creditObjects.push(sectionText);
        return;
      }

      const nameText = this.add.text(
        -width * 0.08,
        y,
        credit[0],
        {
          fontSize: `${Math.max(22, height * 0.03)}px`,
          fill: "#ffffff",
          fontFamily: '"Roboto"',
          align: "right"
        }
      ).setOrigin(1, 0.5);

      const jobText = this.add.text(
        width * 0.08,
        y,
        credit[1],
        {
          fontSize: `${Math.max(22, height * 0.03)}px`,
          fill: "#bbbbbb",
          fontFamily: '"Roboto"',
          align: "left"
        }
      ).setOrigin(0, 0.5);

      creditObjects.push(nameText, jobText);
    });

    const endText = this.add.text(0,
      rowStartY + credits.length * rowGap + height * 0.2,
      "\n\nDanke an all unseren Playtestern, Unterstützern und Freunde!\n\n\n\n\n\n\n\nBachelorarbeit Digital Ideation 2026, Hochschule Luzern",
      {
        fontSize: `${Math.max(28, height * 0.035)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"',
        align: "center"
      }
    ).setOrigin(0.5);
    
    creditObjects.push(endText);

    this.creditsContainer.add(creditObjects);

    const closeButton = this.add.text(
      width * 0.94,
      height * 0.08,
      "✕",
      {
        fontSize: `${Math.max(34, height * 0.055)}px`,
        fill: "#ffffff",
        fontFamily: '"Roboto"'
      }
    )
      .setOrigin(0.5)
      .setDepth(202)
      .setInteractive({
        useHandCursor: false,
        cursor: "url(assets/Fish05/cursorhover.png), pointer"
      });

    closeButton.on("pointerover", () => {
      closeButton.setStyle({
        fill: "rgb(210, 242, 245)"
      });
    });

    closeButton.on("pointerout", () => {
      closeButton.setStyle({
        fill: "#ffffff"
      });
    });

    const closeCredits = () => {
      this.sound.play("menu_button", { volume: 0.1 });

      this.tweens.killTweensOf(this.creditsContainer);

      this.tweens.add({
        targets: [this.creditsContainer, closeButton],
        alpha: 0,
        duration: 250,
        ease: "Power2",
        onComplete: () => {
          this.creditsContainer.destroy();
          this.creditsOverlay.destroy();
          closeButton.destroy();

          this.creditsContainer = null;
          this.creditsOverlay = null;
        }
      });
    };

    closeButton.on("pointerdown", closeCredits);

    this.tweens.add({
      targets: this.creditsContainer,
      y: -height * 1.15,
      duration: 40000,
      ease: "Linear",
      onComplete: () => {
        closeCredits();
      }
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
import Phaser from "phaser";
import dialogues from "../data/dialogues_tutorial.js";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish06/Backround_GoodThought.png");
    this.load.image("shop_laser", "assets/Fish06/Front_GreyScale.png");
    this.load.image("customer", "assets/Fish06/Klara_GreyScale.png");
    this.load.image("fish", "assets/Fish06/GreyScaleFisch.png");
    this.load.image("cuttingview", "assets/Fish06/GreyScaleChop.png");
    this.load.image("cup", "assets/Fish06/coffee.png");
    this.load.image("note1", "assets/Fish06/Fish01_Icon.png");
    this.load.image("button", "assets/Fish06/Button_Chopping.png");
    this.load.audio("bg_music", "assets/audio/riba.wav");
    this.load.image("bad", "assets/Fish06/BadFisch_01.png");
    this.load.image("good", "assets/Fish06/GoodFisch_01.png");
    this.load.image("toomuch", "assets/Fish06/SmallPortionFisch1.png");
    this.load.audio("badcut", "assets/audio/feedback/bad.mp3");
    this.load.audio("goodcut", "assets/audio/feedback/ok.mp3");
    this.load.audio("toomuchcut", "assets/audio/feedback/bad.mp3");

    this.load.audio("laser", "assets/audio/laser1.mp3");
    this.load.audio("tutorial1klara", "assets/audio/tutorial/tutorial1klara.mp3");
    this.load.audio("tutorial2klara", "assets/audio/tutorial/tutorial2klara.mp3");
  }

  create() {
    this.input.setDefaultCursor(
      "url(assets/Fish05/cursor.png), auto"
    );

    if (!this.bgMusic || !this.bgMusic.isPlaying) {
      this.bgMusic = this.sound.add("bg_music", {
        volume: 0.5
      });

      this.bgMusic.play();
    }

    const { width, height } = this.scale;

    this.shopBg = this.add.image(width / 2, height / 2, "shop_bg")
      .setDepth(-12);

    const bgScale = Math.min(
      width / this.shopBg.width,
      height / this.shopBg.height
    );

    this.shopBg.setScale(bgScale);

    this.shopLaser = this.add.image(width / 2, height / 2, "shop_laser")
      .setDepth(-10);
   this.shopLaser.setScale(1.1);

    this.coworker = this.add.image(width / 2, height / 1.9, "customer")
      .setScale(1)
      .setDepth(-11);

    this.dialogueIndex = 0;
    this.cuts = [];
    this.targetCM = 30;
    this.totalFish = 1;
    this.currentFish = 0;

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 2;

    this.fishPath = null;
    this.fishPathDebug = null;

    this.setupMainDialogue();
  }

  setupMainDialogue() {
    const { width, height } = this.scale;

    this.currentDialogues = dialogues.tutorial.intro;

    this.dialogueText = this.add.text(
      width * 0.08,
      height * 0.45,
      "",
      {
        fontSize: "25px",
        fontFamily: "Roboto",
        color: "#ffffff",
        backgroundColor: "#0000008d",
        padding: { x: 40, y: 25 },
        align: "left",
        wordWrap: { width: width * 0.2 },
      }
    )
      .setOrigin(0, 0.5)
      .setDepth(200);



    this.input.on("pointerdown", this.handleProgressDialogue, this);
    this.displayNextLine();
  }



  handleProgressDialogue() {
    this.displayNextLine();
  }

  displayNextLine() {
    if (this.dialogueIndex < this.currentDialogues.length) {
      const currentDialogue =
        this.currentDialogues[this.dialogueIndex];

      this.dialogueText.setText(
        currentDialogue.text
      );

      if (currentDialogue.voice) {
        if (this.currentVoice) {
          this.currentVoice.stop();
        }

        this.currentVoice = this.sound.add(
          currentDialogue.voice,
          {
            volume: 1
          }
        );

        this.currentVoice.play();
      }

      this.dialogueIndex++;
    } else {
      if (this.currentVoice) {
        this.currentVoice.stop();
        this.currentVoice = null;
      }

      this.input.off("pointerdown", this.handleProgressDialogue, this);
      this.dialogueText.destroy();
      this.startTutorialCutting();
    }
  }

  startTutorialCutting() {
    const { width, height } = this.scale;

    this.blackBg = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      1
    ).setDepth(99);

    this.cuttingView = this.add.image(width / 2, height / 2, "cuttingview")
      .setDepth(100);

    const cuttingScale = Math.min(
      width / this.cuttingView.width,
      height / this.cuttingView.height
    );

    this.cuttingView.setScale(cuttingScale);
    
    const buttonX =
      this.cuttingView.x +
      this.cuttingView.displayWidth * 0.43;

    const buttonY =
      this.cuttingView.y +
      this.cuttingView.displayHeight * 0.31;

    this.cup = this.add.image(buttonX * 0.5, buttonY * 1.1, "cup")
      .setScale(1)
      .setDepth(101);

    this.note1 = this.add.image(width / 6.8, height / 4, "note1")
      .setDepth(101)
      .setScale(0.9);


    this.cutButton = this.add.image(
      buttonX,
      buttonY,
      "button"
    )
      .setDepth(102)
      .setScale(1.3)
      .setAlpha(1)
      .setInteractive({ useHandCursor: false });

    this.buttonGlow = this.add.image(
      this.cutButton.x,
      this.cutButton.y,
      "button"
    )
      .setDepth(101)
      .setScale(1.2)
      .setAlpha(0.25)
      .setTint(0xF0E1D2)
      .setBlendMode(Phaser.BlendModes.SCREEN);

    this.tweens.add({
      targets: this.buttonGlow,
      alpha: 0.35,
      scale: 1.6,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    this.cutButton.on("pointerover", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursorhover.png), pointer"
      );

      this.tweens.add({
        targets: this.cutButton,
        scale: 1.4,
        alpha: 1,
        duration: 100,
        ease: "Power2"
      });
    });

    this.cutButton.on("pointerout", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), auto"
      );

      this.tweens.add({
        targets: this.cutButton,
        scale: 1.2,
        alpha: 1,
        duration: 100,
        ease: "Power2"
      });
    });

    this.cutButton.on("pointerdown", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), pointer"
      );

      if (!this.canStopLine) return;

      this.laser = this.sound.add("laser", {
        volume: 0.1
      });
      this.laser.play();

      this.tweens.add({
        targets: this.cutButton,
        scale: 1.2,
        alpha: 1,
        duration: 70,
        yoyo: true,
        ease: "Power2"
      });

      this.stopLineAndCut();
    });

    this.infoText = this.add.text(
      width / 2,
      height * 0.15,
      "Dein Auftrag: \nDie Auswertung hat ergeben, dass die Giftstoffe sich vom Kopf aus auf 30% verbreitet hat.\nSchneid nur das Unbrauchbare weg. Jeder Millimeter gesundes Fleisch zählt. Dazu kannst du einfach auf den Knopf betätigen!",
      {
        fontSize: "28px",
        fontFamily: "Roboto",
        color: "#ffffff",
        backgroundColor: "#1d22a5c0",
        padding: { x: 40, y: 25 },
        align: "center",
        wordWrap: { width: width * 0.6 }
      }
    )
      .setOrigin(0.5)
      .setDepth(150)
      .setAlpha(1)
      .setInteractive({ useHandCursor: false });

    this.infoText.on("pointerover", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursorhover.png), pointer"
      );
    });

    this.infoText.on("pointerout", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), auto"
      );
    });

    this.closeInfoText = () => {

      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), pointer"
      );

      this.input.off(
        "pointerdown",
        this.closeInfoText
      );

      this.tweens.add({
        targets: this.infoText,
        alpha: 0,
        duration: 150,
        ease: "Power2",
        onComplete: () => {

          if (this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
          }

          this.enableLineClick();
        }
      });
    };

    this.time.delayedCall(200, () => {
      this.input.on(
        "pointerdown",
        this.closeInfoText
      );
    });

    this.spawnFish();

  }

  spawnFish() {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();
    if (this.fishPathDebug) this.fishPathDebug.destroy();

    this.fish = this.add.image(
      width / 1.5,
      height / 2.5,
      "fish"
    ).setDepth(102);

    this.createFishPath();
    this.createMovingCutLine();
  }

  createFishPath() {
    const bounds = this.fish.getBounds();

    const startX = bounds.left + bounds.width * 0.04;
    const startY = this.fish.y;

    const endX = bounds.left + bounds.width * 0.96;
    const endY = this.fish.y;

    this.fishPath = new Phaser.Curves.Path(
      startX,
      startY
    );

    this.fishPath.lineTo(endX, endY);
  }

  drawFishPathDebug() {
    if (this.fishPathDebug) {
      this.fishPathDebug.destroy();
    }

    this.fishPathDebug = this.add.graphics().setDepth(500);
    this.fishPathDebug.lineStyle(3, 0xff0000, 1);
    //debug Linie zeichnen
    this.fishPath.draw(this.fishPathDebug);
  }

  getPercentOnFishPath(cutX) {
    if (!this.fishPath || !this.fish) return 0;

    const bounds = this.fish.getBounds();

    const startX = bounds.left + bounds.width * 0.04;
    const endX = bounds.left + bounds.width * 0.96;

    const clampedX = Phaser.Math.Clamp(cutX, startX, endX);

    const t = Phaser.Math.Clamp(
      (clampedX - startX) / (endX - startX),
      0,
      1
    );

    return Math.round(t * 100);
  }

  createMovingCutLine() {
    const bounds = this.fish.getBounds();

    this.cutLine = this.add.rectangle(
      bounds.left,
      this.fish.y,
      5,
      this.fish.displayHeight + 90,
      0xffffff,
      0.95
    ).setDepth(130);

    this.cutLineDirection = 1;
    this.cutLineSpeed = 4;
    this.canStopLine = false;
  }

  enableLineClick() {
    this.canStopLine = true;

    if (this.cutButton) {
      this.cutButton.setInteractive({ useHandCursor: false });
      this.cutButton.setAlpha(1);
    }
  }

  update() {
    if (!this.cutLine || !this.fish) return;

    const bounds = this.fish.getBounds();

    this.cutLine.x += this.cutLineSpeed * this.cutLineDirection;

    if (this.cutLine.x >= bounds.right) {
      this.cutLine.x = bounds.right;
      this.cutLineDirection = -1;
    }

    if (this.cutLine.x <= bounds.left) {
      this.cutLine.x = bounds.left;
      this.cutLineDirection = 1;
    }
  }

  stopLineAndCut() {
    if (!this.canStopLine) return;
    if (!this.cutLine || !this.fish) return;

    this.canStopLine = false;

    if (this.cutButton) {
      this.cutButton.disableInteractive();
    }
    if (this.buttonGlow) {
      this.buttonGlow.destroy();
    }

    const bounds = this.fish.getBounds();

    const localX = Phaser.Math.Clamp(
      this.cutLine.x - bounds.left,
      0,
      this.fish.displayWidth
    );

    const percent = this.getPercentOnFishPath(this.cutLine.x);

    this.cuts.push(percent);

    this.cutLine.destroy();
    this.cutLine = null;

    if (this.fishPathDebug) {
      this.fishPathDebug.destroy();
      this.fishPathDebug = null;
    }

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const {
      x,
      y,
      displayWidth: w,
      displayHeight: h
    } = this.fish;

    const leftHalf = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h)
      .setDepth(103);

    const rightHalf = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h)
      .setDepth(103);

    this.fish.destroy();

    let feedbackTexture;
    let feedbackColor;
    let feedbackSound;
    let feedbackScale;

    if (percent < 30) {

      feedbackTexture = "bad";
      feedbackColor = "#ff4444";
      feedbackSound = "badcut";
      feedbackScale = 0.12;

    }

    else if (percent >= 30 && percent <= 35) {

      feedbackTexture = "good";
      feedbackColor = "#2ecc71";
      feedbackSound = "goodcut";
      feedbackScale = 0.12;

    }
    else {

      feedbackTexture = "toomuch";
      feedbackColor = "#ffd166";
      feedbackSound = "toomuchcut";
      feedbackScale = 0.18;

    }
    this.sound.play(feedbackSound, {
      volume: 0.6
    });

    const percentText = this.add.text(
      this.scale.width * 0.09,
      this.scale.height * 0.8,
      `${percent}%`,
      {
        fontSize: `${Math.max(32, this.scale.width * 0.035)}px`,
        fontFamily: "Roboto",
        color: feedbackColor,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 5
      }
    )
      .setOrigin(0, 1)
      .setDepth(300);

    const feedbackImg = this.add.image(
      percentText.x + percentText.width,
      percentText.y - percentText.height / 2,
      feedbackTexture
    )
      .setOrigin(0, 0.5)
      .setDepth(300)
      .setScale(feedbackScale);

    this.tweens.add({
      targets: feedbackImg,
      scale: 0.6,
      duration: 100,
      yoyo: true,
      ease: "Power2"
    });

    this.tweens.add({
      targets: leftHalf,
      x: x - 250,
      alpha: 0,
      duration: 350
    });

    this.tweens.add({
      targets: rightHalf,
      x: x + 250,
      alpha: 0,
      duration: 350
    });

    this.time.delayedCall(2000, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      percentText.destroy();
      feedbackImg.destroy();

      this.nextFish();
    });
  }

  nextFish() {
    this.currentFish++;

    if (this.currentFish < this.totalFish) {
      this.spawnFish();

      this.time.delayedCall(150, () => {
        this.enableLineClick();
      });
    } else {
      this.finishTutorial();
    }
  }

  finishTutorial() {
    this.canStopLine = false;

    const { width, height } = this.scale;

    const endHintText = this.add.text(
      width / 2,
      height * 0.15,
      "Ich sehe du hast es geschafft den Laser zu bedienen. Schneide nun die anderen Fische von der ersten Box auch noch.",
      {
        fontSize: "28px",
        fontFamily: "Roboto",
        color: "#ffffff",
        backgroundColor: "#1d22a5c0",
        padding: { x: 40, y: 25 },
        align: "center",
        wordWrap: { width: width * 0.6 }
      }
    )
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0);

    this.tweens.add({
      targets: endHintText,
      alpha: 1,
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.cameras.main.fade(1000, 0, 0, 0);
          if (this.bgMusic) {
            this.tweens.add({
              targets: this.bgMusic,
              volume: 0,
              duration: 800,
              ease: "Sine.easeOut",
              onComplete: () => {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
              }
            });

          }
          this.time.delayedCall(1000, () => {
            this.scene.start("Shop");
          });
        });
      }
    });
  }
}
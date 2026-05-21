import Phaser from "phaser";
import dialogues from "../data/dialogues_tutorial.js";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish05/Backround_Greyscale.png");
    this.load.image("shop_laser", "assets/Fish05/Fordergrund_Grey.png");
    this.load.image("customer", "assets/Fish05/Klara1.png");

    this.load.image("fish", "assets/Fish05/Fish01_Grey.png");
    this.load.image("cuttingview", "assets/Fish05/ScreenChop_Grey.png");

    this.load.image("note1", "assets/Fish04/FirstBox_CuttingBoard.png");
    this.load.image("button", "assets/Fish05/Button_ScreenChop_Grey.png");

    this.load.image("bad", "assets/Fish05/FishBad_Feedback.png");
    this.load.image("good", "assets/Fish05/FishGood_Feedback.png");

    this.load.audio("laser", "assets/audio/laser1.mp3");
  }

  create() {
    this.input.setDefaultCursor(
      "url(assets/Fish05/cursor.png), auto"
    );

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

    const laserScale = Math.min(
      width / this.shopLaser.width,
      height / this.shopLaser.height
    );

    this.shopLaser.setScale(laserScale);

    this.coworker = this.add.image(width / 2, height / 1.7, "customer")
      .setScale(1.1)
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
      height * 0.42,
      "",
      {
        fontSize: "25px",
        fontFamily: "Roboto",
        color: "#ffffff",
        backgroundColor: "#000000c9",
        padding: { x: 40, y: 25 },
        align: "left",
        wordWrap: { width: width * 0.2 }
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
      this.dialogueText.setText(
        this.currentDialogues[this.dialogueIndex].text
      );

      this.dialogueIndex++;
    } else {
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

    this.note1 = this.add.image(width / 5, height / 3, "note1")
      .setDepth(101)
      .setScale(0.4);

    this.cutButton = this.add.image(width * 0.93, height * 0.81, "button")
      .setDepth(160)
      .setScale(1.2)
      .setAlpha(1)
      .setInteractive({ useHandCursor: false });
 
      this.buttonGlow = this.add.image(
      this.cutButton.x,
      this.cutButton.y,
      "button"
    )
      .setDepth(159)
      .setScale(1.4)
      .setAlpha(0.25)
      .setTint(0x1d22a5)
      .setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
      targets: this.buttonGlow,
      alpha: 0.55,
      scale: 1.6,
      duration: 900,
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

      this.sound.play("laser");

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
      "Dein Auftrag: \nDie Auswertung hat ergeben, dass die Giftstoffe sich vom Kopf aus auf 30% verbreitet hat.\nSchneide doch diese 30% ab. Dazu kannst du einfach auf den roten Knopf betätigen!",
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

    this.infoText.on("pointerdown", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), pointer"
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
    //erstelle Linienpfad von startX,startY zu endX,endY
    this.fishPath = new Phaser.Curves.Path(startX, startY);
    this.fishPath.lineTo(endX, endY);

    this.drawFishPathDebug();
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

    const diff = Math.abs(percent - 30);
    const isOk = diff <= 2;

    const feedbackColor = isOk ? "#2ecc71" : "#ff4444";
    const feedbackTexture = isOk ? "good" : "bad";

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
      .setScale(0.25);

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
      "Klara: Ich sehe du hast es geschafft den Laser zu bedienen. Schneide nun die anderen Fische von der ersten Box auch noch.",
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
      duration: 3000,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.cameras.main.fade(1000, 0, 0, 0);

          this.time.delayedCall(1000, () => {
            this.scene.start("Shop");
          });
        });
      }
    });
  }
}
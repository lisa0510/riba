import Phaser from "phaser";

import DialogueManager from "../systems/dialogueManager.js";
import BoxManager from "../systems/boxManager.js";
import gameState from "../systems/gamestate.js";

import { box1Data } from "../data/box1Dialogue.js";
import { box2Data } from "../data/box2Dialogue.js";

export default class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish04/Back_TalkView.png");
    this.load.image("shop_laser", "assets/Fish04/Front_TalkView.png");
    this.load.image("customer", "assets/Fish04/Normal_Klara.png");

    this.load.image("fish", "assets/Fish04/First_Fisch.png");
    this.load.image("cuttingview", "assets/Fish04/CuttingView.png");
    this.load.image("note1", "assets/Fish04/FirstBox_CuttingBoard.png");
    this.load.image("button", "assets/Fish04/Red_Button.png");
    this.load.image("parasite", "assets/Fish04/Small_BadThoughts_Klara.png");

    this.load.audio("laser", "assets/audio/laser1.mp3");
  }

  create() {
    const { width, height } = this.scale;

        this.shopBg = this.add.image(
      width / 2,
      height / 2,
      "shop_bg"
    ).setDepth(-12);

    const bgScale = Math.min(
      width / this.shopBg.width,
      height / this.shopBg.height
    );

    this.shopBg.setScale(bgScale);

    this.shopLaser = this.add.image(
      width / 2,
      height / 1.5,
      "shop_laser"
    ).setDepth(-10);

    const laserScale = Math.min(
      width / this.shopLaser.width,
      height / this.shopLaser.height
    );

    this.shopLaser.setScale(laserScale * 0.8);

    this.coworkerScale = Phaser.Math.Clamp(
    height * 0.0011,
    0.6,
    0.7
    );

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    )
      .setScale(this.coworkerScale)
      .setDepth(-11);

    this.dialogueManager = new DialogueManager(this);
    this.boxManager = new BoxManager(this);

    this.totalFish = 4;
    this.currentFish = 0;
    this.cutResults = [];
    this.choiceButtons = [];
    this.targetPercent = 30;

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 5;
    this.canStopLine = false;
    this.cutInputReady = false;

    gameState.reset();

    this.currentBoxId = "box1";
    this.currentBox = box1Data;

    this.startCuttingPhase();
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

  startCuttingPhase() {
    const { width, height } = this.scale;

    this.blackBg = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      1
    ).setDepth(99);

    this.cuttingView = this.add.image(
      width / 2,
      height / 2,
      "cuttingview"
    ).setDepth(100);

    const cuttingScale = Math.min(
      width / this.cuttingView.width,
      height / this.cuttingView.height
    );

    this.cuttingView.setScale(cuttingScale);

    this.note1 = this.add.image(
      width / 5,
      height / 3,
      "note1"
    )
      .setDepth(101)
      .setScale(0.4);

    this.cutButton = this.add.image(
      width * 0.79,
      height * 0.88,
      "button"
    )
      .setDepth(160)
      .setScale(0.22)
      .setAlpha(1)
      .setInteractive({ useHandCursor: true });

    this.cutButton.on("pointerover", () => {
      this.tweens.add({
        targets: this.cutButton,
        scale: 0.25,
        duration: 100,
        ease: "Power2"
      });
    });

    this.cutButton.on("pointerout", () => {
      this.tweens.add({
        targets: this.cutButton,
        scale: 0.22,
        duration: 100,
        ease: "Power2"
      });
    });

    this.cutButton.on("pointerdown", () => {
      if (!this.canStopLine) return;
      if (!this.cutInputReady) return;

      this.sound.play("laser");

      this.tweens.add({
        targets: this.cutButton,
        scale: 0.22,
        duration: 70,
        yoyo: true,
        ease: "Power2"
      });

      this.stopLineAndCut();
    });

    this.spawnFish(true);
    this.enableLineClick();
  }

  spawnFish(showLine = true) {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.canStopLine = false;
    this.cutInputReady = false;

    this.fish = this.add.image(
      width / 1.6,
      height / 3,
      "fish"
    ).setDepth(102);

    if (showLine) {
      this.createMovingCutLine();
    }
  }

  createMovingCutLine() {
    if (!this.fish) return;

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
    this.cutLineSpeed = 5;
  }

  enableLineClick() {
    this.canStopLine = true;
    this.cutInputReady = false;

    this.time.delayedCall(150, () => {
      this.cutInputReady = true;

      if (this.cutButton) {
        this.cutButton.setInteractive({ useHandCursor: true });
        this.cutButton.setAlpha(1);
      }
    });
  }

  stopLineAndCut() {
    if (!this.canStopLine) return;
    if (!this.cutInputReady) return;
    if (!this.cutLine || !this.fish) return;

    this.canStopLine = false;
    this.cutInputReady = false;

    if (this.cutButton) {
      this.cutButton.disableInteractive();
      this.cutButton.setAlpha(1);
    }

    const bounds = this.fish.getBounds();

    const localX = Phaser.Math.Clamp(
      this.cutLine.x - bounds.left,
      0,
      this.fish.displayWidth
    );

    const percent = Math.round(
      (localX / this.fish.displayWidth) * 100
    );

    this.cutResults.push(percent);
    gameState.saveCut(this.currentBoxId, percent);

    this.cutLine.destroy();
    this.cutLine = null;

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

    const leftHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h);

    const rightHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h);

    this.fish.destroy();

    const diff = Math.abs(percent - this.targetPercent);
    const feedbackColor = diff <= 2 ? "#2ecc71" : "#ff4444";

    const percentText = this.add.text(
      this.scale.width * 0.23,
      this.scale.height * 0.85,
      `${percent}%`,
      {
        fontSize: `${Math.max(32, this.scale.width * 0.03)}px`,
        fontFamily: "Roboto",
        color: feedbackColor,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 5
      }
    )
      .setOrigin(0, 1)
      .setDepth(300);

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

    this.time.delayedCall(800, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      percentText.destroy();

      this.nextFish();
    });
  }

  nextFish() {
    this.currentFish++;

    if (this.currentFish < this.totalFish) {
      this.spawnFish(true);
      this.enableLineClick();
    } else {
      this.finishBox();
    }
  }

  finishBox() {
    if (this.blackBg) this.blackBg.destroy();
    if (this.cuttingView) this.cuttingView.destroy();
    if (this.note1) this.note1.destroy();
    if (this.cutLine) this.cutLine.destroy();
    if (this.cutButton) this.cutButton.destroy();

    this.canStopLine = false;
    this.cutInputReady = false;

    const perfect = gameState.isPerfectBox(this.currentBoxId);

    if (perfect) {
      this.dialogueManager.startDialogue(
        this.currentBox.successDialogue,
        () => {
          this.startNextStep();
        }
      );
    } else {
      this.dialogueManager.startDialogue(
        this.currentBox.failureDialogue,
        () => {

          this.time.delayedCall(400, () => {

            this.startParasiteEncounter();

          });

        }
      );
    }
  }

showChoices(choices, callback, timeoutCallback = null, timeoutMs = null) {
  const { width, height } = this.scale;

  const isSmall = width < 1200 || height < 750;

  const baseX = width * 0.08;
  const dialogueY = height * 0.42;

  const choiceWidth = Phaser.Math.Clamp(width * 0.25, 220, 420);
  const choiceFontSize = isSmall ? "17px" : "20px";
  const timerFontSize = isSmall ? "22px" : "28px";

  const baseY = dialogueY + Phaser.Math.Clamp(height * 0.24, 150, 250);
  const spacingY = Phaser.Math.Clamp(height * 0.085, 54, 75);

  const timerX = baseX + choiceWidth - Phaser.Math.Clamp(width * 0.03, 20, 20);
  const timerY = baseY;

  let choiceMade = false;
  let timeoutEvent = null;
  let timerEvent = null;
  let timerText = null;
  let remainingSeconds = timeoutMs ? Math.ceil(timeoutMs / 1000) : 0;

  const clearChoices = () => {
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];

    if (timeoutEvent) {
      timeoutEvent.remove(false);
      timeoutEvent = null;
    }

    if (timerEvent) {
      timerEvent.remove(false);
      timerEvent = null;
    }

    if (timerText) {
      timerText.destroy();
      timerText = null;
    }
  };

  if (timeoutCallback && timeoutMs) {
    timerText = this.add.text(
      timerX,
      timerY,
      `${remainingSeconds}`,
      {
        fontSize: timerFontSize,
        fontFamily: "Roboto",
        color: "#ffffff",
        backgroundColor: "#000000cc",
        padding: { x: 18, y: 10 }
      }
    )
      .setOrigin(0, 0.5)
      .setDepth(650);

    timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        remainingSeconds--;

        if (timerText) {
          timerText.setText(`${remainingSeconds}`);
        }

        if (remainingSeconds <= 0 && timerEvent) {
          timerEvent.remove(false);
        }
      }
    });

    timeoutEvent = this.time.delayedCall(timeoutMs, () => {
      if (choiceMade) return;

      choiceMade = true;
      clearChoices();

      if (this.dialogueManager) {
        this.dialogueManager.clearDialogue();
      }

      timeoutCallback();
    });
  }

  choices.forEach((choice, index) => {
    const xPos = baseX;
    const yPos = baseY + index * spacingY;

    const btn = this.add.text(xPos, yPos, choice.text, {
      fontSize: choiceFontSize,
      fontFamily: "Roboto",
      backgroundColor: "#000000cc",
      color: "#ffffff",
      padding: {
        x: isSmall ? 14 : 18,
        y: isSmall ? 9 : 12
      },
      align: "left",
      wordWrap: { width: choiceWidth }
    })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(600);

    btn.on("pointerdown", () => {
      if (choiceMade) return;

      choiceMade = true;
      clearChoices();

      if (this.dialogueManager) {
        this.dialogueManager.clearDialogue();
      }

      callback(choice);
    });

    this.choiceButtons.push(btn);

    btn.setAlpha(0);

    this.tweens.add({
      targets: btn,
      alpha: 1,
      duration: 500,
      ease: "Power2"
    });
  });
}

startParasiteEncounter() {
  const { width, height } = this.scale;

  this.cameras.main.shake(250, 0.0025);

  const flash = this.add.rectangle(
    width / 2,
    height / 2,
    width,
    height,
    0xffffff,
    0.35
  ).setDepth(999);

  this.time.delayedCall(60, () => {
    flash.destroy();
  });

  this.tweens.add({
    targets: [this.shopBg, this.shopLaser],
    x: "+=6",
    duration: 40,
    yoyo: true,
    repeat: 2,
    ease: "Sine.easeInOut"
  });

  if (this.coworker) {
    this.coworker.setVisible(false);
  }

  gameState.setParasiteInteraction(this.currentBoxId, true);

  this.parasite = this.add.image(
    width / 2,
    height / 2,
    "parasite"
  )
    .setDepth(-11)
    .setScale(this.coworkerScale)
    .setAlpha(1);

  const parasiteNode = this.currentBox.parasiteDialogue[0];

  if (!parasiteNode) {
    console.error("parasiteDialogue fehlt in:", this.currentBoxId);
    this.startNextStep();
    return;
  }

  this.tweens.add({
    targets: this.parasite,
    alpha: 0.2,
    duration: 60,
    yoyo: true,
    repeat: 4,
    ease: "Power2",
    onComplete: () => {
      if (this.parasite) {
        this.parasite.setAlpha(1);
      }

      this.dialogueManager.startDialogue(
  [{ text: parasiteNode.text }],
  () => {
    this.showChoices(
      parasiteNode.choices,

      (choice) => {
        gameState.saveParasiteChoice(
          this.currentBoxId,
          choice.id
        );

        if (choice.nextText) {
          this.dialogueManager.startDialogue(
            [{ text: choice.nextText }],
            () => {
              this.startNextStep();
            }
          );
        } else {
          this.startNextStep();
        }
      },

      () => {
        gameState.saveParasiteChoice(
          this.currentBoxId,
          "ignored"
        );

        if (
          parasiteNode.ignoreDialogue &&
          parasiteNode.ignoreDialogue[0]
        ) {
          this.dialogueManager.startDialogue(
            [parasiteNode.ignoreDialogue[0]],
            () => {
              this.startNextStep();
            }
          );
        } else {
          this.startNextStep();
        }
      },
      //timer in miliseconds
      10000
    );
  },

  true 
);
    }
  
  });
}

   startNextStep() {
    const { width, height } = this.scale;

    if (this.parasite) {
      this.parasite.destroy();
      this.parasite = null;
    }

    if (this.coworker) {
      this.coworker.destroy();
      this.coworker = null;
    }

    this.coworker = this.add.image(width / 2, height / 1.8, "customer")
      .setScale(this.coworkerScale)
      .setDepth(-11);

    if (this.currentBoxId === "box1") {
      this.currentBoxId = "box2";
      this.currentBox = box2Data;

      this.currentFish = 0;
      this.cutResults = [];

      this.dialogueManager.startDialogue(
        this.currentBox.introDialogue,
        () => {
          this.startCuttingPhase();
        }
      );

      return;
    }

    if (this.currentBoxId === "box2") {
      this.startFinalPath();
    }
  }

  startFinalPath() {
    const ending = gameState.getEnding();

    const preEndingDialogue =
      box2Data.preEndingDialogue[ending];

    this.dialogueManager.startDialogue(
      preEndingDialogue,
      () => {
        this.scene.start("Ending", {
          ending: ending
        });
      }
    );
  }
}
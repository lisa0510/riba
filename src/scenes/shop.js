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

    this.load.image("parasite", "assets/Fish02/parasite.png");
    this.load.image("miniwal", "assets/Fish02/MiniWal.png");

    this.load.audio("laser", "assets/audio/laser1.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg")
      .setDisplaySize(width, height)
      .setDepth(-12);

    this.add.image(width / 2, height / 2, "shop_laser")
      .setDisplaySize(width, height)
      .setDepth(-10);

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    )
      .setScale(0.5)
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
    this.cutLineSpeed = 6;
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
    this.cutLineSpeed = 6;
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
      this.startParasiteEncounter();
    }
  }

  showChoices(choices, callback, timeoutCallback = null, timeoutMs = null) {
    const { width, height } = this.scale;

    const baseX = width * 0.08;
    const baseY = height * 0.68;
    const spacingY = 75;

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
        baseX,
        height * 0.72,
        `${remainingSeconds}`,
        {
          fontSize: "28px",
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
        fontSize: "20px",
        fontFamily: "Roboto",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        padding: { x: 18, y: 12 },
        align: "left",
        wordWrap: { width: width * 0.25 }
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

    gameState.setParasiteInteraction(this.currentBoxId, true);

    this.parasite = this.add.image(
      width / 2,
      height / 2,
      "parasite"
    )
      .setDepth(400)
      .setScale(1.5);

    const parasiteIntro = this.currentBox.parasiteDialogue[0];
    const parasiteNode = this.currentBox.parasiteDialogue[1];

    this.dialogueManager.startDialogue(
      [{ text: parasiteIntro.text }],
      () => {
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
                      if (this.parasite) {
                        this.parasite.destroy();
                        this.parasite = null;
                      }

                      this.startNextStep();
                    }
                  );
                } else {
                  if (this.parasite) {
                    this.parasite.destroy();
                    this.parasite = null;
                  }

                  this.startNextStep();
                }
              },

              () => {
                gameState.saveParasiteChoice(
                  this.currentBoxId,
                  "ignored"
                );

                if (this.parasite) {
                  this.parasite.destroy();
                  this.parasite = null;
                }

                if (this.coworker) {
                  this.coworker.destroy();
                  this.coworker = null;
                }

                this.coworker = this.add.image(
                  width * 0.8,
                  0,
                  "miniwal"
                )
                  .setScale(0.4)
                  .setDepth(50)
                  .setOrigin(1, 0);

                this.dialogueManager.startDialogue(
                  [parasiteNode.ignoreDialogue[0]],
                  () => {
                    this.startNextStep();
                  }
                );
              },

              4000
            );
          },
          true
        );
      }
    );
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

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    )
      .setScale(0.5)
      .setDepth(50);

    if (this.currentBoxId === "box1") {
      this.currentBoxId = "box2";
      this.currentBox = box2Data;

      this.currentFish = 0;
      this.cutResults = [];

      this.startCuttingPhase();
    } else if (this.currentBoxId === "box2") {
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
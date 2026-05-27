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
    this.load.image("shop_bg", "assets/Fish05/Backround_Greyscale.png");
    this.load.image("shop_laser", "assets/Fish05/Fordergrund_Grey.png");
    this.load.image("customer", "assets/Fish05/Klara1.png");
    this.load.image("fish", "assets/Fish05/Fish01_Grey.png");
    this.load.image("fish2", "assets/Fish05/Fish02_Grey.png");
    this.load.image("cuttingview", "assets/Fish05/ScreenChop_Grey.png");
    this.load.image("note1", "assets/Fish04/FirstBox_CuttingBoard.png");
    this.load.image("note2", "assets/Fish04/SecondBox_CuttingBoard.png");
    this.load.image("button", "assets/Fish05/Button_ScreenChop_Grey.png");
    this.load.image("parasite", "assets/Fish04/Small_BadThoughts_Klaratest.png");
    this.load.image("bad", "assets/Fish05/FishBad_Feedback.png");
    this.load.image("good", "assets/Fish05/FishGood_Feedback.png");
    this.load.image("toomuch", "assets/Fish05/FishMedium_Feedback.png");

    this.load.audio("laser", "assets/audio/laser1.mp3");
    this.load.audio("box1_fehlerresponse", "assets/audio/box1/box1_fehlerresponse.mp3");
    this.load.audio("box1failedagree", "assets/audio/box1/box1failedagree.mp3");
    this.load.audio("box1faileddisagree", "assets/audio/box1/box1faileddisagree.mp3");
    this.load.audio("box1glitchmona", "assets/audio/box1/box1glitchmona.mp3");
    this.load.audio("box1ignore", "assets/audio/box1/box1ignore.mp3");
    this.load.audio("box1perfect", "assets/audio/box1/box1perfect.mp3");
    this.load.audio("box2disagree", "assets/audio/box2/box2disagree.mp3");
    this.load.audio("box2failedresponse", "assets/audio/box2/box2failedresponse.mp3");
    this.load.audio("box2glitchmona", "assets/audio/box2/box2glitchmona.mp3");
    this.load.audio("box2ignore", "assets/audio/box2/box2ignore.mp3");
    this.load.audio("box2keinfehler", "assets/audio/box2/box2keinfehler.mp3");
    this.load.audio("box2monaagree", "assets/audio/box2/box2monaagree.mp3");
    this.load.audio("binwiederda", "assets/audio/box2/binwiederda.mp3");
    this.load.audio("fishaudio", "assets/audio/box2/fish.mp3");
    this.load.audio("endingklaraoverall", "assets/audio/ending/endingklaraoverall.mp3");
    this.load.audio("ending2satt", "assets/audio/ending/ending2satt.mp3");
    this.load.audio("ending5unheimlich", "assets/audio/ending/ending5unheimlich.mp3");
    this.load.audio("ending1hey", "assets/audio/ending/ending1hey.mp3");
    this.load.audio("ending1verzehr", "assets/audio/ending/ending1verzehr.mp3");
    this.load.audio("ending2satt", "assets/audio/ending/ending2satt.mp3");
    this.load.audio("ending3unglaublich", "assets/audio/ending/ending3unglaublich.mp3");
    this.load.audio("ending3Zeit", "assets/audio/ending/ending3Zeit.mp3");
    this.load.audio("ending4haha", "assets/audio/ending/ending4haha.mp3");
    this.load.audio("ending4huh", "assets/audio/ending/ending4huh.mp3");
    this.load.audio("ending4mona", "assets/audio/ending/ending4mona.mp3");
    this.load.audio("ending5unglaublich", "assets/audio/ending/ending5unglaublich.mp3");
    this.load.audio("ending5unheimlich", "assets/audio/ending/ending5unheimlich.mp3");
    this.load.audio("badcut", "assets/audio/bad2.mp3");
    this.load.audio("goodcut", "assets/audio/ok2.mp3");
    this.load.audio("toomuchcut", "assets/audio/ok1.mp3");

    this.load.audio("backgroundmusic", "assets/audio/riba.wav");

  }

  create() {
    this.input.setDefaultCursor(
      "url(assets/Fish05/cursor.png), auto"
    );
    const { width, height } = this.scale;

    if (!this.bgMusic || !this.bgMusic.isPlaying) {
      this.bgMusic = this.sound.add("backgroundmusic", {
        loop: true,
        volume: 0.7
      });

      this.bgMusic.play();
    }

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
      height / 2,
      "shop_laser"
    ).setDepth(-10);

    const laserScale = Math.min(
      width / this.shopLaser.width,
      height / this.shopLaser.height
    );

    this.shopLaser.setScale(laserScale);

    this.coworkerScale = Phaser.Math.Clamp(
      height * 0.0011,
      0.6,
      0.7
    );

    this.coworker = this.add.image(
      width / 2,
      height / 1.7,
      "customer"
    )
      .setScale(1)
      .setDepth(-11);

    this.dialogueManager = new DialogueManager(this);
    this.boxManager = new BoxManager(this);

    this.totalFish = 4;
    this.currentFish = 0;
    this.cutResults = [];
    this.choiceButtons = [];

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 5;
    this.canStopLine = false;
    this.cutInputReady = false;

    gameState.reset();

    this.currentBoxId = "box1";
    this.currentBox = box1Data;
    this.targetPercent = this.currentBox.targetPercent || 30;

    this.startCuttingPhase();
  }

  update() {

    // ENDING 4 PARASITE LASER
    if (this.ending4CutActive && this.cutLine) {

      this.cutLine.x +=
        this.cutLineSpeed * this.cutLineDirection;

      if (this.cutLine.x >= this.cutLineMaxX) {
        this.cutLine.x = this.cutLineMaxX;
        this.cutLineDirection = -1;
      }

      if (this.cutLine.x <= this.cutLineMinX) {
        this.cutLine.x = this.cutLineMinX;
        this.cutLineDirection = 1;
      }

      return;
    }

    // NORMAL FISH CUTTING
    if (!this.cutLine || !this.fish) return;

    const bounds = this.fish.getBounds();

    this.cutLine.x +=
      this.cutLineSpeed * this.cutLineDirection;

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

    this.targetPercent = this.currentBox.targetPercent || 30;

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
      this.currentBox.noteTexture || "note1"
    )
      .setDepth(101)
      .setScale(0.4);

    this.cutButton = this.add.image(
      width * 0.93,
      height * 0.81,
      "button"
    )
      .setDepth(160)
      .setScale(1.3)
      .setAlpha(1)
      .setInteractive({ useHandCursor: false });

    this.cutButton.on("pointerover", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursorhover.png), pointer"
      );
      this.tweens.add({
        targets: this.cutButton,
        scale: 1.4,
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
        scale: 1.3,
        duration: 100,
        ease: "Power2"
      });
    });

    this.cutButton.on("pointerdown", () => {
      this.input.setDefaultCursor(
        "url(assets/Fish05/cursor.png), pointer"
      );

      if (!this.canStopLine) return;
      if (!this.cutInputReady) return;
      this.laser = this.sound.add("laser", {
        volume: 0.2
      });
      this.laser.play();

      this.tweens.add({
        targets: this.cutButton,
        scale: 1.4,
        duration: 70,
        yoyo: true,
        ease: "Power2"
      });

      this.stopLineAndCut();
    });

    this.spawnFish(true);
    if (this.currentBoxId === "box2") {

      this.canStopLine = false;
      this.cutInputReady = false;

      const hintText = this.add.text(
        width / 2,
        height * 0.8,
        "Fisch: Vergiss nicht, auch der erfahrenste Fisch kann sich im Netz verfangen. Du gibst dir Mühe beim Schneiden und das ist alles, was zählt blub blub.",
        {
          fontSize: "25px",
          fontFamily: "Roboto",
          color: "#f4d869",
          backgroundColor: "#000000cc",
          padding: { x: 30, y: 18 },
          align: "center",
          wordWrap: { width: width * 0.6 }
        }
      )
        .setOrigin(0.5)
        .setDepth(500);

      this.fishVoice = this.sound.add("fishaudio", {
        volume: 1
      });

      this.fishVoice.play();

      this.input.once("pointerdown", () => {
        if (this.fishVoice) {
          this.fishVoice.stop();
          this.fishVoice.destroy();
          this.fishVoice = null;
        }

        this.input.setDefaultCursor(
          "url(assets/Fish05/cursor.png), pointer"
        );

        this.tweens.add({
          targets: hintText,
          alpha: 0,
          duration: 250,
          onComplete: () => {

            hintText.destroy();

            this.enableLineClick();
          }
        });

      });

    } else {

      this.enableLineClick();

    }
  }

  spawnFish(showLine = true) {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.canStopLine = false;
    this.cutInputReady = false;

    this.fish = this.add.image(
      width / 1.5,
      height / 2.5,
      this.currentBox.fishTexture || "fish"
    ).setDepth(102);

    this.createFishPath();

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
        this.cutButton.setInteractive({ useHandCursor: false });
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

    const percent = this.getPercentOnFishPath(this.cutLine.x);

    this.cutResults.push(percent);
    gameState.saveCut(this.currentBoxId, percent);

    this.cutLine.destroy();
    this.cutLine = null;

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const {
      x,
      y,
      displayWidth: w,
      displayHeight: h
    } = this.fish;

    const fishTexture = this.currentBox.fishTexture || "fish";

    const leftHalf = this.add.image(x, y, fishTexture)
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h);

    const rightHalf = this.add.image(x, y, fishTexture)
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h);

    this.fish.destroy();

    let feedbackTexture;
    let feedbackColor;

    let feedbackSound;

// UNDERCUT
if (percent < this.targetPercent) {
  feedbackTexture = "bad";
  feedbackColor = "#ff4444";
  feedbackSound = "badcut";
}

// PERFECT
else if (
  percent >= this.targetPercent &&
  percent <= this.targetPercent + gameState.cutThreshold
) {
  feedbackTexture = "good";
  feedbackColor = "#2ecc71";
  feedbackSound = "goodcut";
}

// OVERCUT
else {
  feedbackTexture = "toomuch";
  feedbackColor = "#ffd166";
  feedbackSound = "toomuchcut";
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
      .setScale(0.25);


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
      feedbackImg.destroy();

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

  createFishPath() {
    if (!this.fish) return;

    const bounds = this.fish.getBounds();

    if (this.fishPathDebug) {
      this.fishPathDebug.destroy();
    }

    // BOX 1: gerader Fisch
    if (this.currentBoxId === "box1") {
      const startX = bounds.left + bounds.width * 0.04;
      const startY = this.fish.y;

      const endX = bounds.left + bounds.width * 0.96;
      const endY = this.fish.y;

      this.fishPath = new Phaser.Curves.Path(startX, startY);
      this.fishPath.lineTo(endX, endY);
    }

    // BOX 2: gebogener Fisch
    if (this.currentBoxId === "box2") {
      const startX = bounds.left + bounds.width * 0.17;
      const startY = bounds.top + bounds.height * 0.37;

      this.fishPath = new Phaser.Curves.Path(startX, startY);
      //Kontrollpunkte x,y
      this.fishPath.splineTo([
        new Phaser.Math.Vector2(bounds.left + bounds.width * 0.22, bounds.top + bounds.height * 0.46),
        new Phaser.Math.Vector2(bounds.left + bounds.width * 0.36, bounds.top + bounds.height * 0.60),
        new Phaser.Math.Vector2(bounds.left + bounds.width * 0.54, bounds.top + bounds.height * 0.56),
        new Phaser.Math.Vector2(bounds.left + bounds.width * 0.68, bounds.top + bounds.height * 0.24),
        new Phaser.Math.Vector2(bounds.left + bounds.width * 0.89, bounds.top + bounds.height * 0.42)
      ]);
    }

  }

  //line für developer, zeigt den Pfad des Fisches an, ist ingame aktuell nicht sichtbar

  drawFishPathDebug() {
    if (!this.fishPath) return;

    if (this.fishPathDebug) {
      this.fishPathDebug.destroy();
    }

    this.fishPathDebug = this.add.graphics().setDepth(500);
    this.fishPathDebug.lineStyle(3, 0xff0000, 1);
    this.fishPath.draw(this.fishPathDebug);
  }

  getPercentOnFishPath(cutX) {
    if (!this.fishPath) return 0;

    let closestT = 0;
    let closestDistance = Infinity;

    const steps = 150;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = this.fishPath.getPoint(t);

      const distance = Math.abs(point.x - cutX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestT = t;
      }
    }

    return Math.round(closestT * 100);
  }

  finishBox() {
    if (this.fishPathDebug) {
      this.fishPathDebug.destroy();
      this.fishPathDebug = null;
    }
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
        .setInteractive({ useHandCursor: false })
        .setDepth(600);

      btn.on("pointerover", () => {
        this.input.setDefaultCursor("url(assets/Fish05/cursorhover.png), auto");
      });
      btn.on("pointerout", () => {
        this.input.setDefaultCursor("url(assets/Fish05/cursor.png), auto");
      });
      btn.on("pointerdown", () => {
        this.input.setDefaultCursor("url(assets/Fish05/cursor.png), auto");
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
      .setAlpha(0);

    const parasiteNode = this.currentBox.parasiteDialogue[0];

    if (!parasiteNode) {
      console.error("parasiteDialogue fehlt in:", this.currentBoxId);
      this.startNextStep();
      return;
    }

    this.tweens.add({
      targets: this.parasite,
      alpha: 1,
      duration: 250,
      ease: "Power2",
      onComplete: () => {
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

        this.time.delayedCall(300, () => {
          this.dialogueManager.startDialogue(
            [parasiteNode],
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
                      [{
                        text: choice.nextText,
                        voice: choice.voice
                      }],
                      () => {
                        this.startNextStep();
                      },
                      true
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
                      },
                      true
                    );
                  } else {
                    this.startNextStep();
                  }
                },
                //timer
                10000
              );
            },
            true
          );
        });
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

    this.coworker = this.add.image(-600, this.scale.height / 1.7, "customer").setScale(1).setDepth(-11);

    this.tweens.add({
      targets: this.coworker,
      x: this.scale.width / 2,
      duration: 500,
      ease: "Cubic.easeOut"
    });



    if (this.currentBoxId === "box1") {
      this.currentBoxId = "box2";
      this.currentBox = box2Data;

      this.targetPercent = this.currentBox.targetPercent || 70;

      this.currentFish = 0;
      this.cutResults = [];

      if (this.currentBox.introDialogue) {
        this.dialogueManager.startDialogue(
          this.currentBox.introDialogue,
          () => {
            this.startCuttingPhase();
          }
        );
      } else {
        this.startCuttingPhase();
      }

      return;
    }

    if (this.currentBoxId === "box2") {
      this.startFinalPath();
    }
  }

  startEnding4ParasiteCut(onComplete) {
    const bounds = this.parasite.getBounds();

    this.cutLine = this.add.rectangle(
      bounds.left,
      bounds.centerY,
      5,
      bounds.height,
      0xffffff,
      0.95
    ).setDepth(200);

    this.cutLineMinX = bounds.left;
    this.cutLineMaxX = bounds.right;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 7;
    this.ending4CutActive = true;

    this.ending4CutHandler = () => {
      if (!this.ending4CutActive) return;

      this.ending4CutActive = false;

      this.sound.play("laser", {
        volume: 0.4
      });

      if (this.cutLine) {
        this.cutLine.destroy();
        this.cutLine = null;
      }

      this.cameras.main.shake(300, 0.006);

      this.tweens.add({
        targets: this.parasite,
        alpha: 0,
        scale: this.coworkerScale * 1.25,
        angle: 8,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
    };

    this.time.delayedCall(200, () => {
      this.input.once("pointerdown", this.ending4CutHandler);
    });
  }

  startFinalPath() {
    const ending = gameState.getEnding();

    const preEndingDialogue =
      box2Data.preEndingDialogue[ending];

    if (ending === "ending4") {
      this.dialogueManager.startDialogue(
        [preEndingDialogue[0]],
        () => {
          if (this.coworker) {
            this.coworker.destroy();
            this.coworker = null;
          }

          this.parasite = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "parasite"
          )
            .setScale(this.coworkerScale)
            .setDepth(-11);

          this.dialogueManager.startDialogue(
            [preEndingDialogue[1]],
            () => {
              this.dialogueManager.clearDialogue();

              this.startEnding4ParasiteCut(() => {
                if (this.parasite) {
                  this.parasite.destroy();
                  this.parasite = null;
                }

                this.coworker = this.add.image(
                  this.scale.width / 2,
                  this.scale.height / 1.7,
                  "customer"
                )
                  .setScale(1)
                  .setDepth(-11);

                this.dialogueManager.startDialogue(
                  [preEndingDialogue[2]],
                  () => {
                    this.showChoices(
                      preEndingDialogue[2].choices,
                      (choice) => {
                        this.dialogueManager.clearDialogue();

                        this.dialogueManager.startDialogue(
                          [
                            {
                              text: choice.nextText,
                              voice: choice.voice
                            }
                          ],
                          () => {
                            this.scene.start("Ending", {
                              ending: ending
                            });
                          }
                        );
                      }
                    );
                  },
                  true
                );
              });
            }
          );
        }
      );

      return;
    }

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
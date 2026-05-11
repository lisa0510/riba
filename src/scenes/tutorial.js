import Phaser from "phaser";
import dialogues from "../data/dialogues_tutorial.js";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish04/Back_TalkView.png");
    this.load.image("shop_laser", "assets/Fish04/Front_TalkView.png");
    this.load.image("customer", "assets/Fish04/Normal_Klara.png");
    this.load.image("fish", "assets/Fish04/First_Fisch.png");
    this.load.image("cuttingview", "assets/Fish04/CuttingView.png");
    this.load.image("note1", "assets/Fish04/FirstBox_CuttingBoard.png");
    this.load.image("button", "assets/Fish04/Red_Button.png");

    this.load.audio("laser", "assets/audio/laser1.mp3");
  }

  create() {
  const { width, height } = this.scale;

  this.shopBg = this.add.image(
    width / 2,
    height / 2,
    "shop_bg"
  )
    .setDepth(-12);

  const bgScale = Math.min(
    width / this.shopBg.width,
    height / this.shopBg.height
  );

  this.shopBg.setScale(bgScale);
  this.shopLaser = this.add.image(
    width / 2,
    height / 1.5,
    "shop_laser"
  )
    .setDepth(-10);

  const laserScale = Math.min(
    width / this.shopLaser.width,
    height / this.shopLaser.height
  );
  this.shopLaser.setScale(laserScale * 0.8);

    const coworkerScale = Phaser.Math.Clamp(
    height * 0.0011,
    0.6,
    0.7
  );

  this.coworker = this.add.image(
    width / 2,
    height / 2,
    "customer"
  )
    .setScale(coworkerScale)
    .setDepth(-11);

    this.dialogueIndex = 0;
    this.cuts = [];
    this.targetCM = 30;
    this.totalFish = 1;
    this.currentFish = 0;

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 2;

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
        backgroundColor: "#000000e1",
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

  this.cuttingView = this.add.image(
    width / 2,
    height / 2,
    "cuttingview"
  )
    .setDepth(100);

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
      alpha: 1,
      duration: 100,
      ease: "Power2"
    });
  });

  this.cutButton.on("pointerout", () => {
    this.tweens.add({
      targets: this.cutButton,
      scale: 0.22,
      alpha: 1,
      duration: 100,
      ease: "Power2"
    });
  });


  this.cutButton.on("pointerdown", () => {
    if (!this.canStopLine) return;
    this.sound.play("laser");
    this.tweens.add({
      targets: this.cutButton,
      scale: 0.22,
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
    "Die Auswertung hat ergeben, dass die Giftstoffe sich vom Kopf aus auf 30% verbreitet hat.\nSchneide doch diese 30% ab. Dazu kannst du einfach auf den roten Knopf drücken, wenn die Linie dort ist.",
    {
      fontSize: "28px",
      fontFamily: "Roboto",
      color: "#ffffff",
      backgroundColor: "#000000dc",
      padding: { x: 40, y: 25 },
      align: "center",
      wordWrap: { width: width * 0.6 }
    }
  )
    .setOrigin(0.5)
    .setDepth(150)
    .setAlpha(1);


  // INFO TEXT FADE OUT
  this.time.delayedCall(3000, () => {
    if (!this.infoText) return;

    this.tweens.add({
      targets: this.infoText,
      alpha: 0,
      duration: 500
    });
  });

  this.spawnFish();

  this.time.delayedCall(150, () => {
    this.enableLineClick();
  });
}

  spawnFish() {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.fish = this.add.image(
      width / 1.6,
      height / 3,
      "fish"
    ).setDepth(102);

    this.createMovingCutLine();
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
    this.cutButton.setInteractive({ useHandCursor: true });
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

    const bounds = this.fish.getBounds();

    const localX = Phaser.Math.Clamp(
      this.cutLine.x - bounds.left,
      0,
      this.fish.displayWidth
    );

    const percent = Math.round(
      (localX / this.fish.displayWidth) * 100
    );

    this.cuts.push(percent);

    this.cutLine.destroy();
    this.cutLine = null;

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

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

    let feedbackColor = "#ff4444";
    if (diff <= 2) {
      feedbackColor = "#2ecc71";
    }

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

    this.time.delayedCall(500, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      percentText.destroy();

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
      backgroundColor: "#000000dc",
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

      this.time.delayedCall(500, () => {

        this.cameras.main.fade(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
          this.scene.start("Shop");
        });

      });

    }
  });

}
}
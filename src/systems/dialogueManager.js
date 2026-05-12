export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;

    this.dialogueText = null;
    this.dialogueBg = null;
    this.glitchEvent = null;

    this.dialogues = [];
    this.currentIndex = 0;
    this.onComplete = null;
    this.keepOpen = false;
    this.canClickNext = false;
  }

  startDialogue(dialogues, onComplete = null, keepOpen = false) {
    this.clearDialogue();

    this.dialogues = dialogues || [];
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.keepOpen = keepOpen;
    this.canClickNext = false;

    const { width, height } = this.scene.scale;

    const isParasite =
      this.dialogues[0] &&
      this.dialogues[0].text &&
      this.dialogues[0].text.includes("Mona:");

    const boxX = width * 0.07;
    const boxY = height * 0.18;
    const boxW = width * 0.32;
    const boxH = height * 0.3;

    this.dialogueBg = this.scene.add.rectangle(
      boxX,
      boxY,
      boxW,
      boxH,
      0x000000,
      0.78
    )
      .setOrigin(0, 0)
      .setDepth(501);

    this.dialogueText = this.scene.add.text(
      boxX + width * 0.025,
      boxY + height * 0.04,
      "",
      {
        fontSize: "25px",
        fontFamily: "Roboto",
        color: isParasite ? "#ff4444" : "#ffffff",
        align: "left",
        wordWrap: { width: boxW - width * 0.05 },
        stroke: isParasite ? "#550000" : "#000000",
        strokeThickness: isParasite ? 3 : 0
      }
    )
      .setOrigin(0, 0)
      .setDepth(502);

    if (isParasite) {
      this.startTextGlitch();
    }

    this.showCurrentDialogue();

    this.scene.time.delayedCall(150, () => {
      this.canClickNext = true;

      this.scene.input.on(
        "pointerdown",
        this.nextDialogue,
        this
      );
    });
  }

  startTextGlitch() {
    const originalX = this.dialogueText.x;
    const originalY = this.dialogueText.y;

    this.glitchEvent = this.scene.time.addEvent({
      delay: 45,
      loop: true,
      callback: () => {
        if (!this.dialogueText) return;

        this.dialogueText.setPosition(
          originalX + Phaser.Math.Between(-2, 2),
          originalY + Phaser.Math.Between(-1, 1)
        );

        this.dialogueText.setColor(
          Phaser.Math.Between(0, 10) > 7
            ? "#ff8888"
            : "#ff4444"
        );
      }
    });

    this.scene.tweens.add({
      targets: this.dialogueText,
      alpha: 0.8,
      duration: 80,
      yoyo: true,
      repeat: -1
    });
  }

  showCurrentDialogue() {
    if (!this.dialogueText) return;
    if (!this.dialogues[this.currentIndex]) return;

    this.dialogueText.setText(
      this.dialogues[this.currentIndex].text
    );

    this.currentIndex++;
  }

  nextDialogue() {
    if (!this.dialogueText) return;
    if (!this.canClickNext) return;

    if (this.currentIndex < this.dialogues.length) {
      this.showCurrentDialogue();
      return;
    }

    this.scene.input.off(
      "pointerdown",
      this.nextDialogue,
      this
    );

    if (!this.keepOpen) {
      this.clearDialogue();
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }

  clearDialogue() {
    if (this.glitchEvent) {
      this.glitchEvent.destroy();
      this.glitchEvent = null;
    }

    if (this.dialogueText) {
      this.scene.tweens.killTweensOf(this.dialogueText);
      this.dialogueText.destroy();
    }

    if (this.dialogueBg) {
      this.dialogueBg.destroy();
    }

    this.scene.input.off(
      "pointerdown",
      this.nextDialogue,
      this
    );

    this.dialogueText = null;
    this.dialogueBg = null;
    this.keepOpen = false;
    this.canClickNext = false;
  }
}
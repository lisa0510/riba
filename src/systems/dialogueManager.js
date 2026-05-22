export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;

    this.dialogueText = null;
    this.dialogueBg = null;
    this.currentVoice = null;

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

    const isMona =
      this.dialogues[0] &&
      this.dialogues[0].text &&
      this.dialogues[0].text.includes("Mona:");

    const boxX = width * 0.08;
    const boxY = height * 0.17;
    const boxW = width * 0.24;
    const boxH = height * 0.42;

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
        color: isMona ? "#ff4444" : "#ffffff",
        align: "left",
        wordWrap: { width: boxW - width * 0.05 },
        stroke: isMona ? "#550000" : "#000000",
        strokeThickness: isMona ? 3 : 0
      }
    )
      .setOrigin(0, 0)
      .setDepth(502);

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

  showCurrentDialogue() {
    if (!this.dialogueText) return;
    if (!this.dialogues[this.currentIndex]) return;

    const currentDialogue = this.dialogues[this.currentIndex];

    this.dialogueText.setText(currentDialogue.text);

    if (currentDialogue.voice) {
      if (this.currentVoice) {
        this.currentVoice.stop();
        this.currentVoice.destroy();
        this.currentVoice = null;
      }

      this.currentVoice = this.scene.sound.add(currentDialogue.voice, {
        volume: 1
      });

      this.currentVoice.play();
    }

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
    if (this.currentVoice) {
      this.currentVoice.stop();
      this.currentVoice.destroy();
      this.currentVoice = null;
    }

    if (this.dialogueText) {
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
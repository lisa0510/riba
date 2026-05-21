export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;

    this.dialogueText = null;
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


    this.dialogueText = this.scene.add.text(
      width * 0.08,
      height * 0.28,
      "",
      {
        fontSize: "25px",
        fontFamily: "Roboto",
        color: isParasite ? "#ff4444" : "#ffffff",
        padding: { x: 40, y: 25 },
        align: "left",
        wordWrap: { width: width * 0.2 },
        backgroundColor: "#000000c9",
        stroke: isParasite ? "#550000" : "#000000",
        strokeThickness: isParasite ? 3 : 0
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
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

    this.dialogues = dialogues;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.keepOpen = keepOpen;
    this.canClickNext = false;

    const { width, height } = this.scene.scale;

    this.dialogueText = this.scene.add.text(
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
      .setDepth(501);

    this.nextDialogue();

    this.scene.time.delayedCall(150, () => {
      this.canClickNext = true;

      this.scene.input.on(
        "pointerdown",
        this.nextDialogue,
        this
      );
    });
  }

  nextDialogue() {
    if (!this.dialogueText) return;

    if (this.currentIndex < this.dialogues.length) {
      this.dialogueText.setText(
        this.dialogues[this.currentIndex].text
      );

      this.currentIndex++;
      return;
    }

    if (!this.canClickNext) return;

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

    this.scene.input.off(
      "pointerdown",
      this.nextDialogue,
      this
    );

    this.dialogueText = null;
    this.keepOpen = false;
    this.canClickNext = false;
  }
}
export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;

    this.dialogueText = null;
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
    const boxY = height * 0.4;

    this.dialogueText = this.scene.add.text(
      boxX,
      boxY,
      "",
      {
        fontSize: "25px",
        fontFamily: "Roboto",
        color: isMona ? "#ff4444" : "#ffffff",
        backgroundColor: "#000000cc",
        padding: {
          x: 25,
          y: 18
        },
        align: "left",
        wordWrap: {
          width: width * 0.22
        },
        stroke: isMona ? "#550000" : "#000000",
        strokeThickness: isMona ? 3 : 0
      }
    )
      .setOrigin(0, 0.5) //.setOrigin(0, 0.5) // x/y ist links mittig
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
        volume: 2
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
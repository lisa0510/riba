// Verwaltet sämtliche Dialoge im Spiel.
// Zuständig für Textanzeige, Sprachwiedergabe und den Wechsel zwischen Dialogzeilen.
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

  // Startet einen neuen Dialogverlauf.
  // Optional kann nach Abschluss eine Callback-Funktion ausgeführt werden.
  startDialogue(dialogues, onComplete = null, keepOpen = false) {
    this.clearDialogue();

    this.dialogues = dialogues || [];
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.keepOpen = keepOpen;
    this.canClickNext = false;

    const { width, height } = this.scene.scale;

    // Prüft, ob es sich um einen inneren Gedanken / Parasiten-Dialog handelt.
    // Diese werden visuell anders dargestellt.
    const isMona =
      this.dialogues[0] &&
      this.dialogues[0].text &&
      this.dialogues[0].text.includes("???:");

    const boxX = width * 0.08;
    const boxY = height * 0.45;

    // Erstellt das Textfeld für die Dialoganzeige.
    this.dialogueText = this.scene.add.text(
      boxX,
      boxY,
      "",
      {
        fontSize: "25px",
        fontFamily: "Domine",
        color: isMona ? "#f17d32" : "#ffffff",
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
        strokeThickness: isMona ? 2 : 0
      }
    )
      .setOrigin(0, 0.5)
      .setDepth(502);

    this.showCurrentDialogue();

    // Kurze Verzögerung verhindert versehentliche Doppelklicks beim Start eines neuen Dialogs.
    this.scene.time.delayedCall(150, () => {
      this.canClickNext = true;

      this.scene.input.on(
        "pointerdown",
        this.nextDialogue,
        this
      );
    });
  }

  // Zeigt die aktuelle Dialogzeile an und spielt falls vorhanden die passende Sprachaufnahme ab.
  showCurrentDialogue() {
    if (!this.dialogueText) return;
    if (!this.dialogues[this.currentIndex]) return;

    const currentDialogue = this.dialogues[this.currentIndex];

    this.dialogueText.setText(currentDialogue.text);

    if (currentDialogue.voice) {

      // Vorherige Sprachaufnahme stoppen, damit nie mehrere Stimmen gleichzeitig abgespielt werden.
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

  // Wechselt zur nächsten Dialogzeile.
  // Ist keine weitere Zeile vorhanden,wird der Dialog beendet.
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

    // Dialogfenster nur schliessen,
    // wenn keepOpen nicht aktiviert wurde.
    if (!this.keepOpen) {
      this.clearDialogue();
    }

    // Führt nach Abschluss des Dialogs die übergebene Callback-Funktion aus.
    if (this.onComplete) {
      this.onComplete();
    }
  }

  // Entfernt Dialogtext und laufende Sprachaufnahmen.
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
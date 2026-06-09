// Verwaltet den Wechsel zwischen den verschiedenen Fischboxen.
// Eine Box besteht aus Fischen, Dialogen und eigenen Zielwerten.
export default class BoxManager {
  constructor(scene) {
    this.scene = scene;
  }

  // Initialisiert eine neue Box und setzt
  // alle relevanten Werte für den neuen Abschnitt zurück.
  startBox(boxId, boxData) {

    // Speichert die aktuell aktive Box.
    this.scene.currentBoxId = boxId;
    this.scene.currentBox = boxData;

    // Setzt Fortschritt und Schnittergebnisse zurück.
    this.scene.currentFish = 0;
    this.scene.cutResults = [];

    // Startet den Einführungsdialog der Box.
    // Nach Abschluss wird die Interaktion mit Klara freigeschaltet.
    this.scene.dialogueManager.startDialogue(
      boxData.introDialogue,
      () => {
        this.scene.enableCoworkerInteraction();
      }
    );
  }
}
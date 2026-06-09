// Zentrale Klasse für alle spielrelevanten Zustände.
// Hier werden Schnittergebnisse, Entscheidungen und Ending-Informationen gespeichert.
class GameState {
  constructor() {
    this.reset();
  }

  // Setzt alle Werte für einen neuen Spieldurchlauf zurück.
  reset() {
    this.targetCut = 30;

    // Toleranzbereich oberhalb des Zielwerts.
    // Beispiel: Zielwert 30 + Toleranz 5 = 30–35 ist korrekt.
    this.cutThreshold = 5;

    // Zielwerte der beiden Fischboxen.
    this.boxTargets = {
      box1: 30,
      box2: 70,
    };

    // Speichert alle Schnittergebnisse pro Box.
    this.boxResults = {
      box1: [],
      box2: [],
    };

    // Speichert Entscheidungen aus Fischdialogen.
    this.fishChoices = {
      box1: [],
      box2: [],
    };

    // Speichert Entscheidungen aus Parasiten-/Gedankendialogen.
    this.parasiteChoices = {
      box1: [],
      box2: [],
    };

    // Speichert, ob ein Parasitenereignis ausgelöst wurde.
    this.parasiteInteractions = {
      box1: false,
      box2: false,
    };
  }

  // Speichert einen Schnittwert in der entsprechenden Box.
  saveCut(box, percent) {
    this.boxResults[box].push(percent);
  }

  // Speichert eine Dialogentscheidung des Spielers.
  saveFishChoice(box, choiceId) {
    this.fishChoices[box].push(choiceId);
  }

  // Speichert eine Entscheidung während eines Parasitenereignisses.
  saveParasiteChoice(box, choiceId) {
    this.parasiteChoices[box].push(choiceId);
  }

  // Speichert, ob ein Parasit aufgetreten ist.
  setParasiteInteraction(box, interacted) {
    this.parasiteInteractions[box] = interacted;
  }

  // Gibt den Zielwert der jeweiligen Fischbox zurück.
  getTargetForBox(box) {
    return this.boxTargets[box] || this.targetCut;
  }

  // Prüft, ob ein einzelner Schnitt innerhalb des erlaubten Zielbereichs liegt.
  isPerfectCut(cut, target = this.targetCut) {
    return cut >= target && cut <= target + this.cutThreshold;
  }

  // Prüft, ob alle Schnitte einer Box korrekt ausgeführt wurden.
  isPerfectBox(box) {
    const results = this.boxResults[box];
    const target = this.getTargetForBox(box);

    if (!results.length) return false;

    return results.every((cut) => this.isPerfectCut(cut, target));
  }

  // Gibt alle Schnittergebnisse beider Boxen zurück.
  getAllCuts() {
    return [...this.boxResults.box1, ...this.boxResults.box2];
  }

  // Prüft, ob der gesamte Spieldurchlauf perfekt war.
  hasPerfectRun() {
    const box1Perfect = this.isPerfectBox("box1");
    const box2Perfect = this.isPerfectBox("box2");

    return box1Perfect && box2Perfect;
  }

  // Berechnet den prozentualen Anteil korrekter Schnitte.
  getRightCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const box1Right = this.boxResults.box1.filter((cut) =>
      this.isPerfectCut(cut, this.boxTargets.box1),
    ).length;

    const box2Right = this.boxResults.box2.filter((cut) =>
      this.isPerfectCut(cut, this.boxTargets.box2),
    ).length;

    return ((box1Right + box2Right) / allCuts.length) * 100;
  }

  // Berechnet den Anteil fehlerhafter Schnitte.
  getWrongCutPercentage() {
    return 100 - this.getRightCutPercentage();
  }

  // Zählt die Anzahl fehlerhafter Schnitte.
  getWrongCutCount() {
    const box1Wrong = this.boxResults.box1.filter(
      (cut) => !this.isPerfectCut(cut, this.boxTargets.box1),
    ).length;

    const box2Wrong = this.boxResults.box2.filter(
      (cut) => !this.isPerfectCut(cut, this.boxTargets.box2),
    ).length;

    return box1Wrong + box2Wrong;
  }

  // Gibt sämtliche Entscheidungen des Spielers zurück.
  getAllChoices() {
    return [
      ...this.fishChoices.box1,
      ...this.fishChoices.box2,
      ...this.parasiteChoices.box1,
      ...this.parasiteChoices.box2,
    ];
  }

  // Berechnet, wie häufig negative Antworten gewählt wurden.
  getNegativeSelfTalkPercentage() {
    const allChoices = this.getAllChoices();

    if (!allChoices.length) return 0;

    const negativeChoices = ["negative1", "negative2"];

    const negativeCount = allChoices.filter((choiceId) =>
      negativeChoices.includes(choiceId),
    ).length;

    return (negativeCount / allChoices.length) * 100;
  }

  // Zentrale Ending-Logik.
  // Hier wird anhand von Schnitten und Entscheidungen bestimmt, welches Ende erreicht wird.
  getEnding() {
    const wrongCuts = this.getWrongCutCount();

    const box1WrongCuts = this.boxResults.box1.filter(
      (cut) => !this.isPerfectCut(cut, this.boxTargets.box1),
    ).length;

    const box2WrongCuts = this.boxResults.box2.filter(
      (cut) => !this.isPerfectCut(cut, this.boxTargets.box2),
    ).length;

    const negativePercent = this.getNegativeSelfTalkPercentage();
    const agreedWithBadThoughts = negativePercent >= 50;

    const box1Bad = box1WrongCuts >= 2;
    const box2Bad = box2WrongCuts >= 2;

    // Perfektes Ende ohne Fehler.
    if (wrongCuts === 0) {
      return "endingPerfect";
    }

    // Ending 4: Spieler stimmt den negativen Gedanken zu.
    if (agreedWithBadThoughts) {
      return "ending4";
    }

    // Ending 1: Beide Fischboxen schlecht abgeschlossen.
    if (box1Bad && box2Bad && !agreedWithBadThoughts) {
      return "ending1";
    }

    // Ending 2: Spieler schneidet gut Box1 und stimmt den negativen Gedanken nicht zu.
    if (!box1Bad && !agreedWithBadThoughts) {
      return "ending2";
    }

    // Standard-Ende für alle übrigen Kombinationen. z.b Box 1 schlecht, aber Box 2 nicht schlecht + disagreed
    return "ending3";
  }

  // Gibt wichtige Statistiken für Endings oder Debugging zurück.
  getEndingStats() {
    return {
      rightPercent: this.getRightCutPercentage(),
      wrongPercent: this.getWrongCutPercentage(),
      negativePercent: this.getNegativeSelfTalkPercentage(),
      ending: this.getEnding(),
    };
  }
}

// Erstellt eine globale Instanz, auf die alle Szenen zugreifen können.
const gameState = new GameState();

export default gameState;

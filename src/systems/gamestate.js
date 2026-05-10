class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.targetCut = 30;

    this.boxResults = {
      box1: [],
      box2: []
    };

    this.fishChoices = {
      box1: [],
      box2: []
    };

    this.parasiteChoices = {
      box1: [],
      box2: []
    };

    this.parasiteInteractions = {
      box1: false,
      box2: false
    };
  }

  saveCut(box, percent) {
    this.boxResults[box].push(percent);
  }

  saveFishChoice(box, choiceId) {
    this.fishChoices[box].push(choiceId);
  }

  saveParasiteChoice(box, choiceId) {
    this.parasiteChoices[box].push(choiceId);
  }

  setParasiteInteraction(box, interacted) {
    this.parasiteInteractions[box] = interacted;
  }

  isPerfectCut(cut) {
    return cut >= this.targetCut - 10 && cut <= this.targetCut + 10;
  }

  isPerfectBox(box) {
    const results = this.boxResults[box];

    if (!results.length) return false;

    return results.every((cut) => this.isPerfectCut(cut));
  }

  getAllCuts() {
    return [
      ...this.boxResults.box1,
      ...this.boxResults.box2
    ];
  }

  hasPerfectRun() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return false;

    return allCuts.every((cut) => this.isPerfectCut(cut));
  }

  getRightCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const rightCuts = allCuts.filter((cut) =>
      this.isPerfectCut(cut)
    ).length;

    return (rightCuts / allCuts.length) * 100;
  }

  getWrongCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const wrongCuts = allCuts.filter((cut) =>
      !this.isPerfectCut(cut)
    ).length;

    return (wrongCuts / allCuts.length) * 100;
  }

  getWrongCutCount() {
  const allCuts = this.getAllCuts();

  return allCuts.filter((cut) =>
    !this.isPerfectCut(cut)
  ).length;
}

  getAllChoices() {
    return [
      ...this.fishChoices.box1,
      ...this.fishChoices.box2,
      ...this.parasiteChoices.box1,
      ...this.parasiteChoices.box2
    ];
  }

  getNegativeSelfTalkPercentage() {
    const allChoices = this.getAllChoices();

    if (!allChoices.length) return 0;

    const negativeChoices = [
      "negative1",
      "negative2",
    ];

    const negativeCount = allChoices.filter((choiceId) =>
      negativeChoices.includes(choiceId)
    ).length;

    return (negativeCount / allChoices.length) * 100;
  }

 getEnding() {
  const allCuts = this.getAllCuts();

  const wrongCuts = allCuts.filter(
    (cut) => !this.isPerfectCut(cut)
  ).length;

  const negativePercent =
    this.getNegativeSelfTalkPercentage();

  const agreedWithBadThoughts =
    negativePercent >= 50;

  // SECRET PERFECT ENDING
  if (wrongCuts === 0) {
    return "endingPerfect";
  }

  // FIRST BOX PERFORMANCE
  const box1WrongCuts =
    this.boxResults.box1.filter(
      (cut) => !this.isPerfectCut(cut)
    ).length;

  const firstBoxGood =
    box1WrongCuts <= 1;

  // MANY mistakes + AGREED
  if (agreedWithBadThoughts) {
    return "ending4";
  }

  // MANY mistakes + DISAGREED
  if (wrongCuts >= 4) {
    return "ending1";
  }

  // GOOD first box + DISAGREED
  if (firstBoxGood) {
    return "ending2";
  }

  // BAD first box + DISAGREED
  return "ending3";
}


  getEndingStats() {
    return {
      rightPercent: this.getRightCutPercentage(),
      wrongPercent: this.getWrongCutPercentage(),
      negativePercent: this.getNegativeSelfTalkPercentage(),
      ending: this.getEnding()
    };
  }
}

const gameState = new GameState();

export default gameState;
class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.targetCut = 30;

    // tolerance ONLY above the target
    // example: target 30 + threshold 5 = 30-35 OK, 29 FAIL
    this.cutThreshold = 5;

    this.boxTargets = {
      box1: 30,
      box2: 70
    };

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

  getTargetForBox(box) {
    return this.boxTargets[box] || this.targetCut;
  }

  isPerfectCut(cut, target = this.targetCut) {
    return (
      cut >= target &&
      cut <= target + this.cutThreshold
    );
  }

  isPerfectBox(box) {
    const results = this.boxResults[box];
    const target = this.getTargetForBox(box);

    if (!results.length) return false;

    return results.every((cut) =>
      this.isPerfectCut(cut, target)
    );
  }

  getAllCuts() {
    return [
      ...this.boxResults.box1,
      ...this.boxResults.box2
    ];
  }

  hasPerfectRun() {
    const box1Perfect = this.isPerfectBox("box1");
    const box2Perfect = this.isPerfectBox("box2");

    return box1Perfect && box2Perfect;
  }

  getRightCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const box1Right = this.boxResults.box1.filter((cut) =>
      this.isPerfectCut(cut, this.boxTargets.box1)
    ).length;

    const box2Right = this.boxResults.box2.filter((cut) =>
      this.isPerfectCut(cut, this.boxTargets.box2)
    ).length;

    return ((box1Right + box2Right) / allCuts.length) * 100;
  }

  getWrongCutPercentage() {
    return 100 - this.getRightCutPercentage();
  }

  getWrongCutCount() {
    const box1Wrong = this.boxResults.box1.filter((cut) =>
      !this.isPerfectCut(cut, this.boxTargets.box1)
    ).length;

    const box2Wrong = this.boxResults.box2.filter((cut) =>
      !this.isPerfectCut(cut, this.boxTargets.box2)
    ).length;

    return box1Wrong + box2Wrong;
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
      "negative2"
    ];

    const negativeCount = allChoices.filter((choiceId) =>
      negativeChoices.includes(choiceId)
    ).length;

    return (negativeCount / allChoices.length) * 100;
  }

  getEnding() {
    const wrongCuts = this.getWrongCutCount();

    const box1WrongCuts = this.boxResults.box1.filter((cut) =>
      !this.isPerfectCut(cut, this.boxTargets.box1)
    ).length;

    const box2WrongCuts = this.boxResults.box2.filter((cut) =>
      !this.isPerfectCut(cut, this.boxTargets.box2)
    ).length;

    const negativePercent = this.getNegativeSelfTalkPercentage();
    const agreedWithBadThoughts = negativePercent >= 50;

    const box1Bad = box1WrongCuts >= 2;
    const box2Bad = box2WrongCuts >= 2;

    if (wrongCuts === 0) {
      return "endingPerfect";
    }

    if (agreedWithBadThoughts) {
      return "ending4";
    }

    if (box1Bad && box2Bad && !agreedWithBadThoughts) {
      return "ending1";
    }

    if (!box1Bad && !agreedWithBadThoughts) {
      return "ending2";
    }

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
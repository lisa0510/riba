class GameState {
  constructor() {
    this.reset();
  }

  reset() {
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

  getTargetCut(box) {
    return this.boxTargets[box] || 30;
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

  isPerfectCut(cut, box) {
    const target = this.getTargetCut(box);

    return (
      cut >= target - 1 &&
      cut <= target + 1
    );
  }

  isPerfectBox(box) {
    const results = this.boxResults[box];

    if (!results.length) return false;

    return results.every((cut) =>
      this.isPerfectCut(cut, box)
    );
  }

  getAllCuts() {
    return [
      ...this.boxResults.box1.map((cut) => ({
        cut,
        box: "box1"
      })),

      ...this.boxResults.box2.map((cut) => ({
        cut,
        box: "box2"
      }))
    ];
  }

  hasPerfectRun() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return false;

    return allCuts.every(({ cut, box }) =>
      this.isPerfectCut(cut, box)
    );
  }

  getRightCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const rightCuts = allCuts.filter(
      ({ cut, box }) =>
        this.isPerfectCut(cut, box)
    ).length;

    return (rightCuts / allCuts.length) * 100;
  }

  getWrongCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const wrongCuts = allCuts.filter(
      ({ cut, box }) =>
        !this.isPerfectCut(cut, box)
    ).length;

    return (wrongCuts / allCuts.length) * 100;
  }

  getWrongCutCount() {
    const allCuts = this.getAllCuts();

    return allCuts.filter(
      ({ cut, box }) =>
        !this.isPerfectCut(cut, box)
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

    const negativeCount = allChoices.filter(
      (choiceId) =>
        negativeChoices.includes(choiceId)
    ).length;

    return (
      (negativeCount / allChoices.length) * 100
    );
  }

  getEnding() {
    const allCuts = this.getAllCuts();

    const wrongCuts = allCuts.filter(
      ({ cut, box }) =>
        !this.isPerfectCut(cut, box)
    ).length;

    const box1WrongCuts =
      this.boxResults.box1.filter(
        (cut) =>
          !this.isPerfectCut(cut, "box1")
      ).length;

    const box2WrongCuts =
      this.boxResults.box2.filter(
        (cut) =>
          !this.isPerfectCut(cut, "box2")
      ).length;

    const negativePercent =
      this.getNegativeSelfTalkPercentage();

    const agreedWithBadThoughts =
      negativePercent >= 50;

    const box1Bad = box1WrongCuts >= 2;
    const box2Bad = box2WrongCuts >= 2;

    // Secret perfect ending
    if (wrongCuts === 0) {
      return "endingPerfect";
    }

    // Ending 4
    if (agreedWithBadThoughts) {
      return "ending4";
    }

    // Ending 1
    if (
      box1Bad &&
      box2Bad &&
      !agreedWithBadThoughts
    ) {
      return "ending1";
    }

    // Ending 2
    if (
      !box1Bad &&
      !agreedWithBadThoughts
    ) {
      return "ending2";
    }

    // Ending 3
    return "ending3";
  }

  getEndingStats() {
    return {
      rightPercent:
        this.getRightCutPercentage(),

      wrongPercent:
        this.getWrongCutPercentage(),

      negativePercent:
        this.getNegativeSelfTalkPercentage(),

      ending: this.getEnding()
    };
  }
}

const gameState = new GameState();

export default gameState;
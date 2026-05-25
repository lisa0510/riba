export const box2Data = {
  
targetPercent: 70,
fishTexture: "fish2",
noteTexture: "note2",

  introDialogue: [
    {
      text: "Klara: Bin wieder da! \n\nLukas hat die Fische der zweiten Box nun auch auf ihre toxische Ausbreitung untersuchen können.",
      voice: "binwiederda"
    }
  ],

  successDialogue: [
    {
      text: "Klara: Perfekt, mit so viel Fisch, können wir uns wieder erstmals ein paar Tage Ruhe gönnen. Du weisst nicht wie sehr ich mich darauf freue einen Tag lang nicht in der Säure schwimmen zu müssen.",
      voice: "box2keinfehler"
    },
  ],

  
  failureDialogue: [
  {
    text: "Klara: Vielen Dank!\n\nDas ist doch wieder eine gute Menge. Wenn uns bald die letzten Dosen ausgehen und wir uns komplett von Fisch ernähren müssen, werden wir alle noch dankbarer für deine tägliche Arbeit sein.",
    voice: "box2failedresponse"
  }
],
  parasiteDialogue: [
     {
      text: "Mona: Nur so wenige sind essbar? \nBald gehen uns die letzten Dosen aus und dann müssen wir uns komplett von saurem Fisch ernähren. Was machen wir dann wenn du genauso wenig leistest?",
      voice: "box2glitchmona",
      choices: [
        {
          id: "disagree2",
          text: "Klara redet so nicht",
          nextText: "Mona: Du schreist ja auch nicht jeden Gedanken den du hast in die Welt hinaus. Vertrau mir, dieser Gedanke ist noch der mildeste den ich über dich äussern kann.",
          voice: "box2disagree"
        },
        {
          id: "negative2",
          text: "Was soll ich denn machen?",
          nextText: "Mona: Mühe! Meinst du ich bin froh täglich in der Säure schwimmen zu müssen? Trotz allem gebe ich mein bestes, aber das ist dir wohl ein Fremdwort.",
          voice: "box2monaagree"
        }
      ],
      ignoreDialogue: [
        {
          text: "Mona: Mich zu ignorieren löst nicht deine Probleme!",
          voice: "box2ignore"
        }
      ]
    }
  ],

preEndingDialogue: {
  ending1: [
    {
      text: "Klara: So, dass waren alle für heute! \nBeeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig Bock auf unsere Kaffeepause.",
      voice: "endingklaraoverall"
    },
    {
      text: "Klara: ..Hey ist alles okay?\n\nDu siehst so bleich aus, du solltest dich für heute ausruhen.",
      voice: "ending1hey"
    },
    {
      text: "Klara: Ich weiss, nicht viele deiner Fische konnten wir für den Verzehr behalten, aber mach dir nichts draus.  Dann muss ich halt wieder früher in die Säure, das gehört nun mal zu unserem jetzigen Leben.",
      voice: "ending1verzehr"
    }
  ],

  ending2: [
    {
      text: "Klara: So, dass waren alle für heute! \nBeeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig Bock auf unsere Kaffeepause.",
      voice: "endingklaraoverall"
    },
    {
      text: "Klara: Unglaublich, wie viele geniessbare Fische du retten konntest! Die anderen werden heute endlich mal satt.",
      voice: "ending2satt"
    }
  ],

    ending3: [
    {
      text: "Klara: So, dass waren alle für heute! \nBeeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig Bock auf unsere Kaffeepause.",
      voice: "endingklaraoverall"
    },
    {
      text: "Klara: Unglaublich, du hast so viele Fische für uns als Nahrung behalten können! Die anderen werden sich freuen.",
      voice: "ending3unglaublich"
    },
      {
      text: "Klara: So können wir die Zeit auch nutzen uns einfach mal wieder auf uns zu konzentrieren.",
      voice: "ending3Zeit"
    }
  ],

  ending4: [
    {
      text: "Klara: So, dass waren alle für heute! \nBeeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig Bock auf unsere Kaffeepause.",
      voice: "endingklaraoverall"
    },
    {
      text: "Mona: Nicht nur der Anzug erdrückt mich, auch deine Präsenz tut es.",
      voice: "ending4mona"
    },
      {
      text: "Klara: Huh?\n\nWieso schaust du plötzlich so traurig?",
      voice: "ending4huh",
      choices: [
        {
          id: "ending4cut",
          text: "Kann ich dir beim ausziehen helfen?",
          nextText: "Klara: Hahaha, okay? Also sehr gerne. Das Ausziehen ist fast noch schlimmer als das Anziehen. Du hast mir noch nie deine Hilfe angeboten, das hat mich nur kurz überrascht...",
          voice: "ending4haha",
        }
      ]
    }
  ],

  endingPerfect: [
    {
      text: "Klara: So, dass waren alle für heute! \nBeeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig Bock auf unsere Kaffeepause.",
      voice: "ending5unglaublich"
    },
    {
      text: "Klara: Es ist fast schon unheimlich, dass du keinen einzigen Fehler gemacht hast...",
      voice: "ending5unheimlich"
    }
  ],

},

};
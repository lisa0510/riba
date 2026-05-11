export const box2Data = {
  introDialogue: [
    {
      text: "Klara: Bin wieder da! Lukas hat die Fische der zweiten Box nun auch auf ihre toxische Ausbreitung untersuchen können."
    }
  ],

  successDialogue: [
    {
      text: "Klara: Perfekt, mit so viel Fisch, können wir uns wieder erstmals ein paar Tage ruhe gönnen. Du weisst nicht wie sehr ich mich darauf freue einen Tag lang nicht in der Säure schwimmen zu müssen."
    },
  ],

  parasiteDialogue: [
    {
      text: "Klara: Vielen Dank, dass ist doch wieder eine gute Menge. Wenn uns bald auch die letzten Dosen aus gehen und wir uns komplett von Fisch ernähren. Sind wir alle noch froher um deine tägliche Leistung."
    },
    {
      text: "Mona: Nur so wenige sind essbar? Bald gehen uns die letzten Dosen aus und dann müssen wir uns komplett von saurem Fisch ernähren. Was machen wir dann wenn du genauso wenig leistest?",
      choices: [
        {
          id: "disagree2",
          text: "Klara redet so nicht",
          nextText: "Mona: Du schreist ja auch nicht jeden Gedanken den du hast in die Welt hinaus. Vertrau mir, dieser Gedanke ist noch der mildeste den ich über dich äussern kann."
        },
        {
          id: "negative2",
          text: "Was soll ich denn machen?",
          nextText: "Mona: Mühe! Meinst du ich bin froh täglich in der Säure schwimmen zu müssen? Trotz allem gebe ich mein bestes, aber das ist dir wohl ein Fremdwort."
        }
      ],
      ignoreDialogue: [
        {
          text: "Mona: Mich zu ignorieren löst nicht deine Probleme!"
        }
      ]
    }
  ],

preEndingDialogue: {
  ending1: [
    { text: "Klara: So, dass waren alle für heute. Beeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig bock auf unsere Kaffee Pause." },
    { text: "Endign 1 text hier..." }
  ],

  ending2: [
    { text: "Klara: So, dass waren alle für heute. Beeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig bock auf unsere Kaffee Pause." },
    { text: "2" }
  ],

  ending3: [
    { text: "Klara: So, dass waren alle für heute. Beeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig bock auf unsere Kaffee Pause." },
    { text: "3." }
  ],

  ending4: [
    { text: "Klara: So, dass waren alle für heute. Beeil dich mit dem Aufräumen, während ich mich hier aus diesem Anzug zwänge, ich hab jetzt richtig bock auf unsere Kaffee Pause." },
    { text: "4." }
  ],

  endingPerfect: [
    { text: "Klara: Unglaublich, du hast so alle Fische für uns als Nahrung behalten können! Die anderen werden sich freuen." }
  ]
},

finalDialogues: {
  ending1: [
    { text: "Hey ist alles okay? Du siehst so bleich aus, du solltest dich für heute ausruhen." },
    { text: "Ich weiss, nicht viele deiner Fische konnten wir für den Verzehr behalten, aber mach dir nichts draus. Dann muss ich halt wieder früher in die Säure, das gehört nun mal zu unserem jetzigen Leben." }
  ],

  ending2: [
    { text: "Unglaublich, du hast so viele Fische für uns als Nahrung behalten können! Team MoKla hat es wieder super hinbekommen!" },
    { text: "Keine Sorge, ich erwarte nicht, dass dies jetzt zur Normalität wird haha." }
  ],

  ending3: [
    { text: "Von all den Menschen, die es geschafft haben, sich unter Wasser zu retten, musste ich mit der unnützen Person in ein Team gesteckt werden." }
  ],

  ending4: [
    { text: "4" },
    { text: "4." }
  ],

  endingPerfect: [
    { text: "Klara: Unglaublich, du hast so alle Fische für uns als Nahrung behalten können! Die anderen werden sich freuen." },
    { text: "Klara: So können wir die Zeit auch nutzen uns einfach mal wieder auf uns zu konzentrieren." }
  ]
}
};
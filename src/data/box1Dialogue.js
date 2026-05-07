export const box1Data = {
  introDialogue: [
      {text: "Assistent: Da bin ich wieder. Heute Morgen konnten wir genug Fisch fangen, um zwei Boxen zu füllen. Hier ist die erste Box.",},
      { text:"Assistent: Hoffen wir, dass unsere Arbeit genauso gut wird, wie gestern. Sonst muss ich früher, als mir geheuer ist wieder in der Säure schwimmen gehen."}
    
  ],

  successDialogue: [
    { text: "Klara: Ey, die Fische sehen super aus! Wenn das so weiter geht, haben wir genug Rationen für drei Tage." },
    { text: "Klara: Hier für dich, die zweite Box!" }
  ],

  parasiteDialogue: [
    {
      text: "Wow, ich bin ganz ehrlich, wenn ich dir so zu sehe bin ich immer wieder aufs neue überrascht wie gut die die Fische nur mit einem Knopfdruck schneidest."
    },
    {
      text: "Klara: Wenn ich dir so zu sehe bin ich immer wieder aufs neue überrascht wie schlecht du die Fische nur mit einem Knopfdruck schneidest.",
      choices: [
        {
          id: "negative1",
          text: "Klara: Einen verdammten Knopf drücken, ist das so schwer? Du musst ja sonst nichts machen.",
          nextText: "Assistent: Wie dumm kannst du sein? Es sind jetzt schon 7 Monate her, seit wir hier angekommen sind und du hast immer noch nicht gelernt, deinen Job richtig zu machen."
        },
        {
          id: "disagree1",
          text: "Klara würde nie so etwas sagen",
          nextText: "Klara: Du schreist ja auch nicht jeden Gedanken den du hast in die Welt hinaus. Vertrau mir, dieser Gedanke ist noch der mildeste den ich über dich äussern kann."
        }
      ],

      ignoreDialogue: [
        { text: "Klara: Na gut, dann Antworte halt nicht..." },
      ]
    }
  ]
};
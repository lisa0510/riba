export const box1Data = {

  successDialogue: [
    { text: "Klara: Ey, die sehen super aus! Lukas wird sich freuen, er mag es ja nicht, wenn die Rationen zu klein ausfallen. Auch wenn es ihm eigentlich gut tuen würde ein paar Kilos ab zu nehmen, hehehe." },
    { text: "Klara: Bin wieder da! Lukas hat die Fische der zweiten Box nun auch auf ihre toxische Ausbreitung untersuchen können." }
  ],

  parasiteDialogue: [
    {
      text: "Klara: Danke, lass mich die in unser Lager bringen. Hoffen wir bei der nächsten Box können wir mehr behalten. Wenn die Rationen zu klein ausfallen, wird Laura ja immer so gestresst..."
    },
    {
      text: "Klara: Du weisst genau wie grosse Angst Laura davor hat hier zu verhungern! Sie macht nichts anderes als sich in ihre Arbeit zu vertiefen und zu schlafen, um nicht an ihren Tot zu denken. Wieso schaffst du es nicht gross genuge Stücke zu schneiden, damit es ihr wenigstesn beim Essen gut geht?",
      choices: [
        {
          id: "disagree1",
          text: "Das Bedienfeld geht halt nicht.",
          nextText: "Klara: Oh jetzt gibt du ihr noch die Schuld dafür? Sie macht hier alles, Kochen, Putzen, Reparieren und du kannst nicht mal einen dummen Knopf bedienen."
        },
        {
          id: "agree1",
          text: "Ich kann es halt nicht besser..",
          nextText: "Klara: Faule Ausrede, dann werde besser! Immerhin hast du dich für diese Aufgabe gemeldet. Ich wünschte ich müsste nur einen Knopf bedienen! Du weisst wie sehr es mich grausst in der Säure schwimmen zu gehen.."
        }
      ],

      ignoreDialogue: [
        { text: "Klara: Na gut, dann Antworte halt nicht..." },
      ]
    }
  ]
};
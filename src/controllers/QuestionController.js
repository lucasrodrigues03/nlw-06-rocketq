const Database = require("../db/config");

function parseRoomId(roomId) {
  const parsed = String(roomId).replace(/\D/g, "").trim();
  return Number(parsed);

  // Integer 599778
  // ' :599778' - String
  // ' 599778' - replace
  // '599778' - trim
  // 599778 - Number
}

module.exports = {
  async index(req, res) {
    const db = await Database();
    const roomId = req.params.room;
    const questionId = req.params.question;
    const action = req.params.action;
    const password = req.body.password;
    /* Verificar se a senha está correta */

    const verifyRoom = await db.get(
      `SELECT * FROM rooms WHERE id = ${parseRoomId(roomId)}`
    );

    console.log("Verify Room", verifyRoom);

    console.log("Question Id", questionId);

    if (verifyRoom.pass == password) {
      if (action == "delete") {
        await db.run(`DELETE FROM questions WHERE id = ${questionId}`);
      } else if (action == "check") {
        await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`);
      }
      res.redirect(`/room/${parseRoomId(roomId)}`);
    } else {
      res.render("passincorrect", { roomId: parseRoomId(roomId) });
    }
  },

  async create(req, res) {
    const db = await Database();
    const question = req.body.question;
    const roomId = req.params.room;

    await db.run(`INSERT INTO questions(
          title,
          room,
          read
      )VALUES(
          "${question}",
          ${parseRoomId(roomId)},
          0
      )`);

    res.redirect(`/room/${parseRoomId(roomId)}`);
  },
};

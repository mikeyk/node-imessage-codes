import fs from 'fs';
import notifier from "node-notifier";
import path from 'path';
import sqlite3 from 'sqlite3'
import sqlite from 'sqlite'
import child_process from 'child_process';
import util from "util";
const { open } = sqlite;

const HOME = process.env.HOME;
const dbFilePath = path.join(HOME, '/Library/Messages/chat.db');
const walFilePath = path.join(HOME, '/Library/Messages/chat.db-wal');
const SMS_RE = new RegExp(/\s(\d{4,8})/);

var lastNotifiedCode;

async function copyLatestShortcode(db) {
  let rows = await db.all("SELECT * FROM `message` WHERE service != 'iMessage' ORDER BY date DESC LIMIT 5");
  for (var i = 0; i < rows.length; i++) {
    let row = rows[i];
    let match = SMS_RE.exec(row.text);
    console.log(row.text);
    if (match) {
      let code = match[1];
      if (code === lastNotifiedCode) {
        break;
      }
      lastNotifiedCode = code;
      var proc = child_process.spawn('pbcopy');
      proc.stdin.write(code);
      proc.stdin.end();
      let result = await util.promisify(notifier.notify)({
        title: "New code copied",
        message: `Code is: ${code}`,
        wait: true
      });
      break;
    }
  }
}

open({
    filename: dbFilePath,
    driver: sqlite3.Database
}).then(async (db) => {
  console.log("watching", walFilePath);
  fs.watchFile(walFilePath, async (curr, prev) => {
    console.log(`${walFilePath} file Changed`);
    await copyLatestShortcode(db);
  });
})
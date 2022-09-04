function getTopValue(fieldName) {
  const rows = db.questions.aggregate([
    { "$group": { "_id": fieldName, "count": { "$count": {} } } }, 
    { "$sort": { "count": -1, "_id": 1 } }, 
    { "$limit": 1 }]);

  return rows.toArray()[0]._id;
}

const db = db.getSiblingDB('GregLimDB');

const NUM_USERS = db.users.countDocuments()
const KEYWORD_FIELDS = ["$keyword1", "$keyword2", "$keyword3"];
const KEYWORD_VALUES = [];
for (let i = 0; i < KEYWORD_FIELDS.length; i++) {
  const KEYWORD = getTopValue(KEYWORD_FIELDS[i]);
  if (KEYWORD) {
    KEYWORD_VALUES.push(KEYWORD);
  }
}

let MESSAGE = `Hello John,

This is your daily report.  

As of today, you have ${NUM_USERS} users, and these are the most commonly used keywords:

`;

if (KEYWORD_VALUES.length == 0) {
  MESSAGE = MESSAGE.concat("\n  (no keywords used)\n");
}

for (let i = 0; i < KEYWORD_VALUES.length; i++) {
  MESSAGE = MESSAGE.concat(`- ${KEYWORD_VALUES[i]}\n`);
}

print(MESSAGE);
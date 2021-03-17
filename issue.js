const request = require("request");
const cheerio = require("cheerio");
let URL = "https://github.com/arendst/Tasmota/issues";

request(URL, cb);

function cb(err, res, html) {
  let chSelector = cheerio.load(html);
  let issues = chSelector(".flex-auto.min-width-0.p-2.pr-3.pr-md-2>a");
  console.log(issues);
  for (let i = 0; i < 10; i++) {
    let issue = chSelector(issues[i]).attr("href");
    console.log("https://www.github.com" + issue);
  }
}

let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let topic = require("./topic.js");
let URL = "https://www.github.com/topics/arduino";
let links = [];
let arr = topic.getArr();
console.log("arr = " + arr);
for (let i = 0; i < arr.length; i++) request(arr[i], cb);

function cb(err, response, html) {
  let chSelector = cheerio.load(html);
  let repos = chSelector(".px-3 h1 a:nth-child(2)");
  //console.log(repos);
  let temp = [];
  for (let i = 0; i < 8; i++) {
    let repo = chSelector(repos[i]).attr("href");
    //console.log("https://www.github.com" + repo);
    temp.push("https://www.github.com" + repo);
  }
  links.push(temp);
}
module.exports = {
  links: links,
};

let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let path = require("path");

// https://github.com/topics
let URL = "https://github.com/topics";
request(URL, cb);

function cb(err, response, html) {
  let chSelector = cheerio.load(html);
  let topics = chSelector(
    ".topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5 a"
  );
  //console.log(topics.length);

  for (let i = 0; i < topics.length; i++) {
    let topic = chSelector(topics[i]).attr("href");
    console.log("https://www.github.com" + topic);
    let folderName = topic.split("/").pop();
    fs.mkdirSync(path.join(__dirname, folderName));
    getRepo("https://www.github.com" + topic, folderName);
  }
}
function getRepo(url, folderName) {
  request(url, (err, response, html) => {
    let chSelector = cheerio.load(html);
    let repos = chSelector(".px-3 h1 a:nth-child(2)");
    //console.log(repos);

    for (let i = 0; i < 8; i++) {
      let repoName = chSelector(repos[i]).text();
      repoName = repoName.trim();
      fs.open(
        path.join(path.join(__dirname, folderName), `${repoName}.json`),
        "w",
        function (err, file) {}
      );
      //console.log(i, repoName.trim());
      let repo = chSelector(repos[i]).attr("href");
      //console.log(i, "https://www.github.com" + repo);
      getIssue(
        "https://www.github.com" + repo + "/issues",
        folderName,
        repoName
      );
    }
  });
}

function getIssue(url, folderName, repoName) {
  request(url, (err, res, html) => {
    let chSelector = cheerio.load(html);
    let issues = chSelector(".flex-auto.min-width-0.p-2.pr-3.pr-md-2>a");
    //console.log(issues);
    let arr = [];
    for (let i = 0; i < 10; i++) {
      let issue = chSelector(issues[i]).attr("href");
      let issueName = chSelector(issues[i]).text();
      let content = fs.readFileSync(
        path.join(path.join(__dirname, folderName), `${repoName}.json`),
        "utf-8"
      );
      //console.log(typeof content);

      arr.push({
        name: issueName,
        link: issue,
      });
      let contentinfile = JSON.stringify(arr);
      fs.writeFileSync(
        path.join(path.join(__dirname, folderName), `${repoName}.json`),
        contentinfile
      );
      // console.log("issue Name = " + issueName + "\n");
      // console.log("https://www.github.com" + issue);
    }
  });
}

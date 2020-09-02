const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replace-template");
const slugify = require("slugify");
/////////////////////////
/////// File
// blocking/synchronous
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');

// const textOut = `This is all you know about Avocado: ${textIn}.\n Created at ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('file written');

// non-blocking/asynchronous
// fs.readFile('./txt/start.txt','utf-8',(err,data1) => {
//     if(err) return console.log('ERROR');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) => {
//         if(err) return console.log('ERROR');
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3) => {
//             if(err) return console.log('ERROR');
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n\n${data3}`,'utf-8',err => {
//                 if(err) return console.log('ERROR');
//             });
//         });
//     });
// });

/////////////////////////
/////// Server

const temOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const temProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const temCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj.map((el) => replaceTemplate(temCard, el)).join();
    const output = temOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.end(output);

    // PRODUCT
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(temProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "Hello World",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("Listing to server at 8000 port");
});

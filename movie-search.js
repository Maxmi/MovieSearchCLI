const http = require("http");
const cheerio = require("cheerio");
const searchTerm = process.argv.slice(2).join('+');

function queryIMDB(searchTerm, callback) {
  const url = `http://www.imdb.com/find?ref_=nv_sr_fn&q=${searchTerm}&s=all`;
  console.log(url);
  http.get(url, res => {
    res.setEncoding('utf8');
    var html = '';
    res.on('data', (chunk) => { html += chunk });
    res.on('end', () => {
      const titlesToShow = parseData(html);
      callback(null, titlesToShow);
    })
  })
}

function parseData(html) {
  const $ = cheerio.load(html);
  const movieTitles = $(".findSection:contains('Titles')")
    .find('.result_text')
    .map((i, elm) => $(elm).text())
    .toArray();
  return movieTitles;

}


queryIMDB(searchTerm, (err, movieTitles) => {
  if(err) throw err;
  if(!searchTerm) {
    const errMessage = 'Please provide a term to search on';
    console.log(errMessage);
    return errMessage;
  }
  if(movieTitles.length === 0) {
    errMessage = `No results found for ${searchTerm}`;
    console.log(errMessage);
    return errMessage;
  }
  movieTitles.forEach((movie) => {
    console.log(movie);
  })
});


module.exports = { queryIMDB, parseData }

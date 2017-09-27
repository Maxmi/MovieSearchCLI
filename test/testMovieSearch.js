const expect = require('chai').expect;
const nock = require('nock');
const sepia = require('sepia');
const search = require('../movie-search');

describe('sepia', function() {
  it('should display message if no search term provided', function() {
    search.queryIMDB('', function(err, res) {
      expect(err).is.null;
      expect(res).to.equal('Please provide a term to search on');
      done();
    })
  });

  it('should display message if nothing found for provided term', function() {
    search.queryIMDB('hgjhgg', function(err, res) {
      expect(err).is.null;
      expect(res).to.equal('No results found for hgjhgg');
      done();
    })
  });

  it('should return 8 titles when searching for <nemo>', function() {
    search.queryIMDB('Finding Nemo', function(err, results) {
      expect(err).is.null;
      expect(result).to.have.length(8);
      done();
    })
  });

  const testHtml = `
    <div class = "findSection"> Titles
      <table>
        <tr>
          <td class="result_text">Finding Nemo (2003)</td>
        </tr>
        <tr>
          <td class="result_text">Finding Nemo Again!</td>
        </tr>
        <tr>
          <td class="result_text">Nemo is Back!</td>
        </tr>
      </table>
    </div>
    <div class="findSection">
      <table>
        <tr><td class="result_text">this should not be returned</td></tr>
      </table>
    </div>
  `;

  it('can retrieve data from html', function() {
    const result = search.parseData(testHtml);
    expect(result).to.deep.eq([
      'Finding Nemo (2003)',
      'Finding Nemo Again!',
      'Nemo is Back!'
    ]);
  });

    describe('nock it out', function() {
      it('can find nemo', function(done) {
         nock('http://www.imdb.com')
          .get('/find')
          .query({
            ref_: 'nv_sr_fn',
            q: 'Nemo',
            s: 'all'
            })
          .reply(200, testHtml);
        search.queryIMDB('Nemo', function(error, response) {
          expect(error).is.null;
          expect(response).to.have.length(3);
          done();
        })
      })
      afterEach(function() {
        nock.restore();
      })
    });

}); //end of function

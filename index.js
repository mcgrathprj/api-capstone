const CivicInfo_LookUp_URL = "https://www.googleapis.com/civicinfo/v2/representatives";

const News_LookUp_URL = "https://newsapi.org/v2/everything";

const Wikipedia_LookUp_URL = "https://en.wikipedia.org/w/api.php?action=query";

const Twitter_LookUp_URL = "";

let results; 

//I enter an address in order to retrieve a list of elected officials.
function listenForSearchTerms() {
  $(".js-search-form").submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(".js-query");
    const query = queryTarget.val();
    console.log("`listenForSearchTerms` ran; the address we are searching on is " + query);
    queryTarget.val("");
    getDataFromCivicInfo(query, displayRepresentatives);
  });
}

//When I click enter, I receive back the list. 
function getDataFromCivicInfo(searchTerm, callback) {
  const query = {
    address: `${searchTerm}`,
    key: "AIzaSyB7v_1_16Ghfi_9YeAL9JpV4FwYihrFyfY"
  };
  $.getJSON(CivicInfo_LookUp_URL, query, callback);
}

//I retrieve headlines related to the elected official.
function getDataFromNewsAPI(official_name, callback) {
  const news_query = {
    apiKey: "475f5eaec1844e1ca8241585ad85d2c6",
    q:`${official_name}`
  };
  $.getJSON(News_LookUp_URL, news_query, callback);
}


function displayRepresentatives(data) {
  results = data; 
  const html = data.offices.map((office, index) => renderOffice(office));
  $(".js-search-results").html(html);
}

function renderOffice(office) {
  let html = "";
  for (let i = 0; i < office.officialIndices.length; i++) {
    html += `
      <p class="js-official-list-item"><a href="#" 
      onClick = "renderOfficialPage('${results.official[office.officialIndices[i]].name}')">${results.official[office.officialIndices[i]].name}</a></p>
    `
  }
  return html;

}

function renderOfficialPage(person) {
    console.log("renderOfficialPage ran");
    $(".js-official-page").html(`<p>${person} is your official.</p>`);
}

listenForSearchTerms();
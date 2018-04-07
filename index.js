const CivicInfo_LookUp_URL = "https://www.googleapis.com/civicinfo/v2/representatives";

const News_LookUp_URL = "https://newsapi.org/v2/everything";

const Wikipedia_LookUp_URL = "https://en.wikipedia.org/w/api.php?action=query";

const Twitter_LookUp_URL = "";

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

function getDataFromCivicInfo(searchTerm, callback) {
    const query = {
    address: `${searchTerm}`,
    key: "AIzaSyB7v_1_16Ghfi_9YeAL9JpV4FwYihrFyfY",
    };
    $.getJSON(CivicInfo_LookUp_URL, query, callback);
    console.log("`getDataFromCivicInfo` ran; address is " + query.address);
}

function getDataFromNewsAPI(official_name, callback) {
  const news_query = {
  apiKey: "475f5eaec1844e1ca8241585ad85d2c6",
  q:`${official_name}`,};
  $.getJSON(News_LookUp_URL, news_query, callback);
}


function displayRepresentatives(data) {
  const results = data.officials.map((official, index) => renderResult(official));
  $(".js-search-results").html(results);
}

function renderResult(result) {
  return `
      <p class="js-official-list-item"><a href="#" onClick = "renderOfficialPage(${result.name})">${result.name}</a></p>
  `;
}

function renderOfficialPage(official) {
    console.log("renderOfficialPage ran");
    $(".js-official-page").html(`<p>${result.name} is your official.</p>`);
}

listenForSearchTerms();
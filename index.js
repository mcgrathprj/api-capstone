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

function displayRepresentatives(data) {
  results = data; 
  const html = data.offices.map((office, index) => renderOffice(office,index));
  $(".js-search-results").html(html);
}

function renderOffice(office, officeIndex) {
  let html = "";
  for (let i = 0; i < office.officialIndices.length; i++) {
    html += `
      <p class="js-official-list-item"><a href="#" 
      onClick = "renderOfficialPage(${officeIndex},${office.officialIndices[i]})">${results.officials[office.officialIndices[i]].name}</a></p>
    `
  }
  return html;

}

function renderOfficialPage(office, index) {
    let has_urls = results.officials[index].hasOwnProperty("urls")
    console.log(Object.keys(results.officials[index]))
    $(".js-search-results").css("display","none");
    $(".js-search-form").css("display","none");
    if (has_urls == true) {
    $(".js-official-page").html(`<img src="${results.officials[index].photoUrl}" class="js-headshot">
      <h2>${results.officials[index].name}: ${results.offices[office].name}</h2>
      <h3>Party: ${results.officials[index].party}</h3>
      <h3>Website: <a href="${results.officials[index].urls[0]}">${results.officials[index].urls[0]}</a></h3>
      `);
  }
  else {
   $(".js-official-page").html(`<img src="${results.officials[index].photoUrl}" class="js-headshot">
      <h2>${results.officials[index].name}: ${results.offices[office].name}</h2>
      <h3>Party: ${results.officials[index].party}</h3>
      `) 
  }
  for (let i = 0; i < results.officials[index].channels.length; i++){
    $(".js-official-page").append(`
      <h3>${results.officials[index].channels[i].type}: ${results.officials[index].channels[i].id}</h3> 
      `)
  }
getDataFromNewsAPI(results.officials[index].name, renderHeadlines(results));
}

//I retrieve headlines related to the elected official.
function getDataFromNewsAPI(official_name, callback) {
  const news_query = {
    apiKey: "475f5eaec1844e1ca8241585ad85d2c6",
    q:`${official_name}`
  };
  $.getJSON(News_LookUp_URL, news_query, callback)
}


function renderHeadlines(data) {
    $(".js-news-results").html("<h3>Recent Headlines</h3>")
    for (let i = 0; i < results.articles.length; i++) {
      $(".js-news-results").append(`<p><a href="${results.articles[i].url}">${results.articles[i].title}</a></p>`)
    }
}
listenForSearchTerms();
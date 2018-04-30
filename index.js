const CivicInfo_LookUp_URL = "https://www.googleapis.com/civicinfo/v2/representatives";

const News_LookUp_URL = "https://newsapi.org/v2/everything";

const brands = { 
  Facebook: "fab fa-facebook-f", 
  Twitter: "fab fa-twitter", 
  GooglePlus: "fab fa-google-plus-g",
  YouTube: "fab fa-youtube"
  }; 

let query;

let results; 

//I enter an address in order to retrieve a list of elected officials.
function listenForSearchTerms() {
  $(".js-search-form").submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(".js-query");
    const query = queryTarget.val();
    console.log("`listenForSearchTerms` ran; the address we are searching on is " + query);
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
      onClick = "renderOfficialPage(${officeIndex},${office.officialIndices[i]})">${results.officials[office.officialIndices[i]].name}, 
       ${results.officials[office.officialIndices[i]].party}: ${office.name}</a></p>
    `
  }
  return html;

}
//when i click on the name of an official, i get back a page with more information about that official
function renderOfficialPage(office, index) {
    $(".js-search-results").css("display","none");
    $(".js-search-form").css("display","none");
    if (results.officials[index].hasOwnProperty("photoUrl") == true) {
    $(".js-official-headshot").html(`<img src="${results.officials[index].photoUrl}" class="js-headshot">`)
  };
    if (results.officials[index].hasOwnProperty("urls") == true) {
    $(".js-official-headings").html(`<h2>${results.officials[index].name}</h2>
      <h3>${results.offices[office].name}</h3>
      <p>Party: ${results.officials[index].party}</p>
      <p>Website: <a href="${results.officials[index].urls[0]}">${results.officials[index].urls[0]}</a></p>`
    );
  }
  else {
   $(".js-official-headings").html(`<img src="${results.officials[index].photoUrl}" class="js-headshot">
      <h2>${results.officials[index].name}<h2> 
      <h3>${results.offices[office].name}</h3>
      <p>Party: ${results.officials[index].party}</p>`
    ) 
  }

  for (let i = 0; i < results.officials[index].channels.length; i++){
    let x = results.officials[index].channels[i].type; 
    let icon = `<i class="${brands[x]} 2x"></i>`;
    if (x = "GooglePlus") {
    $(".js-official-channels").append(`
      <p>${icon} ${results.officials[index].channels[i].type}: <a target="_blank" 
        href="https://plus.google.com/${results.officials[index].channels[i].id}">
        ${results.officials[index].channels[i].id}</a></p>` 
    )
  } 
    else { 
    $(".js-official-channels").append(`
      <p>${icon} ${results.officials[index].channels[i].type}: <a target="_blank" 
        href="https://${results.officials[index].channels[i].type}.com/${results.officials[index].channels[i].id}">
        ${results.officials[index].channels[i].id}</a></p>` 
    )};

  }
  $(".js-official-channels").append(`<button onclick="goBackToResults(query)" id="go_back">Return to List of Officials</button>`);

  getDataFromNewsAPI(results.officials[index].name, renderHeadlines);
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
    $(".js-news-results").html("<h2>Recent Headlines</h2>")
    for (let i = 0; i <data.articles.length; i++) {
      $(".js-news-results").append(`<h3><a href="${data.articles[i].url}">${data.articles[i].title}</a></h3>
          <p class="js-news-description">${data.articles[i].publishedAt}: ${data.articles[i].description}</p>`
        )
    }
}

function goBackToResults(query) {
  console.log(query)
}


listenForSearchTerms();
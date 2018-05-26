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
  $.getJSON(CivicInfo_LookUp_URL, query)
  .done(function(data) {
    displayRepresentatives(data)
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    displayError( "Please Check the Address You Entered and Try Again");
  });
};

function displayError(message) {
 $(".error-message").html(`<h2>${message}</h2>`)
}

function displayRepresentatives(data) {
  results = data; 
  $(".error-message").css("display", "none");
  $(".js-search-area").css("display", "none");
  $("header").css("height", "10%");

    const youraddress = `${data.normalizedInput.line1} ${data.normalizedInput.city} ${data.normalizedInput.state} ${data.normalizedInput.zip}`;
    $(".js-your-address").html(`<h2>Displaying elected officials for ${youraddress}</h2><button class = "js-new-search" onClick = "location.reload()">Try Another Address</button>`);
    const html = data.offices.map((office, index) => renderOffice(office, index, youraddress));
    $(".js-search-results").html(html);
  }

function renderOffice(office, officeIndex, address) {
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
  let youraddress = `${results.normalizedInput.line1} ${results.normalizedInput.city} ${results.normalizedInput.state} ${results.normalizedInput.zip}`
  $(".js-search-results").css("display","none");
  $(".js-search-form").css("display","none");
  $(".js-your-address").css("display","none");
  $(".js-official-headshot").css("display","block");
  $(".js-official-headings").css("display","block");
  $(".js-official-channels").css("display","block");
  $(".js-news-results").css("display","block");
  $(".js-back-button").css("display","block");    
  if (results.officials[index].hasOwnProperty("photoUrl") === true) {
    $(".js-official-headshot").html(`<img src="${results.officials[index].photoUrl}" class="js-headshot" alt="headshot for ${results.officials[index].name}"/>`);
  }
  else {
    $(".js-official-headshot").empty();
  }
  if (results.officials[index].hasOwnProperty("urls") === true) {
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
  $(".js-official-channels").empty();
  if (results.officials[index].hasOwnProperty("channels") === true) {
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
      $(".js-official-channels").html(`
        <p>${icon} ${results.officials[index].channels[i].type}: <a target="_blank" 
          href="https://${results.officials[index].channels[i].type}.com/${results.officials[index].channels[i].id}">
          ${results.officials[index].channels[i].id}</a></p>` 
        )
      };
    }
  }
  $(".js-back-button").html(`<button onclick="goBackToResults()" id="go_back">Return to List of Officials</button>`);

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

function goBackToResults() {
    $(".js-search-results").css("display","block");
    $(".js-search-form").css("display","block");
    $(".js-your-address").css("display","block");
    $(".js-official-headshot").css("display","none");
    $(".js-official-headings").css("display","none");
    $(".js-official-channels").css("display","none");
    $(".js-news-results").css("display","none");
    $(".js-back-button").css("display","none")

}

listenForSearchTerms();
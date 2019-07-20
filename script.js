'use strict';

const apiKey = '28cce36eea2a4d2938dc1ef9edc48c9d';
const hash ='a270a8e589b61a8dbafd46388ff7297f';
const ts = '1563499589798';
const searchURL = 'https://gateway.marvel.com:443/v1/public/characters';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


/* future requests
function getRequest(hero, shorthand, comic, series, events, stories)
*/

function getRequest(hero){
  const params = {
    name : hero,
    apikey : apiKey,
    ts : ts,
    hash : hash


    /*nameStartsWith : shortHand,
    comics : comic,
    series : series,
    events : events,
    stories : stories */
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if ( response.ok ){
        return response.json();
      }
      else{
        throw new Error("Something went wrong. Try again later.");
      }
      
    })
    .then(finalResponse => {
      displayResults(finalResponse);
    })
    .catch(error => {
       $('.results').empty();
       $('.results').html(`<p>${error.message}</p>`)
    });


}

function displayResults(heroInfo){
  $('.results').empty();

  let face = heroInfo.data.results[0].thumbnail.path + `.` + heroInfo.data.results[0].thumbnail.extension;

  $('.results').append(`
                        <div class='toPage'>
                        <h1>${heroInfo.data.results[0].name}</h1>
                        <p>${heroInfo.data.results[0].description}</p>
                        <img src="${face}">
                        </div>

  `);

  console.log(
    heroInfo.data.results
  );

}



function watchForm(){
  $('.submitForm').on('click', (event) => {
    event.preventDefault();

    const heroName = $('.heroName').val();
    
    /* future requests
    let heroShort = $().val();
    let heroComic = $().val();
    let heroSeries = $().val();
    let heroEvents = $().val();
    let heroStories = $().val();
    */

    getRequest(heroName);
  });

}

$(watchForm);

/*
make /v1/public/characters?name=thor a part of hero.val() for all requests
i.e.

/v1/public/comics?title=thor replace thor with .val() for comics etc


Refernce URL

https://gateway.marvel.com:443/v1/public/characters?name=thor&apikey=28cce36eea2a4d2938dc1ef9edc48c9d&ts=1563499589798&hash=a270a8e589b61a8dbafd46388ff7297f

*/
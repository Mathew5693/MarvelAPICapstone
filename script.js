'use strict';

const apiKey = '28cce36eea2a4d2938dc1ef9edc48c9d';
const hash ='a270a8e589b61a8dbafd46388ff7297f';
const ts = '1563499589798';
const apiURL = 'https://gateway.marvel.com:443';
let limit = 6;
let offset = 0;
let theHeroID = 0;

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function generateHash(){
  const params = {
    apikey : apiKey,
    ts : ts,
    hash : hash
  };

  const queryString = formatQueryParams(params);
  return queryString;
}

function fetchURL(link, successCallback){
  fetch(link)
    .then(response => {
      if ( response.ok ){
        return response.json();
      }
      else{
        throw new Error("Something went wrong. Try again later.");
      }
      
    })
    .then(finalResponse => {
      successCallback(finalResponse);
    })
    .catch(error => {
       $('.results').empty();
       $('.Comics').empty();
       $('.results').html(`
                          <div class="errorWrap">
                          <div class="errorHandle">
                          <p>Something went wrong!</p>
                          <p>Please correct any spelling!</p>
                          <p>Be sure to add special characters ' - ' or spaces for any Hero name i.e. Spider-man, Iron man.</p>
                          </div>
                          <img src="dpError.png" class="errorIMG">
                          </div>
                          `)
    });
}

function getRequest(hero){
  const params = {
    name : hero,
    apikey : apiKey,
    ts : ts,
    hash : hash
  };

  const queryString = formatQueryParams(params);
  const searchURL = apiURL + '/v1/public/characters';
  const url = searchURL + '?' + queryString;


  fetchURL(url, displayResults);
  $('.Comics').html('<img class="loading" src="https://media1.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif" >');
}


function displayResults(heroInfo){

  let x = heroInfo;
  setGeneralInfo(x);

  let heroID = heroInfo.data.results[0].id;
  getHeroComics(heroID);
  //getStories(heroID);
}

//display main Splash, general Info
function setGeneralInfo(heroInfo){
  $('.results').empty();

  let heroIMG = heroInfo.data.results[0].thumbnail.path + `.` + heroInfo.data.results[0].thumbnail.extension;

  $('.results').append(`
                        
                        <div class='toPage'>
                        <h1>${heroInfo.data.results[0].name}</h1>
                        <p>${heroInfo.data.results[0].description}</p>
                        <img src="${heroIMG}">
                        </div>
                        
  `);
}


function getHeroComics(heroInfo){
  let urlHsh = generateHash();
  theHeroID = heroInfo;
  let heroID = '/v1/public/characters/'+ theHeroID + '/comics';
  const searchURL = apiURL + heroID;
  const url = searchURL + '?' + urlHsh + '&limit=' + limit + '&offset=' + offset;
  fetchURL(url, setHeroComics);
}


function nextComics(){
  $('.Comics').on('click', '.next', function(e){
    e.preventDefault();
    offset += 6;
    getHeroComics(theHeroID);

  });
}

function previousComics(){
  $('.Comics').on('click', '.previous', function(e){
    e.preventDefault();
    offset -= 6;
    getHeroComics(theHeroID);

  });
}

//displays additional options i.e. stories, comics, etc
function setHeroComics(heroInfo){
  $('.Comics').empty();
  $('.Comics').append(` 
                            <div class="titles">
                            Comic Issues: ${offset + 6} / ${heroInfo.data.total}
                            </div>
  `);

  for(let j = 0; j < heroInfo.data.results.length; j++){
    let comicLink = heroInfo.data.results[j].urls[0].url;
    let cover = heroInfo.data.results[j].thumbnail.path + '.jpg';
    let title = heroInfo.data.results[j].title;
  
  $('.Comics').append(`
                        <div class="comicWrap">
                          <div class="linkContainer">
                            <a href="${comicLink}" target="_blank"><img src ="${cover}"></a>
                            <h3><a href="${comicLink}" target="_blank">${title}</a></h3>
                          </div>
                        </div>    
  `);
  }

  let buttonContent = `<div class="buttonContainer">`;
  if ( offset !== 0 ){
    buttonContent += `<button class="previous"> &laquo Previous </button>`;
  }

  if ( offset + 6 < heroInfo.data.total ){
    buttonContent += `<button class="next"> Next &raquo </button>`;
  }
                  
  buttonContent += `</div>`;

  $('.Comics').append(buttonContent);
}

function watchForm(){
  $('.submitForm').on('click', (event) => {
    event.preventDefault();

    $('.backgroundSplash').hide();

    const heroQuery = $('.heroQuery').val();
    offset = 0;
    getRequest(heroQuery);
  });

}

$(watchForm);
$(nextComics);
$(previousComics);

/*
Refernce URL

https://gateway.marvel.com:443/v1/public/characters?name=thor&apikey=28cce36eea2a4d2938dc1ef9edc48c9d&ts=1563499589798&hash=a270a8e589b61a8dbafd46388ff7297f

*/
'use strict';

const apiKey = '28cce36eea2a4d2938dc1ef9edc48c9d';
const hash ='a270a8e589b61a8dbafd46388ff7297f';
const ts = '1563499589798';
const apiURL = 'https://gateway.marvel.com:443';

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
       $('.results').html(`<p>${error.message}</p>`)
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

}


function displayResults(heroInfo){

  let x = heroInfo;
  generalInfo(x);

  let heroID = heroInfo.data.results[0].id;
  console.log(heroID);
  getComics(heroID);
  //getStories(heroID);

}

//display main Splash, general Info
function generalInfo(heroInfo){
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


function getComics(heroInfo){
  let urlHsh = generateHash();
  let heroID = '/v1/public/characters/'+ heroInfo + '/comics';
  const searchURL = apiURL + heroID;
  const url = searchURL + '?' + urlHsh;
  fetchURL(url, relatedComics);
}


//displays additional options i.e. stories, comics, etc
function relatedComics(heroInfo){
  $('.Comics').empty();
  $('.Comics').append(` 
                            <div class="titles">Comics</div>
  `);

  for(let j = 0; j < 6; j++){
    let comicLink = heroInfo.data.results[j].urls[0].url;
    let cover = heroInfo.data.results[j].thumbnail.path + '.jpg';
    let title = heroInfo.data.results[j].title;
  
  $('.Comics').append(`
  
                        <div class="comicWrap">
                          <div class="linkContainer">
                            <a href="${comicLink}" target="_blank"><img src ="${cover}"></a>
                            <h3>${title}</h3>
                          </div>
                        </div>    

  `);}
}

/*

function getStories(heroInfo){
  let urlHsh = generateHash();
  let heroID = '/v1/public/characters/'+ heroInfo + '/stories';
  const searchURL = apiURL + heroID;
  const url = searchURL + '?' + urlHsh;
  fetchURL(url, relatedStories);
}

function relatedStories(heroInfo){
  $('.Stories').empty();
  $('.Stories').append(` 
                            <div class="titles">Stories</div>
  `);

  for(let j = 0; j < 6; j++){
    let comicLink = heroInfo.data.results[j].urls[0].url;
    let cover = heroInfo.data.results[j].thumbnail.path + '.jpg';
    let title = heroInfo.data.results[j].title;
  
  $('.relatedComics').append(`
  
                        <div class="comicWrap">
                          <div class="linkContainer">
                            <a href="${comicLink}" target="_blank"><img src ="${cover}"></a>
                            <h3>${title}</h3>
                          </div>
                        </div>    

  `);}
  
}

*/



function watchForm(){
  $('.submitForm').on('click', (event) => {
    event.preventDefault();
    const heroQuery = $('.heroQuery').val();
    getRequest(heroQuery);
  });

}

$(watchForm);

/*
Refernce URL

https://gateway.marvel.com:443/v1/public/characters?name=thor&apikey=28cce36eea2a4d2938dc1ef9edc48c9d&ts=1563499589798&hash=a270a8e589b61a8dbafd46388ff7297f

*/
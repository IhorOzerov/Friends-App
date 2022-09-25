function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

const url = 'https://randomuser.me/api/?nat=ua&results=24&inc=gender,name,picture,dob,cell&noinfo';
const respData = []

const mainContainer = document.querySelector('.container')
const listOfMembers = document.querySelector(".list");

const getData = (url) => {
  
  try {
    fetch(url)  
    .then(handleErrors)
      .then(response => response.json())
      .then((json) => {
        respData.push(...json.results);
        getPeoples(respData);
      });
  } catch (err) {
    alert("Try again please");
     console.log(err);
     mainContainer.innerHTML = `<div class="errorScreen">
     <p class="errorText">Something wrong with connect, try to refresh the page</p>
     <img class="errorImage" src="./images/err.png" alt="error"></div>
     `
  }
}
getData(url);

function getPeoples(respData) {
  respData.forEach((user) => {
    const newCard = document.createElement('div');
    newCard.classList.add('human');
    listOfMembers.appendChild(newCard);
    newCard.innerHTML = `
      <img class="myFace" src="${user.picture.large}" alt="myFace">
      <div class="color"></div>
      <p class="myGender">${user.gender}</p>
      <p class="myName">${user.name.first} ${user.name.last}</p>
      <p class="myAge">${user.dob.age}</p>
      <a href="tel:${user.cell.replace(/[A-Z]/, Math.floor(Math.random()*9))}">
      ${user.cell.replace(/[A-Z]/, Math.floor(Math.random()*9))}</a>`
  });
}

const findThat = document.querySelector("#searchFriend");
const genderSelector = document.querySelector('#sex');
const sortingSelector = document.querySelector("#ageAndName");

findThat.addEventListener("input", sortMembers);
genderSelector.addEventListener("change", sortMembers);
sortingSelector.addEventListener("change", sortMembers);

function sortMembers() {
  let sortedMembers = [...respData]

  sortedMembers = sortedMembers.filter(element => `${element.name.first}${element.name.last}`
  .toLowerCase()
  .includes(findThat.value.trim()));
  
  if (genderSelector.value === "All") {
    sortedMembers;
  } else if (genderSelector.value === "Female") {
    sortedMembers = sortedMembers.filter(element => element.gender === "female")
  } else {
    sortedMembers = sortedMembers.filter(element => element.gender === "male")
  }

  if (sortingSelector.value === 'upAge') {
    sortedMembers = sortedMembers.sort((a,b) => sortingAge(a, b) );
  } else if (sortingSelector.value === 'downAge') {
    sortedMembers = sortedMembers.sort((a, b) => sortingAge(b, a) );
  } else if (sortingSelector.value === 'AtoZ') {
    sortedMembers = sortedMembers.sort((a, b) => sortingNames(a, b));
  } else if (sortingSelector.value === 'ZtoA') {
    sortedMembers = sortedMembers.sort((a, b) => sortingNames(b, a));
  } else {
    sortedMembers;
  }

  listOfMembers.innerHTML = '';
  getPeoples(sortedMembers)
}

function sortingNames(a, b){
 return a.name.first == b.name.first ? 0 : a.name.first < b.name.first ? -1 : 1;
}

function sortingAge(a, b){
  return a.dob.age - b.dob.age;
}

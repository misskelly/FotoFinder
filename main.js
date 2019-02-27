const searchInput = document.querySelector('.search-input');
const newFotoForm = document.querySelector('.new-foto-info');
const titleInput = document.querySelector('.title-input');
const captionInput = document.querySelector('.cap-input');
const fileInput = document.querySelector('.add-file');
const addFotoBtn = document.querySelector('.add-btn');
const viewFavsBtn = document.querySelector('.view-favs-btn');
const showMoreBtn = document.querySelector('.show-more');
const gallery = document.querySelector('.gallery');
const emptyGallery = document.querySelector('.empty-gallery');
const footer = document.querySelector('footer');
let fav;
let unfav;
const fotoArr = [];
const reader = new FileReader();


window.addEventListener('load', pageLoad);
searchInput.addEventListener('input', search);
addFotoBtn.addEventListener('click', addNewFoto);
viewFavsBtn.addEventListener('click', viewFavs);
gallery.addEventListener('click', cardButton);
gallery.addEventListener('input', editCard);
newFotoForm.addEventListener('change', enableButton);
gallery.addEventListener('keydown', enterKey);
showMoreBtn.addEventListener('click', moreLess);

function search() {
  gallery.innerHTML = '';
  const query = searchInput.value;
  let filteredCards = fotoArr.filter(foto => {
    return foto.title.toLowerCase().includes(query) || foto.caption.toLowerCase().includes(query);
  });
  filteredCards.forEach(foto => checkFav(foto));
}

function filterFavorites() {
  return fotoArr.filter(foto => foto.fav === true)
}

function addNewFoto(e) {
  e.preventDefault();
  if (emptyGallery.classList.contains('empty')) {
    emptyGallery.classList.remove('empty');
  }
  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = saveFoto;
  }
  enableButton();
}
function enableButton() {
  addFotoBtn.disabled = !inputValuesPresent();
}
function inputValuesPresent() {
  return fileInput.files.length > 0 &&
  titleInput.value.length > 0 &&
  captionInput.value.length > 0;
}
function saveFoto(e) {
  e.preventDefault;
  let newFoto = new Foto(Date.now(), titleInput.value, captionInput.value, e.target.result);
  fotoArr.push(newFoto);
  newFoto.saveToStorage();
  appendFoto(newFoto);
  titleInput.value = '';
  captionInput.value = '';
  fileInput.files.length === 0;
}


function pageLoad() {
  debugger

  if (localStorage.hasOwnProperty("storedFotos")) {
    const parsedArray = JSON.parse(localStorage.getItem("storedFotos"));
    parsedArray.forEach(foto => {
      const oldFoto = new Foto(foto.id, foto.title, foto.caption, foto.file, foto.fav);
      fotoArr.push(oldFoto);
    });
    showTen();
  } else {
    footer.classList.remove('visible-footer');
    emptyGallery.classList.add('empty')
  }
}

function showTen() {
  if (fotoArr[10]) {
    const topTen = fotoArr.slice(-10);
    appendTheseFotos(topTen);
    footer.classList.add('visible-footer');
  } else {
    appendTheseFotos(fotoArr);
  }
}

function appendTheseFotos(fotos) {
  fotos.forEach(foto => checkFav(foto))
}


function checkFav(foto) {
  const favCount = document.querySelector('#fav-count');
  if (foto.fav === true) {
    appendFoto(foto, 'favorite', 'unfav');
    viewFavsBtn.innerText = `View ${filterFavorites().length} favorites`;
  } else {
    appendFoto(foto);
  }
}


function moreLess() {
  gallery.innerHTML = '';
  if (showMoreBtn.innerText === 'Show More') {
    // favorites = [];
    appendTheseFotos(fotoArr);
    showMoreBtn.innerText = 'Show Less';
  } else if (showMoreBtn.innerText === 'Show Less') {
    showTen();
    showMoreBtn.innerText = 'Show More';
  }
}


function appendFoto(foto, fav, unfav) {
  gallery.insertAdjacentHTML('afterbegin',
    `<article data-id=${foto.id} class="foto-card">
        <h4 class="card-title card-text" contenteditable="true" onkeydown="enterKey()">
          ${foto.title}
        </h4>
        <div class="card-img-container">
          <img class="foto-img" src="${foto.file}">
        </div>
        <p class="card-caption card-text" contenteditable="true">
          ${foto.caption}
        </p>
        <form class="card-buttons">
          <button class="trash card-btn">
            <img src="assets/images/delete.svg" class="trash-icon card-svg">
            <img src="assets/images/delete-active.svg" class="trash-icon-active card-svg card-btn-active">
          </button>
          <button class="heart-btn card-btn">
            <img src="assets/images/favorite.svg" class="heart-icon card-svg ${unfav}">
            <img src="assets/images/favorite-active.svg" class="heart-icon-active card-svg card-btn-active ${fav}" id="favorite"> 
          </button>
        </form>
      </article>`);
}

function viewFavs(e) {
  e.preventDefault();
  let favorites = filterFavorites();
  console.log(favorites);
  gallery.innerHTML = '';
  favorites.forEach(foto => {
    appendFoto(foto, 'favorite', 'unfav');
    });
}

function enterKey(e) {
  if (e.keyCode === 13) {
    e.target.blur();
  }
}

function findFoto(e) {
  const targetCardId = e.target.closest('.foto-card').dataset.id;
  const targetFoto = fotoArr.find(foto => foto.id == targetCardId);
  return targetFoto;
}

function cardButton(e) {
  e.preventDefault();
  const targetCard = e.target.closest('.foto-card');
  const targetFoto = findFoto(e);
  const index = fotoArr.indexOf(targetFoto);
  if (e.target.matches('.trash-icon-active')) {
    targetCard.remove();
    targetFoto.deleteFromStorage(index);
  } else if (e.target.matches('.heart-icon-active')) {
    favToggle(e, targetCard, targetFoto);
  }
}

function favToggle(e, card, foto) {
  e.target.classList.toggle('favorite')
  e.target.previousElementSibling.classList.toggle('unfav');
  foto.updateFoto(e);
}

function editCard(e) {
  const targetFoto = findFoto(e);
  // console.log(targetFoto)
  targetFoto.updateFoto(e, e.target.innerText);
}


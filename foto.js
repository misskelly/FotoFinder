class Foto {
  constructor(id, title, caption, file, fav) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.fav = fav || false;
  }

  saveToStorage() {
    const stringified = JSON.stringify(fotoArr);
    localStorage.setItem("storedFotos", stringified);
  }

  deleteFromStorage(index) {
    fotoArr.splice(index, 1);
    this.saveToStorage(fotoArr);
  }

  updateFoto(e, newText) {
    if (e.target.matches('.card-title')) {
      this.title = newText;
    } else if (e.target.matches('.card-caption')){
      this.caption = newText;
    } else if (e.target.matches('#favorite')) {
      this.fav = !this.fav;
    }
    this.saveToStorage(fotoArr);
  }

  // updateFav() {
  //   this.fav = !this.fav;
  //   console.log(this)
  //   console.log(fotoArr)
  //   // this.saveToStorage(fotoArr); 
  // }


}
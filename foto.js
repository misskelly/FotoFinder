class Foto {
  constructor(id, title, caption, file, fav) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.fav = this.fav || false;
  }

  saveToStorage() {
    const stringified = JSON.stringify(fotoArr);
    localStorage.setItem("storedFotos", stringified);
  }

  deleteFromStorage(index) {
    fotoArr.splice(index, 1);
    this.saveToStorage(fotoArr);
  }

}
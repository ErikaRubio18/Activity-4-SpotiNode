// public/js/script.js
async function uploadSong() {
    const fileInput = document.getElementById('songUpload');
    const formData = new FormData();
    formData.append('song', fileInput.files[0]);
    
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    const song = await res.json();
    console.log(song);
    displaySongs();
  }
  
  async function displaySongs() {
    const res = await fetch('/songs');
    const songs = await res.json();
    const songList = document.getElementById('songList');
    songList.innerHTML = '';
    songs.forEach(song => {
      const li = document.createElement('li');
      li.innerText = `${song.title} - ${song.artist}`;
      songList.appendChild(li);
    });
  }
  
  displaySongs();
  
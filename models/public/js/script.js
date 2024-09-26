async function uploadSong() {
    const fileInput = document.getElementById('songUpload');
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('songArtist').value;
    const album = document.getElementById('songAlbum').value;
    const duration = document.getElementById('songDuration').value;

    if (!fileInput.files.length || !title || !artist || !album || !duration) {
        alert("Please fill in all fields and select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('song', fileInput.files[0]);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('duration', duration);

    const res = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (res.ok) {
        const song = await res.json();
        console.log('Song uploaded:', song);
        displaySongs(); // Refresh the song list
    } else {
        console.error('Error uploading song:', res.statusText);
        alert("Error uploading song.");
    }
}

async function displaySongs() {
    const res = await fetch('/songs');
    const songs = await res.json();
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear existing songs

    songs.forEach(song => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        const playButton = document.createElement('button');
        playButton.innerText = 'Play';
        playButton.onclick = () => playSong(song.id);
        li.appendChild(playButton);
        songList.appendChild(li);
    });
}

async function playSong(id) {
    const res = await fetch(`/play/${id}`);
    if (res.ok) {
        const audioUrl = await res.text();
        const audio = new Audio(audioUrl);
        audio.play();
    } else {
        console.error('Error playing song:', res.statusText);
        alert("Error playing song.");
    }
}

// Initial display of songs when the page loads
displaySongs();

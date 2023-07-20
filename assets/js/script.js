// Replace with your MusicBrainz API key
const musicBrainzApiKey = 'YOUR_MUSICBRAINZ_API_KEY';
// Replace with your YouTube API key
const youtubeApiKey = 'AIzaSyCM19Qyra7xWHsTycyp-7P6YWL9oyrCtes';

// Function to search for an artist and retrieve the most popular music video for a song
async function searchArtist() {
  const artistInput = document.getElementById('artistInput').value;

  // Clear previous results
  document.getElementById('artistInfo').innerHTML = '';
  document.getElementById('videoContainer').innerHTML = '';

  try {
    // Get the most popular music video using YouTube API
    const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&type=video&q=${encodeURIComponent(artistInput + ' song')}&maxResults=1&chart=mostPopular&videoEmbeddable=true`);
    const youtubeData = await youtubeResponse.json();

    if (youtubeData.items.length > 0) {
      const videoId = youtubeData.items[0].id.videoId;
      const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

      // Create a link element to display the video link
      const videoLinkElement = document.createElement('a');
      videoLinkElement.href = videoLink;
      videoLinkElement.target = '_blank';
      videoLinkElement.textContent = 'Click here for video';

      // Append the link element to the video container
      const videoContainer = document.getElementById('videoContainer');
      videoContainer.appendChild(videoLinkElement);

      document.getElementById('videoSection').style.display = 'block';
    } else {
      showModal('No music video found for the artist!');
    }

    // Search for artist using MusicBrainz API
    const musicBrainzResponse = await fetch(`https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(artistInput)}&fmt=json&limit=1&${musicBrainzApiKey}`);
    const musicBrainzData = await musicBrainzResponse.json();

    if (musicBrainzData.artists.length > 0) {
      const artist = musicBrainzData.artists[0];
      const artistInfo = document.getElementById('artistInfo');
      const genre = artist.tags[0]?.name || 'N/A';
      const birthdate = artist.begin_area?.begin || 'N/A';
      const summary = artist.disambiguation || 'N/A';

      artistInfo.innerHTML = `
        <h3>Name: ${artist.name}</h3>
        <p>Type: ${artist.type}</p>
        <p>Country: ${artist.country}</p>
        <p>Genre: ${genre}</p>
        <p>Birthdate: ${birthdate}</p>
        <p>Summary: ${summary}</p>
      `;
      document.getElementById('artistInfoSection').style.display = 'block';

      // Save the searched artist data to local storage if it doesn't already exist
      const artistData = {
        name: artist.name,
        type: artist.type,
        country: artist.country,
        genre: genre,
        birthdate: birthdate,
        summary: summary
      };

      // Get the existing saved artists from local storage
      let savedArtists = localStorage.getItem('savedArtists');
      savedArtists = savedArtists ? JSON.parse(savedArtists) : [];

      // Check if the artist is already present in the saved artists list
      const isArtistAlreadySaved = savedArtists.some(savedArtist => savedArtist.name === artistData.name);

      if (!isArtistAlreadySaved) {
        // Add the new artist data to the saved artists list
        savedArtists.push(artistData);

        // Update the saved artists in local storage
        localStorage.setItem('savedArtists', JSON.stringify(savedArtists));
      }

      // Update the dropdown with the previously searched artists
      updatePreviousArtistsDropdown(savedArtists);
    } else {
      showModal('Artist not found!');
    }
  } catch (error) {
    console.log('Error fetching data:', error);
    showModal('Error fetching data. Please try again.');
  }
}

// Function to handle the selection of a previously searched artist
function selectPreviousArtist() {
  const selectedArtistIndex = document.getElementById('previousArtists').value;

  // Get the saved artists from local storage
  let savedArtists = localStorage.getItem('savedArtists');
  savedArtists = savedArtists ? JSON.parse(savedArtists) : [];

  if (selectedArtistIndex < savedArtists.length) {
    const selectedArtist = savedArtists[selectedArtistIndex];
    document.getElementById('artistInput').value = selectedArtist.name;
    searchArtist();
  }
}

// Function to show a modal with a message
function showModal(message) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalMessage = document.getElementById('modalMessage');

  modalMessage.textContent = message;
  modal.classList.add('show');

  modal.addEventListener('click', function () {
    modal.classList.remove('show');
  });

  modalContent.addEventListener('click', function (event) {
    event.stopPropagation();
  });
}

// Function to update the dropdown with the previously searched artists
function updatePreviousArtistsDropdown(savedArtists) {
  const previousArtistsDropdown = document.getElementById('previousArtists');
  previousArtistsDropdown.innerHTML = '';

  savedArtists.forEach((savedArtist, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.text = savedArtist.name;
    previousArtistsDropdown.appendChild(option);
  });
}

// Function to clear the previous search results
function clearPreviousSearchResults() {
  // Clear the saved artists in local storage
  localStorage.removeItem('savedArtists');

  // Clear the previous artists dropdown
  const previousArtistsDropdown = document.getElementById('previousArtists');
  previousArtistsDropdown.innerHTML = '';
}

// Attach event listener to search button
document.getElementById('searchBtn').addEventListener('click', searchArtist);

// Attach event listener to previous artists dropdown
document.getElementById('previousArtists').addEventListener('change', selectPreviousArtist);

// Attach event listener to clear button
document.getElementById('clearBtn').addEventListener('click', clearPreviousSearchResults);

// Apply CSS style to center the previous artists dropdown
document.getElementById('previousArtists').style.margin = '0 auto';

// Get the existing saved artists from local storage
let savedArtists = localStorage.getItem('savedArtists');
savedArtists = savedArtists ? JSON.parse(savedArtists) : [];

// Update the dropdown with the previously searched artists
updatePreviousArtistsDropdown(savedArtists);

































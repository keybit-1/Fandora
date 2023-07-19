// Replace with your MusicBrainz API key
const musicBrainzApiKey = 'YOUR_MUSICBRAINZ_API_KEY';
// Replace with your YouTube API key
const youtubeApiKey = 'AIzaSyCaeVUpevHapDi73iuIsADkoHbXKYynF3U';

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
      videoLinkElement.textContent = 'Watch the Music Video';

      // Append the link element to the video container
      const videoContainer = document.getElementById('videoContainer');
      videoContainer.appendChild(videoLinkElement);

      document.getElementById('videoSection').style.display = 'block';
    } else {
      alert('No music video found for the artist!');
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
        <h3>${artist.name}</h3>
        <p>Type: ${artist.type}</p>
        <p>Country: ${artist.country}</p>
        <p>Genre: ${genre}</p>
        <p>Birthdate: ${birthdate}</p>
        <p>Summary: ${summary}</p>
      `;
      document.getElementById('artistInfoSection').style.display = 'block';
    } else {
      alert('Artist not found!');
    }
  } catch (error) {
    console.log('Error fetching data:', error);
    // Handle the error appropriately
  }
}

// Attach event listener to search button
document.getElementById('searchBtn').addEventListener('click', searchArtist);
























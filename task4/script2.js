const apiKey = 'NSTu9w0uRgKjKA7WPsenU04tHw71EQnFPLXn7ebx';
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

document.addEventListener("DOMContentLoaded", () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById('apod-title').textContent = data.title;
      document.getElementById('apod-explanation').textContent = data.explanation;

      if (data.media_type === 'image') {
        const image = document.getElementById('apod-image');
        image.src = data.url;
        image.style.display = 'block';
      } else if (data.media_type === 'video') {
        const video = document.getElementById('apod-video');
        video.src = data.url;
        video.style.display = 'block';
      }
    })
    .catch(error => {
      document.getElementById('apod-title').textContent = "Error fetching data.";
      console.error("NASA API Error:", error);
    });
});

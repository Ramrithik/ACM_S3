document.getElementById('authorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const author = document.getElementById('authorInput').value.trim();
  if (!author) return;

  const dbRef = window.firebaseRef(window.firebaseDB);
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '<li>Searching...</li>';

  try {
    const snapshot = await window.firebaseGet(window.firebaseChild(dbRef, 'books/' + author.toLowerCase()));
    if (snapshot.exists()) {
      const books = snapshot.val();
      displayBooks(Object.values(books));
    } else {
      const res = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`);
      const data = await res.json();
      if (data.docs.length === 0) {
        bookList.innerHTML = '<li>No books found.</li>';
        return;
      }

      const books = data.docs.slice(0, 10).map(b => b.title);
      const bookObj = {};
      books.forEach((title, idx) => bookObj[idx] = title);
      await window.firebaseSet(window.firebaseRef(window.firebaseDB, 'books/' + author.toLowerCase()), bookObj);
      displayBooks(books);
    }
  } catch (error) {
    bookList.innerHTML = '<li>Error loading data.</li>';
    console.error(error);
  }
});

function displayBooks(books) {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';
  books.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;
    bookList.appendChild(li);
  });
}

const pages = ['page1.html', 'page2.html']; // เพิ่มหน้าที่คุณต้องการค้นหา

function search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.getElementById('results').innerHTML = ''; // ล้างผลการค้นหาก่อนหน้า

    pages.forEach(page => {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const textContent = doc.body.textContent.toLowerCase();

                if (textContent.includes(query)) {
                    const title = doc.title || page;
                    const snippet = getSnippet(textContent, query);

                    displayResult(title, snippet, page);
                }
            })
            .catch(error => console.error('Error:', error));
    });
}

function getSnippet(content, query) {
    const queryIndex = content.indexOf(query);
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + 50);
    return content.substring(start, end);
}

function displayResult(title, snippet, url) {
    const resultsContainer = document.getElementById('results');
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');

    const resultTitle = document.createElement('h2');
    resultTitle.innerHTML = `<a href="${url}">${title}</a>`;
    resultItem.appendChild(resultTitle);

    const resultSnippet = document.createElement('p');
    resultSnippet.textContent = `...${snippet}...`;
    resultItem.appendChild(resultSnippet);

    resultsContainer.appendChild(resultItem);
}

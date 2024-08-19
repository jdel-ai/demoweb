const pages = ['index2.html', 'page2.html']; // เพิ่มหน้าที่คุณต้องการค้นหา
let searchResults = [];

function search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    searchResults = [];
    document.getElementById('results').innerHTML = ''; // ล้างผลการค้นหาก่อนหน้า

    pages.forEach(page => {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const textContent = doc.body.textContent || "";
                const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);

                lines.forEach((line, index) => {
                    if (line.toLowerCase().includes(query)) {
                        let result = {
                            title: doc.title,
                            snippet: getSnippet(lines, index, query),
                            url: page
                        };
                        searchResults.push(result);
                    }
                });

                displayResults();
            });
    });
}

function getSnippet(lines, index, query) {
    let start = Math.max(0, index - 1); // บรรทัดก่อนหน้า
    let end = Math.min(lines.length, index + 2); // บรรทัดหลัง

    return lines.slice(start, end).join(' ... ').replace(query, `<strong>${query}</strong>`);
}

function displayResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<p>ไม่พบผลลัพธ์</p>';
    } else {
        searchResults.forEach(result => {
            let resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            let title = document.createElement('h2');
            title.innerHTML = `<a href="${result.url}">${result.title}</a>`;

            let snippet = document.createElement('p');
            snippet.innerHTML = result.snippet;

            resultItem.appendChild(title);
            resultItem.appendChild(snippet);

            resultsContainer.appendChild(resultItem);
        });
    }
}

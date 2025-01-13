document.addEventListener("DOMContentLoaded", function() {
    const pages = [
        { title: "ทางภาระจำยอม", url: "page1.html" },
        { title: "กรรมสิทธิสิ่งปลูกสร้าง", url: "page2.html" },
        { title: "ประเด็นอื่นๆ", url: "page3.html" },
        { title: "ป่าไม้", url: "forest.html" } // เพิ่มหน้าใหม่ที่นี่
    ];

    document.querySelector('.search-button').addEventListener('click', function() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        if (!searchInput.trim()) {
            document.getElementById('resultContainer').innerHTML = '<p>กรุณาป้อนคำค้นหา.</p>';
            return;
        }

        let foundResults = false;
        let fetchPromises = [];

        pages.forEach(page => {
            fetchPromises.push(
                fetch(page.url)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.text();
                    })
                    .then(content => {
                        const lowerContent = content.toLowerCase();
                        const index = lowerContent.indexOf(searchInput);
                        if (index !== -1) {
                            foundResults = true;
                            const before = content.substring(0, index).split('\n');
                            const after = content.substring(index + searchInput.length).split('\n');

                            const resultDiv = document.createElement('div');
                            resultDiv.classList.add('result');

                            let displayText = "";
                            if (before.length > 1) {
                                displayText += `<p>${before[before.length - 2]}</p>`;
                            }
                            displayText += `<p>${before[before.length - 1]}</p>`;
                            displayText += `<p><mark>${content.substring(index, index + searchInput.length)}</mark></p>`;
                            if (after.length > 0) {
                                displayText += `<p>${after[0]}</p>`;
                            }
                            if (after.length > 1) {
                                displayText += `<p>${after[1]}</p>`;
                            }

                            resultDiv.innerHTML = `<h3><a href="${page.url}" target="_blank">${page.title}</a></h3>${displayText}`;
                            document.getElementById('resultContainer').appendChild(resultDiv);
                        }
                    })
                    .catch(error => {
                        console.error('Error loading page:', error);
                    })
            );
        });

        Promise.all(fetchPromises).then(() => {
            if (!foundResults) {
                document.getElementById('resultContainer').innerHTML = '<p>ไม่พบผลลัพธ์ที่ตรงกัน</p>';
            }
        });
    });
});

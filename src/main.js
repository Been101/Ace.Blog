const ISSUSES_URL = 'https://api.github.com/repos/Been101/Ace.Blog/issues'
const NAV = document.querySelector('.nav')

fetch(ISSUSES_URL).then(data => {return data.json()}).then(issues => {
    let html = ''
    issues.forEach(issue => {
        html += `<li>
            <span id = '${issue.number}'>${issue.title}</span>
        </li>
        `
    });

    NAV.innerHTML = html
})

function getIssue(id) {
    const ISSUSE_URL = `${ISSUSES_URL}/${id}`
    fetch(ISSUSE_URL).then(data => {return data.json()}).then(issue => {
    md2html(issue.body)
})
}

function md2html(MD_TEXT) {
    document.querySelector('.content').innerHTML = marked(MD_TEXT)
}

NAV.addEventListener('click', (e) => {
    if(e.target.tagName === 'SPAN'){
        const id = e.target.id
        getIssue(id)
    }
})
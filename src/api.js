const url = 'https://api.covid19api.com/total/country/peru'

function getCases() {
    return fetch(url)
        .then(res => res.json())
        //.then(res => res.data)
}

export default {
    getCases,
}

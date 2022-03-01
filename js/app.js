const getInputValue = () => {
    const searchField = document.getElementById('search-field');
    const searchFieldValue = searchField.value;
    searchField.value = '';
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchFieldValue}`;
    return url;
}
const getAPI = (url, isDisplay, isDetails) => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (isDisplay) {
                displayPhone(data);
            }
            else if (isDetails) {
                phoneDetails(data);
            }
        })
}
const displayPhone = data => {
    data.data.forEach(phone => {
        const detailsUrl = `https://openapi.programming-hero.com/api/phone/${phone.slug}`;
        const displayPhone = document.getElementById('display-phone');
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
            <div class="card h-100">
                <img src="${phone.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${phone.phone_name}</h5>
                    <h6>Brand: ${phone.brand}</h6>
                    <a onclick="phoneDetails(${detailsUrl})" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        `;
        displayPhone.appendChild(div);
    });
}

const phoneDetails = data => {
    getAPI(data, false, true);
}
document.getElementById('search-button').addEventListener('click', () => {
    getAPI(getInputValue(), true, false);
});
document.getElementById('search-field').addEventListener('keyup', event => {
    // using deprecated property -_-
    if (event.keyCode == 13) {
        getAPI(getInputValue(), true, false);
    }
});
// document.getElementById('detail-info').addEventListener('click', () => {

// })

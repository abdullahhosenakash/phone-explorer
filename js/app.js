// global variables
const spinner = document.getElementById('spinner');
const notFound = document.getElementById('not-found');
const searchButton = document.getElementById('search-button');
const searchField = document.getElementById('search-field');
const searchedItems = document.getElementById('display-phone');
const parrentPhoneDetails = document.getElementById('phone-details');
const showAllButton = document.getElementById('show-all-button');
const showLessButton = document.getElementById('show-less-button');
const showAllButtonClicked = document.getElementById('show-all-button-clicked');
const showLessButtonClicked = document.getElementById('show-less-button-clicked');

// get search url 
const getInputValue = () => {
    const searchFieldValue = searchField.value;
    searchField.value = '';
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchFieldValue}`;
    return url;
}
// convert api
const getAPI = (url, isDisplay = false, isDetails = true) => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (isDisplay) {
                displayPhone(data);
            }
            else if (isDetails) {
                clearItems(parrentPhoneDetails);
                phoneDetails(data.data);
            }
        })
}
// command to display phone section 
const displayPhone = data => {
    // if phone not found 
    if (data.status === false) {
        notFound.style.display = 'block';
        spinner.style.display = 'none';
        searchButton.setAttribute('disabled', true);
        clearItems(searchedItems);
        clearItems(showAllButton);
        clearItems(showLessButton);
    }
    // display max 20 phone or all 
    else {
        const phoneQuantity = data.data;
        if (phoneQuantity.length > 20) {
            newDisplayPhone(phoneQuantity.slice(0, 20), true);
            showAllButtonClicked.addEventListener('click', () => {
                newDisplayPhone(phoneQuantity.slice(20, phoneQuantity.length - 1), false, true);
            });
            showLessButtonClicked.addEventListener('click', () => {
                clearItems(searchedItems);
                newDisplayPhone(phoneQuantity.slice(0, 20), true);
            });
        }
        else {
            newDisplayPhone(data.data);
        }
    }
}
// searched phone display section 
const newDisplayPhone = (phoneQuantity, isShowAllButton = false, isShowLessButton = false) => {
    phoneQuantity.forEach(phone => {
        const detailsUrl = `https://openapi.programming-hero.com/api/phone/${phone.slug}`;

        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card">
            <img src="${phone.image}" class="card-img-top pt-2 px-2" alt="...">
            <div class="card-body">
                <h5 class="card-title fw-bold">${phone.phone_name}</h5>
                <h6>Brand: ${phone.brand}</h6>
                <a href="#" onclick="getAPI('${detailsUrl}')" class="btn btn-primary">Details</a>
            </div>
        </div>
    `;
        spinner.style.display = 'none';
        searchedItems.appendChild(div);
    });
    if (isShowAllButton) {
        showAllButton.style.display = 'block';
        showLessButton.style.display = 'none';
    }
    else if (isShowLessButton) {
        showLessButton.style.display = 'block';
        showAllButton.style.display = 'none';
    }
}
// clear previous result
const clearItems = item => {
    item.textContent = '';
}
// detailed information 
const phoneDetails = data => {
    clearItems(parrentPhoneDetails);
    spinner.style.display = 'block';
    let releaseDate = "";
    if (data.releaseDate !== "") {
        releaseDate = data.releaseDate;
    }
    else {
        releaseDate = 'No Release Date found';
    }

    const div = document.createElement('div');
    div.classList.add('card', 'my-5', 'details-width', 'mx-auto');
    div.innerHTML = `
    <img src="${data.image}" class="card-img-top w-50 mx-auto pt-3" alt="...">
    <div class="card-body" id="other-info">
        <h5 class="card-title fw-bold">${data.name}</h5>
        <h5>Brand: ${data.brand}</h5>
        <p class="m-1"><b>Release Date:</b> ${releaseDate}</p>
        <p class="m-1"><b>Main Features:</b> 
            <ul>
                <li><b>Chipset:</b> ${data.mainFeatures.chipSet}</li>
                <li><b>Display Size:</b> ${data.mainFeatures.displaySize}</li>
                <li><b>Memory:</b> ${data.mainFeatures.memory}</li>
                <li><b>Storage:</b> ${data.mainFeatures.storage}</li>
                <li><b>Sensors:</b> ${data.mainFeatures.sensors}</li>
            </ul>
        </p>
        <p class="m-1">
        </p>
    </div>
    `;
    parrentPhoneDetails.appendChild(div);

    if (data.others !== undefined) {
        const otherInfo = document.getElementById('other-info');
        const p = document.createElement('p');
        p.classList.add('m-1');
        p.innerHTML = `
            <b>Others:</b> 
            <ul>
                <li><b>Bluetooth:</b> ${data.others.Bluetooth}</li>
                <li><b>GPS Size:</b> ${data.others.GPS}</li>
                <li><b>NFC:</b> ${data.others.NFC}</li>
                <li><b>Radio:</b> ${data.others.Radio}</li>
                <li><b>USB:</b> ${data.others.USB}</li>
                <li><b>WLAN:</b> ${data.others.WLAN}</li>
            </ul>
        `;
        otherInfo.appendChild(p);
    }
    spinner.style.display = 'none';
};

// search button click 
searchButton.addEventListener('click', () => {
    spinner.style.display = 'block';
    clearItems(parrentPhoneDetails);
    clearItems(searchedItems);
    getAPI(getInputValue(), true, false);
    notFound.style.display = 'none';
    if (searchField.value === '') {
        searchButton.setAttribute('disabled', true);
    }
});
// detecting input field 
searchField.addEventListener('keyup', event => {
    // if input field is empty, search button disabled
    searchButton.removeAttribute('disabled');
    if (searchField.value === '') {
        searchButton.setAttribute('disabled', true);

    }// using deprecated property to detect the keyboard's Enter button. Yet to learn updated system  -_-
    if (event.keyCode == 13) {
        spinner.style.display = 'block';
        clearItems(parrentPhoneDetails);
        clearItems(searchedItems);
        getAPI(getInputValue(), true, false);
        notFound.style.display = 'none';
    }
});
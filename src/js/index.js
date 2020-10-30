import '../scss/style.scss';
import debounce from './debounce';



const searchInput = document.querySelector('.search__input');
const suggestList = document.querySelector('.search__suggest');
const resultList = document.querySelector('.result__list');

const responseHandler = (response) => {
    suggestList.append(createSuggest(response));
    suggestList.addEventListener('click', (event) => {
        const item = event.target;
        chooseSuggest(item);
    })
}


const createSuggest = (response) => {
    let suggestList = new DocumentFragment();
    let suggestArr = [];
    
    response.items.forEach(({ name, owner, stargazers_count}) => {
        let item = document.createElement('li');
        item.classList.add('search__suggest-item');
        item.textContent = name;

        item.dataset.name = name;
        item.dataset.owner = owner.login;
        item.dataset.stars = stargazers_count;

        suggestArr.push(item);

        if (suggestArr.length === 5) {
            suggestList.append(...suggestArr);
            return suggestList;
        };
        
    })
    return suggestList;
}

const chooseSuggest = (item) => {
    const name = item.dataset.name;
    const owner = item.dataset.owner;
    const stars = item.dataset.stars;
    
    let card = document.createElement('li');
    let cardInfo = document.createElement('div');
    let closeBtn = document.createElement('button');
    let cardInfoText = `<h2 class="card__name">${name}</h2>
    <p class="card__owner"><span>Owner: </span>${owner}</p>
    <p class="card__stars"><span>Stars: </span>${stars}</p>`;

    card.classList.add('card');
    closeBtn.classList.add('close-btn');
    cardInfo.classList.add('card__info');

    card.insertAdjacentElement('afterbegin', closeBtn);
    card.insertAdjacentElement('beforeend', cardInfo);
    cardInfo.insertAdjacentHTML('beforeend', cardInfoText);

    closeBtn.addEventListener('click', (event) => {
        event.target.parentNode.parentNode.removeChild(event.target.parentNode)
    })

    resultList.insertAdjacentElement('afterbegin', card);
}

const fetchResponse = async function (value) {
    await fetch(`https://api.github.com/search/repositories?q=${value}`, {
        method: "GET",
        headers: { "Content-Type": "application/vnd.github.mercy-preview+json" },
    })
    .then(response => response.json())
    .then((response) => responseHandler(response));
};

searchInput.addEventListener('input', event => {
    suggestList.innerHTML = "";
    debounceFetch();
});




const debounceFetch = debounce(async () => await fetchResponse(searchInput.value), 500);

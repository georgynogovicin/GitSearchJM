import '../scss/style.scss';
import * as elements from './elements';
import debounce from './debounce'; 









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


const debounceFetch = debounce(async () => await fetchResponse(elements.searchInput.value), 500);

elements.searchInput.addEventListener('input', event => {
    elements.suggestList.innerHTML = "";
    debounceFetch();
});

const fetchResponse = async function (value) {
    await fetch(`https://api.github.com/search/repositories?q=${value}`, {
        method: "GET",
        headers: { "Content-Type": "application/vnd.github.mercy-preview+json" },
    })
    .then(response => response.json())
    .then((response) => responseHandler(response));
};

const responseHandler = (response) => {
    elements.suggestList.append(createSuggest(response));
    elements.suggestList.addEventListener('click', (event) => {
        const item = event.target;
        addToResult(item);
        elements.searchInput.value = '';
        elements.suggestList.innerHTML = '';
    }, {once: true})
}

const addToResult = (item) => {
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

    closeBtn.addEventListener('click', (event) => {
        event.target.parentNode.parentNode.removeChild(event.target.parentNode)
    })

    card.insertAdjacentElement('afterbegin', closeBtn);
    card.insertAdjacentElement('beforeend', cardInfo);
    cardInfo.insertAdjacentHTML('beforeend', cardInfoText);

    

    elements.resultList.insertAdjacentElement('afterbegin', card);
}


elements.searchInput.addEventListener('input', event => {
    elements.suggestList.innerHTML = "";
    debounceFetch();
});



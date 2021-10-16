const app = document.getElementById('app');
let fetchedStocks = null;

const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', (e) => {
    if(fetchedStocks) {
        // search using regex for Symbol
        let matched_stock = fetchedStocks.filter(stock => {
            const reg1 = "[a-zA-Z0-9]*";
            const regex = new RegExp(searchInput.value.toUpperCase() + reg1);
            return stock.symbol.match(regex);
        });

        let matched_name = fetchedStocks.filter(stock => {
            const reg1 = "[a-zA-Z0-9]*";
            const regex = new RegExp(searchInput.value.toUpperCase() + reg1);
            return stock.name.toUpperCase().match(regex);
        });
        
        const joined_array = matched_stock.concat(matched_name);

        // remove the duplicates
        let final_search_results = joined_array.filter((item, index) => {
            return joined_array.indexOf(item) === index;
        });

        displayData(final_search_results);
        clearLinks();
    }
});

const createCard = (stock) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const arrowChange = stock.percent_change < 0 ? `<i class='bx bx-caret-down' ></i>` : `<i class='bx bx-caret-up' ></i>`; 
    const classChange = stock.percent_change < 0 ? 'red' : 'green';
    card.classList.add(classChange);

    const content = `
        <h3>${stock.symbol}</h3>
        <h2>${stock.price.amount.toLocaleString()} <span class="small">${arrowChange}${stock.percent_change}%</span></h2>
        <div>${stock.name}</div>
        <div>Volume: ${stock.volume.toLocaleString()}</div>
        <div>Value: ${(stock.volume * stock.price.amount).toLocaleString()}</div>
    `
    card.innerHTML = content;
    app.append(card);
}

const displayData = (stocks) => {
    app.innerHTML = '';
    if(stocks.length > 0) {
        stocks.forEach(stock => {
            createCard(stock);
        }); 
    } else {
        app.innerHTML = 'Stock not found.';
    }
}


const links = document.getElementsByClassName('link-item');
Array.from(links).forEach(link => {
    link.addEventListener('click', function(){
        clearLinks();
        const stocks = sortBy(this.id, 5);
        displayData(stocks);
        this.classList.add('active');
    });
});

const getActive = (stocks, n=5) => {
    stocks.sort((a, b) => b.volume * b.price.amount - a.volume * a.price.amount);
    return stocks.slice(0, n);
}

const getBest = (stocks, n=5) => {
    stocks.sort((a, b) => b.percent_change - a.percent_change);
    return stocks.slice(0, n);
}

const getWorst = (stocks, n=5) => {
    stocks.sort((a, b) => a.percent_change - b.percent_change);
    return stocks.slice(0, n);
}

const getAlphabetic = (stocks) => {
    stocks.sort((a, b) => a.symbol - b.symbol);
    return stocks;
}

const sortBy = (type, n) => {
    switch(type) {
        case 'active':
            return getActive(fetchedStocks, n);
        case 'best':
            return getBest(fetchedStocks, n);
        case 'worst':
            return getWorst(fetchedStocks, n);
    }
}

const allLink = document.getElementById('all');
allLink.addEventListener('click', () => {
    clearLinks();
    getData();
    allLink.classList.add('active');
});

const clearLinks = () => {
    const links = document.querySelectorAll('#status ul a');
    links.forEach( link => {
        link.classList.remove('active');
    });
}

function getData()
{
    allLink.classList.add('active');
    fetch('http://phisix-api4.appspot.com/stocks.json')
        .then(response => response.json())
        .then(data => { 
            fetchedStocks = data.stock;
            displayData(data.stock);
        })
        .catch(err => {
            app.innerHTML = 'Something wrong with the back end.';
        });
}

getData();

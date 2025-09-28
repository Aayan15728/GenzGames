document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const balanceElement = document.getElementById('balance');
    const endMessage = document.getElementById('end-message');
    const receiptItemsElement = document.getElementById('receipt-items');
    const totalCostElement = document.getElementById('total-cost');

    let balance = 300000000000;
    let receipt = {};

    const items = [
        { name: 'iPhone', price: 1000, image: '1' },
        { name: 'MacBook', price: 2000, image: '2' },
        { name: 'Coffee', price: 5, image: '3' },
        { name: 'Burger', price: 10, image: '4' },
        { name: 'Rolex', price: 10000, image: '5' },
        { name: 'Lamborghini', price: 300000, image: '6' },
        { name: 'Mansion', price: 5000000, image: '7' },
        { name: 'Yacht', price: 10000000, image: '8' },
        { name: 'Private Jet', price: 50000000, image: '9' },
        { name: 'NBA Team', price: 2000000000, image: '10' },
        { name: 'Cruise Ship', price: 1000000000, image: '11' },
        { name: 'Make a Movie', price: 100000000, image: '12' },
        { name: 'Build a Stadium', price: 1500000000, image: '13' },
        { name: 'Social Media Platform', price: 44000000000, image: '14' },
        { name: 'Skyscraper', price: 1000000000, image: '15' },
        { name: 'Mona Lisa', price: 800000000, image: '16' },
        { name: 'Gold Bar', price: 700000, image: '17' },
        { name: 'Diamond Ring', price: 500000, image: '18' },
        { name: 'Helicopter', price: 2000000, image: '19' },
        { name: 'F1 Team', price: 1000000000, image: '20' },
        { name: 'Super Bowl Ad', price: 7000000, image: '21' },
        { name: 'Private Island', price: 100000000, image: '22' },
        { name: 'Rocket to Mars', price: 10000000000, image: '23' },
        { name: 'MGM Grand Las Vegas', price: 6000000000, image: '24' },
        { name: 'Eiffel Tower', price: 50000000000, image: '25' },
        { name: 'Statue of Liberty', price: 1000000000, image: '26' },
        { name: 'Great Wall of China', price: 95000000000, image: '27' },
        { name: 'Amazon Rainforest', price: 100000000000, image: '28' },
        { name: 'Antarctica', price: 200000000000, image: '29' },
        { name: 'The Moon', price: 250000000000, image: '30' },
        { name: 'Netflix Subscription for Life', price: 15000, image: '31' },
        { name: 'Spotify Subscription for Life', price: 10000, image: '32' },
        { name: 'Amazon Prime for Life', price: 12000, image: '33' },
        { name: 'Disneyland', price: 8000000000, image: '34' },
        { name: 'Starry Night Painting', price: 100000000, image: '35' },
        { name: 'Air Jordans', price: 200, image: '36' },
        { name: 'Tesla Model S', price: 100000, image: '37' },
        { name: 'CyberTruck', price: 70000, image: '38' },
        { name: 'Starlink Internet', price: 500, image: '39' },
        { name: 'Boring Company Flamethrower', price: 500, image: '40' },
        { name: 'Dogecoin', price: 1, image: '41' },
        { name: 'Twitter (X)', price: 44000000000, image: '42' },
        { name: 'Neuralink Implant', price: 100000, image: '43' },
        { name: 'SpaceX Falcon 9 Rocket', price: 62000000, image: '44' },
        { name: 'Starship', price: 2000000000, image: '45' },
        { name: 'Giga Texas', price: 10000000000, image: '46' },
        { name: 'SolarCity', price: 2600000000, image: '47' },
        { name: 'OpenAI', price: 80000000000, image: '48' },
        { name: 'Zip2', price: 307000000, image: '49' },
        { name: 'PayPal', price: 1500000000, image: '50' }
    ];

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function updateBalance() {
        balanceElement.textContent = formatCurrency(balance);
        if (balance <= 0) {
            endMessage.classList.remove('hidden');
        }
    }

    function updateReceipt() {
        receiptItemsElement.innerHTML = '';
        let totalCost = 0;
        for (const itemName in receipt) {
            const item = receipt[itemName];
            const li = document.createElement('li');
            li.textContent = `${itemName} x${item.quantity} - ${formatCurrency(item.cost)}`;
            receiptItemsElement.appendChild(li);
            totalCost += item.cost;
        }
        totalCostElement.textContent = formatCurrency(totalCost);
    }

    function renderItems() {
        items.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                <img src="https://picsum.photos/200/200?random=${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">${formatCurrency(item.price)}</p>
                <div class="quantity-selector">
                    <button class="minus-btn" data-index="${index}">-</button>
                    <span class="quantity">1</span>
                    <button class="plus-btn" data-index="${index}">+</button>
                </div>
                <button class="buy-button" data-index="${index}">Buy</button>
                <p class="owned">Owned: 0</p>
            `;
            itemsContainer.appendChild(itemCard);
        });
    }

    itemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;
        if (!index) return;

        const itemCard = target.closest('.item-card');
        const quantityElement = itemCard.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);

        if (target.classList.contains('plus-btn')) {
            quantity++;
        } else if (target.classList.contains('minus-btn')) {
            if (quantity > 1) {
                quantity--;
            }
        } else if (target.classList.contains('buy-button')) {
            const item = items[index];
            const cost = item.price * quantity;
            if (balance >= cost) {
                balance -= cost;
                const ownedElement = itemCard.querySelector('.owned');
                const currentOwned = parseInt(ownedElement.textContent.split(' ')[1]);
                ownedElement.textContent = `Owned: ${currentOwned + quantity}`;

                if (receipt[item.name]) {
                    receipt[item.name].quantity += quantity;
                    receipt[item.name].cost += cost;
                } else {
                    receipt[item.name] = {
                        quantity: quantity,
                        cost: cost
                    };
                }

                updateBalance();
                updateReceipt();
            } else {
                alert("You don't have enough money!");
            }
            quantity = 1;
        }
        quantityElement.textContent = quantity;
    });

    renderItems();
    updateBalance();
});

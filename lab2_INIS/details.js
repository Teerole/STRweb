document.addEventListener('DOMContentLoaded', function() {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt'));
    const detailsContainer = document.getElementById('shirt-details');

    if (shirt) {
        const title = shirt.name || 'Unnamed Shirt';
        const description = shirt.description || 'No description available';
        const price = shirt.price || 'Price not available';
        const colors = shirt.colors || {};

        function updateImages(color) {
            const frontImg = colors[color] ? colors[color].front : shirt.default.front;
            const backImg = colors[color] ? colors[color].back : shirt.default.back;
            document.getElementById('front-img').src = frontImg;
            document.getElementById('back-img').src = backImg;
        }

        const colorButtons = Object.keys(colors).map(color => {
            return `<button class="color-btn" data-color="${color}" style="background-color: ${color}; width: 30px; height: 30px; border: none; margin: 5px;"></button>`;
        }).join('');

        detailsContainer.innerHTML = `
            <h2>${title}</h2>
            <img id="front-img" src="" alt="${title} front">
            <img id="back-img" src="" alt="${title} back">
            <p>${description}</p>
            <p>Price: ${price}</p>
            <div>Colors: ${colorButtons}</div>
        `;

        const firstColor = Object.keys(colors)[0] || 'default';
        updateImages(firstColor);

        document.querySelectorAll('.color-btn').forEach(button => {
            button.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                updateImages(color);
            });
        });
    } else {
        detailsContainer.innerHTML = '<p>No shirt selected.</p>';
    }
});
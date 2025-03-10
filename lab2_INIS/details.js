document.addEventListener('DOMContentLoaded', function() {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt')); // Извлекаем данные о футболке
    const detailsContainer = document.getElementById('shirt-details');

    if (shirt) {
        // Извлекаем данные из объекта футболки
        const title = shirt.name || 'Unnamed Shirt';
        const description = shirt.description || 'No description available';
        const price = shirt.price || 'Price not available';
        const colors = shirt.colors || {};

        // Берём изображения для первого доступного цвета
        const firstColor = Object.keys(colors)[0] || 'default';
        const frontImg = colors[firstColor] ? colors[firstColor].front : shirt.default.front;
        const backImg = colors[firstColor] ? colors[firstColor].back : shirt.default.back;

        // Генерируем цветные кнопки
        const colorButtons = Object.keys(colors).map(color => {
            return `<button style="background-color: ${color}; width: 30px; height: 30px; border: none; margin: 5px;"></button>`;
        }).join('');

        // Вставляем контент в контейнер
        detailsContainer.innerHTML = `
            <h2>${title}</h2>
            <img src="${frontImg}" alt="${title} front">
            <img src="${backImg}" alt="${title} back">
            <p>${description}</p>
            <p>Price: ${price}</p>
            <div>Colors: ${colorButtons}</div>
        `;
    } else {
        detailsContainer.innerHTML = '<p>No shirt selected.</p>';
    }
});
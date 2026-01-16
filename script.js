document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Инициализация карты (Leaflet)
    // Центр Европы по умолчанию
    var map = L.map('mapContainer', {
        zoomControl: false, // Убираем кнопки зума для чистоты
        attributionControl: false
    }).setView([50.1109, 8.6821], 5);

    // Добавляем красивый черно-белый слой карты
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    var currentMarker = null;

    // 2. Настройка Observer (Наблюдателя)
    // Он смотрит, какая секция сейчас на экране
    
    const steps = document.querySelectorAll('.step');
    const passportImg = document.getElementById('passportImage');
    const mapFrame = document.getElementById('mapContainer');
    const dateLabel = document.getElementById('stampDate');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Срабатывает, когда блок посередине экрана
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateVisuals(entry.target);
            }
        });
    }, observerOptions);

    steps.forEach(step => {
        observer.observe(step);
    });

    // 3. Функция обновления контента
    function updateVisuals(section) {
        // Данные из HTML атрибутов (data-...)
        const img = section.getAttribute('data-img');
        const lat = parseFloat(section.getAttribute('data-lat'));
        const lng = parseFloat(section.getAttribute('data-lng'));
        const zoom = parseInt(section.getAttribute('data-zoom'));
        const showMap = section.getAttribute('data-show-map');

        // А. Меняем скан паспорта (плавно)
        passportImg.style.opacity = 0;
        setTimeout(() => {
            passportImg.src = img;
            passportImg.style.opacity = 1;
        }, 300);

        // Б. Управляем картой
        if (showMap === "true") {
            mapFrame.style.opacity = 1;
            map.flyTo([lat, lng], zoom, { duration: 1.5 });
            
            // Перемещаем маркер
            if (currentMarker) map.removeLayer(currentMarker);
            currentMarker = L.marker([lat, lng]).addTo(map);
        } else {
            // Если карта не нужна (на обложке)
            mapFrame.style.opacity = 0;
        }

        // В. Метаданные (можно усложнить)
        // dateLabel.innerText = "Архивный ID: " + Math.floor(Math.random() * 10000); 
    }
});

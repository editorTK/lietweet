document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const tweetForm = document.getElementById('tweet-form');
    const tweetCard = document.getElementById('tweet-card');
    const imageUpload = document.getElementById('optional-image-upload');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const tweetStyleSelect = document.getElementById('tweet-style');
    const realisticOptionsDiv = document.getElementById('realistic-options');
    const themeSelector = document.getElementById('theme-selector');

    let optionalImageHTML = '';

    // Manejar la carga de imágenes
    imageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                optionalImageHTML = `<img class="tweet-image" src="${e.target.result}" alt="Imagen del tweet">`;
            }
            reader.readAsDataURL(this.files[0]);
        } else {
            optionalImageHTML = '';
        }
    });

    // Mostrar/ocultar opciones realistas
    tweetStyleSelect.addEventListener('change', function() {
        if (this.value === 'realistic') {
            realisticOptionsDiv.style.display = 'block';
        } else {
            realisticOptionsDiv.style.display = 'none';
        }
    });

    // Cambiar tema
    themeSelector.addEventListener('change', function() {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(this.value + '-theme');
    });

    // Formatear números para miles y millones
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num;
    }

    tweetForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const tweetText = document.getElementById('tweet-text').value;
        const tweetStyle = tweetStyleSelect.value;

        const verificationIconImg = `<img src="https://img.freepik.com/vector-premium/icono-vector-verificado-verificacion-cuenta-icono-verificacion_564974-1246.jpg" class="verification-img" alt="Verificado">`;
        
        let tweetContent = '';

        if (tweetStyle === 'simple') {
            tweetCard.classList.remove('realistic-style');
            tweetContent = `
                <div class="tweet-header">
                    <img class="profile-pic" src="gato.jpg" alt="Foto de perfil">
                    <div class="user-info">
                        <div class="display-name-group">
                            <span class="display-name">Gatito Sentimental</span>
                            ${verificationIconImg}
                        </div>
                        <span class="username">@${username}</span>
                    </div>
                </div>
                <div class="tweet-body">
                    <p>${tweetText}</p>
                    ${optionalImageHTML}
                </div>
            `;
        } else if (tweetStyle === 'realistic') {
            tweetCard.classList.add('realistic-style');
            const likes = formatNumber(parseInt(document.getElementById('likes').value));
            const reposts = formatNumber(parseInt(document.getElementById('reposts').value));
            const comments = formatNumber(parseInt(document.getElementById('comments').value));
            const views = formatNumber(parseInt(document.getElementById('views').value));

            // Obtener fecha y hora actual en formato de tweet (ej. "6:00 PM · 16 jun. 2025")
            const now = new Date();
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
            const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedTime = now.toLocaleTimeString('es-ES', timeOptions);
            const formattedDate = now.toLocaleDateString('es-ES', dateOptions);

            tweetContent = `
                <div class="tweet-header">
                    <img class="profile-pic" src="gato.jpg" alt="Foto de perfil">
                    <div class="user-info">
                        <div class="display-name-group">
                            <span class="display-name">Gatito Sentimental</span>
                            ${verificationIconImg}
                        </div>
                        <span class="username">@${username}</span>
                    </div>
                </div>
                <div class="tweet-body">
                    <p>${tweetText}</p>
                    ${optionalImageHTML}
                </div>
                <div class="tweet-timestamp">
                    <span>${formattedTime} · ${formattedDate}</span>
                </div>
                <div class="tweet-info-stats">
                    ${reposts !== '0' ? `<span><span class="stat-number">${reposts}</span> Reposts</span>` : ''}
                    ${likes !== '0' ? `<span><span class="stat-number">${likes}</span> Me gusta</span>` : ''}
                    ${views !== '0' ? `<span><span class="stat-number">${views}</span> Vistas</span>` : ''}
                </div>
                <div class="tweet-interactions">
                    <div class="icon-wrapper"><i class="far fa-comment"></i></div>
                    <div class="icon-wrapper"><i class="fas fa-retweet"></i></div>
                    <div class="icon-wrapper"><i class="far fa-heart"></i></div>
                    <div class="icon-wrapper"><i class="fas fa-chart-simple"></i></div>
                    <div class="icon-wrapper"><i class="far fa-bookmark"></i></div>
                    <div class="icon-wrapper"><i class="fas fa-share-nodes"></i></div>
                </div>
            `;
        }
            
        tweetCard.innerHTML = tweetContent;
        
        formContainer.style.display = 'none';
        tweetCard.style.display = 'block';
        backToFormBtn.style.display = 'block';
    });

    backToFormBtn.addEventListener('click', function() {
        formContainer.style.display = 'block';
        tweetCard.style.display = 'none';
        backToFormBtn.style.display = 'none';

        tweetForm.reset();
        imageUpload.value = '';
        optionalImageHTML = '';
        tweetCard.classList.remove('realistic-style'); // Asegura que se quite la clase de estilo realista
        realisticOptionsDiv.style.display = 'none'; // Oculta las opciones realistas al volver
        document.body.classList.remove('dark-theme'); // Vuelve al tema claro por defecto
        document.body.classList.add('light-theme');
        themeSelector.value = 'light'; // Restablece el selector de tema
        tweetStyleSelect.value = 'simple'; // Restablece el selector de estilo
    });
});



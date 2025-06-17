document.addEventListener('DOMContentLoaded', async () => {
    if (!puter.auth.isSignedIn()) {
        await puter.auth.signIn();
    }
    const formContainer = document.getElementById('form-container');
    const tweetForm = document.getElementById('tweet-form');
    const tweetCard = document.getElementById('tweet-card');
    const imageUpload = document.getElementById('optional-image-upload');
    const profileImageUpload = document.getElementById('profile-image-upload');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const tweetStyleSelect = document.getElementById('tweet-style');
    const realisticOptionsDiv = document.getElementById('realistic-options');
    const themeSelector = document.getElementById('theme-selector');
    const changeProfilePicBtn = document.getElementById('change-profile-pic-btn');
    const changeDisplayNameBtn = document.getElementById('change-display-name-btn');
    const changeUsernameBtn = document.getElementById('change-username-btn');
    const advancedBtn = document.getElementById('advanced-btn');
    const advancedSettings = document.getElementById('advanced-settings');
    const includeCheck = document.getElementById('include-check');

    let optionalImageHTML = '';
    let profileImageURL = '';
    const displayNameInput = document.getElementById('display-name');
    const usernameInput = document.getElementById('username');

    if (puter && puter.auth.isSignedIn()) {
        try {
            const storedPic = await puter.kv.get('profilePic');
            if (storedPic) {
                profileImageURL = storedPic;
                profileImageUpload.style.display = 'none';
                document.querySelector("label[for='profile-image-upload']").style.display = 'none';
                changeProfilePicBtn.style.display = 'block';
            }
            const storedName = await puter.kv.get('displayName');
            if (storedName) {
                displayNameInput.value = storedName;
                displayNameInput.style.display = 'none';
                document.querySelector("label[for='display-name']").style.display = 'none';
                changeDisplayNameBtn.style.display = 'block';
            }
            const storedUser = await puter.kv.get('username');
            if (storedUser) {
                usernameInput.value = storedUser;
                usernameInput.style.display = 'none';
                document.querySelector("label[for='username']").style.display = 'none';
                changeUsernameBtn.style.display = 'block';
            }
        } catch (e) {}
    }

    // Manejar la carga de imágenes del tweet
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

    // Subir la foto de perfil a Puter
    profileImageUpload.addEventListener('change', async function() {
        if (this.files && this.files[0]) {
            if (!puter.auth.isSignedIn()) {
                await puter.auth.signIn();
            }
            const reader = new FileReader();
            reader.onload = async function(e) {
                profileImageURL = e.target.result;
                await puter.kv.set('profilePic', profileImageURL);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    advancedBtn.addEventListener('click', function() {
        advancedSettings.style.display = advancedSettings.style.display === 'none' ? 'block' : 'none';
    });

    changeProfilePicBtn.addEventListener('click', () => {
        profileImageUpload.click();
    });

    changeDisplayNameBtn.addEventListener('click', async () => {
        const newName = prompt('Nuevo nombre a mostrar:', displayNameInput.value);
        if (newName) {
            displayNameInput.value = newName;
            await puter.kv.set('displayName', newName);
        }
    });

    changeUsernameBtn.addEventListener('click', async () => {
        const newUser = prompt('Nuevo nombre de usuario (sin @):', usernameInput.value);
        if (newUser) {
            usernameInput.value = newUser;
            await puter.kv.set('username', newUser);
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

    tweetForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const displayName = displayNameInput.value;
        await puter.kv.set('displayName', displayName);
        await puter.kv.set('username', username);
        const tweetText = document.getElementById('tweet-text').value;
        const tweetStyle = tweetStyleSelect.value;

        const verificationIconImg = includeCheck.checked ? `<img src="https://img.freepik.com/vector-premium/icono-vector-verificado-verificacion-cuenta-icono-verificacion_564974-1246.jpg" class="verification-img" alt="Verificado">` : '';
        
        let tweetContent = '';

        if (tweetStyle === 'simple') {
            tweetCard.classList.remove('realistic-style');
            tweetContent = `
                <div class="tweet-header">
                    <img class="profile-pic" src="${profileImageURL}" alt="Foto de perfil">
                    <div class="user-info">
                        <div class="display-name-group">
                            <span class="display-name">${displayName}</span>
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
                    <img class="profile-pic" src="${profileImageURL}" alt="Foto de perfil">
                    <div class="user-info">
                        <div class="display-name-group">
                            <span class="display-name">${displayName}</span>
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

    backToFormBtn.addEventListener('click', async function() {
        formContainer.style.display = 'block';
        tweetCard.style.display = 'none';
        backToFormBtn.style.display = 'none';

        tweetForm.reset();
        displayNameInput.value = await puter.kv.get('displayName') || '';
        usernameInput.value = await puter.kv.get('username') || '';
        imageUpload.value = '';
        profileImageUpload.value = '';
        optionalImageHTML = '';
        tweetCard.classList.remove('realistic-style'); // Asegura que se quite la clase de estilo realista
        realisticOptionsDiv.style.display = 'none'; // Oculta las opciones realistas al volver
        document.body.classList.remove('dark-theme'); // Vuelve al tema claro por defecto
        document.body.classList.add('light-theme');
        themeSelector.value = 'light'; // Restablece el selector de tema
        tweetStyleSelect.value = 'simple'; // Restablece el selector de estilo
        advancedSettings.style.display = 'none';
    });
});



// admin.js
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const addPostForm = document.getElementById('add-post-form');
const statusMessageDiv = document.getElementById('status-message');
const addAttachmentBtn = document.getElementById('add-attachment-btn');
const attachmentsContainer = document.getElementById('attachments-container');

// Seznam povolených e-mailových adres
const allowedEmails = [
    "karelcerny404@seznam.cz"
];

const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (allowedEmails.includes(user.email)) {
            userEmailSpan.textContent = user.email;
            loginSection.style.display = 'none';
            adminSection.style.display = 'block';
        } else {
            firebase.auth().signOut().then(() => {
                alert("Nemáte oprávnění k přístupu do admin sekce.");
            }).catch((error) => {
                console.error("Chyba při odhlášení:", error);
            });
            loginSection.style.display = 'block';
            adminSection.style.display = 'none';
        }
    } else {
        loginSection.style.display = 'block';
        adminSection.style.display = 'none';
    }
});

googleLoginBtn.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider)
    .then(() => {
        console.log("Přihlášení úspěšné.");
    })
    .catch((error) => {
        console.error("Chyba při přihlášení:", error);
        document.getElementById('login-error-message').textContent = "Chyba při přihlášení. Zkuste to znovu.";
    });
});

logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut()
    .then(() => {
        console.log("Odhlášení úspěšné.");
    })
    .catch((error) => {
        console.error("Chyba při odhlášení:", error);
    });
});

// Funkce pro přidání pole pro přílohu
function addAttachmentField() {
    const attachmentDiv = document.createElement('div');
    attachmentDiv.innerHTML = `
    <label>URL přílohy (GitHub):</label>
    <input type="url" class="attachment-url" required>
    <br>
    <label>Název souboru:</label>
    <input type="text" class="attachment-name" required>
    <br><br>
    `;
    attachmentsContainer.appendChild(attachmentDiv);
}

// Přidání prvního pole při načtení stránky
addAttachmentField();

// Tlačítko pro přidání dalšího pole
addAttachmentBtn.addEventListener('click', addAttachmentField);

// Událost pro odeslání formuláře
addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;

    const attachmentUrls = [];
    const attachmentNames = [];

    // Získání všech URL a názvů souborů
    document.querySelectorAll('.attachment-url').forEach(input => {
        if (input.value) {
            attachmentUrls.push(input.value);
        }
    });
    document.querySelectorAll('.attachment-name').forEach(input => {
        if (input.value) {
            attachmentNames.push(input.value);
        }
    });

    // Kontrola, zda jsou pole pro URL a názvy stejně dlouhé
    if (attachmentUrls.length !== attachmentNames.length) {
        statusMessageDiv.textContent = "Chyba: Počet URL a názvů příloh se neshoduje.";
        return;
    }

    // Kontrola, zda je zadána alespoň jedna příloha
    if (attachmentUrls.length === 0) {
        statusMessageDiv.textContent = "Prosím, přidejte alespoň jednu přílohu.";
        return;
    }

    try {
        await db.collection("posts").add({
            category: category,
            title: title,
            attachments: attachmentUrls,
            attachment_names: attachmentNames,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        statusMessageDiv.textContent = "Příspěvek úspěšně přidán!";
        addPostForm.reset();
        attachmentsContainer.innerHTML = ''; // Vyčistí formulář
        addAttachmentField(); // Přidá první pole pro novou přílohu

    } catch (error) {
        console.error("Chyba při přidávání příspěvku: ", error);
        statusMessageDiv.textContent = "Chyba při přidávání. Zkuste to znovu.";
    }
});

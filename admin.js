// admin.js
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const addPostForm = document.getElementById('add-post-form');
const statusMessageDiv = document.getElementById('status-message');

// Seznam povolených e-mailových adres
const allowedEmails = [
    "linuxsmajlik@gmail.com" // SEM VLOŽTE SVŮJ GMAIL ÚČET
];

const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Kontrola, zda je e-mail v seznamu povolených
        if (allowedEmails.includes(user.email)) {
            // Uživatel je přihlášen a má oprávnění
            userEmailSpan.textContent = user.email;
            loginSection.style.display = 'none';
            adminSection.style.display = 'block';
        } else {
            // E-mail není povolen. Odhlásit uživatele
            firebase.auth().signOut().then(() => {
                alert("Nemáte oprávnění k přístupu do admin sekce.");
            }).catch((error) => {
                console.error("Chyba při odhlášení:", error);
            });
            // Zobrazit login sekci
            loginSection.style.display = 'block';
            adminSection.style.display = 'none';
        }
    } else {
        // Uživatel není přihlášen
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

addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const attachmentUrl = document.getElementById('attachment-url').value;
    const attachmentName = document.getElementById('attachment-name').value;

    try {
        await db.collection("posts").add({
            category: category,
            title: title,
            attachments: [attachmentUrl],
            attachment_names: [attachmentName],
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        statusMessageDiv.textContent = "Příspěvek úspěšně přidán!";
        addPostForm.reset();

    } catch (error) {
        console.error("Chyba při přidávání příspěvku: ", error);
        statusMessageDiv.textContent = "Chyba při přidávání. Zkuste to znovu.";
    }
});

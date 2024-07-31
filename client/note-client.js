const baseUrl = "http://localhost:3000";

// Function to login and store token
async function login(username, password) {
    const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        // Proceed to the next step in your app
    } else {
        alert(data.message);
    }
}

// Function to add a note with token authentication
async function addNote(noteData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
    });
    return response;
}

// Function to handle note addition with authentication check
async function addNoteWithAuthCheck(noteData) {
    try {
        const response = await addNote(noteData);
        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            // Redirect to login page or handle re-authentication
        } else {
            // Handle successful response
            console.log('Note added successfully');
            // Update the UI, clear form, etc.
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

// Function to update a note with token authentication
async function updateNote(noteData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/notes/${noteData.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
    });
    return response;
}

// Function to delete a note with token authentication
async function deleteNote(noteId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response;
}

// Function to get a note by ID with token authentication
async function getNoteById(noteId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/notes/${noteId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}

// Function to get notes with optional title filter and token authentication
async function getNotes(noteTitle) {
    const token = localStorage.getItem('token');
    let url = `${baseUrl}/notes`;
    if (noteTitle) {
        url += `/?title=${noteTitle}`;
    }
    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}

// Add event listener to the Add Note button
document.getElementById('addBtn').addEventListener('click', () => {
    const title = document.getElementById('addTitle').value;
    const content = document.getElementById('addContent').value;
    addNoteWithAuthCheck({
        title,
        content
    });
});

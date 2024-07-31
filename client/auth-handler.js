document.getElementById('signOutBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    

    // const baseUrl = "http://localhost:3000";
    const baseUrl = "http://localhost:3000";
    try {
        const response = await fetch(`${baseUrl}/signout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        } else {
            alert('Sign out failed.');
        }
    } catch (error) {
        alert('An error occurred during sign out.');
    }
});

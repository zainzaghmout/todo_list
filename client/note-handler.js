function updateNotesTable(noteTitle) {
    var table = document.getElementById("notes-table");
    var rowCount = table.rows.length;
    while (--rowCount) {
        table.deleteRow(rowCount);
    }
    getNotes(noteTitle).then(data => {
        data.forEach(note => {
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = note["title"];
            cell2.innerHTML = note["content"];
            cell3.innerHTML = note["updatedDate"];
            cell4.innerHTML = `<a onclick="openEditModal('${note["_id"]}')"href="#"><img src="images/edit.png" style="width: 22px;"></a>
                               <a onclick="confirmDeleteNote('${note["_id"]}')" href="#"><img src="images/delete.png" style="width: 22px;"></a>`;
         })  
    })
}

function searchNotes() {
    const searchTitle = document.getElementById("searchInput").value;
    updateNotesTable(searchTitle);
}

function confirmDeleteNote(noteId) {
    var action = confirm("Are you sure you want to delete this note?");
    if(action == true) {
        deleteNote(noteId).then(()=> {
            updateNotesTable();
        })
    }
}
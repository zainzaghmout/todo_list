function updateNotesTable() {
    var table = document.getElementById("notes-table");
    getNotes().then(data => {
        data.forEach(note => {
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = note["title"];
            cell2.innerHTML = note["content"];
            cell3.innerHTML = note["updatedDate"];
        })  
    })
}
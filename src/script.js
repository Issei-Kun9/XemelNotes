// Connect to the database
let db = openDatabase('MemoDB', '1.0', 'Memo Storage', 2 * 1024 * 1024);

db.transaction(function (tx) {
    // Create the memos table if it doesn't exist
    tx.executeSql('CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY, text TEXT)');
});

// Display the saved memos
function displayMemos() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM memos', [], function (tx, results) {
            let list = document.getElementById('memo-list');
            list.innerHTML = ''; // Clear the list

            // Loop through the saved memos
            for (let i = 0; i < results.rows.length; i++) {
                let memo = results.rows[i];
                let li = document.createElement('li');
                li.innerHTML = memo.text + ' ';

                // Create the delete button
                let deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteMemo(memo.id);
                });
                li.appendChild(deleteButton);

                list.appendChild(li);
            }
        });
    });
}
displayMemos();

// Save the memo
let form = document.getElementById('memo-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let text = document.getElementById('memo-text').value;
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO memos (text) VALUES (?)', [text]);
    });
    displayMemos();
    form.reset();
});

// Delete the memo
function deleteMemo(id) {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM memos WHERE id = ?', [id]);
    });
    displayMemos();
}

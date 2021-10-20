const { urlencoded } = require('body-parser');
const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        connection.query('SELECT * FROM users', (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                let removeUser = req.query.removed;
                res.render('home', {
                    rows, removeUser
                });
                console.log('Database Ready');
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

// Find User By Search
exports.find = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        let searchTerm = req.body.search;
        connection.query('SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?',
            ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'],
            (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('home', {
                        rows
                    });
                    console.log('Database Ready');
                } else {
                    console.log(err);
                }
                console.log('The data from user table: \n', rows);
            });
    });
}

exports.form = (req, res) => {
    res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        const {
            first_name,
            last_name,
            email,
            phone,
            comments,
            status
        } = req.body;

        connection.query(
            'INSERT INTO  users SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?, status = ?',
            [first_name, last_name, email, phone, comments, status],
            (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('add-user', {
                        alert: 'User added successfully.'
                    });
                } else {
                    console.log(err);
                }
                console.log('The data from user table: \n', rows);
            });
    });
}

// Edit user
exports.edit = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        connection.query('SELECT * FROM users WHERE id = ?',
            [req.params.id],
            (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    res.render('edit-user', {
                        rows
                    });
                } else {
                    console.log(err);
                }
                console.log('The data from user table: \n', rows);
            });
    });
}

exports.update = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        const {
            first_name,
            last_name,
            email,
            phone,
            comments,
            status
        } = req.body;
        // User the connection
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?, status = ? WHERE id = ?', [first_name, last_name, email, phone, comments, status, req.params.id], (err, rows) => {

            if (!err) {
                // User the connection
                connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
                    // When done with the connection, release it

                    if (!err) {
                        res.render('edit-user', {
                            rows,
                            alert: `${first_name} has been updated.`
                        });
                    } else {
                        console.log(err);
                    }
                    console.log('The data from user table: \n', rows);
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    }
    )
}

// Delete user
exports.delete = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        connection.query('DELETE FROM users WHERE id = ?',
            [req.params.id],
            (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    let removeUser = encodeURIComponent('User successfully removed.');
                    res.redirect('/?removed=' + removeUser);
                } else {
                    console.log(err);
                }
                console.log('The data from user table: \n', rows);
            });
    });
}

// View Users
exports.viewall = (req, res) => {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected;
        console.log('Connected as ID ' + connection.threadId);
        // User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                res.render('view-user', {
                    rows
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}
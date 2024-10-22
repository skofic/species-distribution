'use strict'

/**
 * credentials.example.js
 *
 * This is an example file, so the actual references are just
 * for example purposes. Copy this file and name the copy, for
 * instance, credentials.localhost.js for accessing the localhost
 * database.
 */

///
// Include database.
///
const arangojs = require('arangojs')

///
// Globals.
///
module.exports = Object.freeze({
	// Database connection.
	db: new arangojs.Database({
		url: 'http://localhost:8529',
		databaseName: 'SpeciesOccurrences',
		auth: { username: 'admin', password: 'password' }
	})
})

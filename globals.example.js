'use strict'

/**
 * globals.example.js
 *
 * This file contains the global variables used in the project.
 * This is an example file, so the actual references are just
 * for example purposes. Copy this file and name the copy, for
 * instance, globals.localhost.js for accessing the localhost
 * database.
 */

///
// Include database.
///
const arangojs = require('arangojs')

///
// Globals.
///
const constants = {
	// Database connection.
	db: new arangojs.Database({
		url: 'http://localhost:8529',
		databaseName: 'SpeciesOccurrences',
		auth: { username: 'root', password: 'password' }
	}),
	
	// Collection names.
    collections: {
        genus: 'EU-Forest_Genus',
        species: 'EU-Forest_Species'
    },
	
	// Collection indexes.
	indexes: {
        genus: [
			{
				"name": "idx_genera",
				"type": "persistent",
				"fields": ["properties.genus[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
	        },
	        {
		        "name": "idx_geometry",
		        "type": "geo",
		        "fields": ["geometry"],
		        "geoJson": true,
		        "estimates": true,
		        "cacheEnabled": false,
		        "deduplicate": false,
		        "sparse": false,
		        "unique": false
	        }
		],
        species: [
	        {
		        "name": "idx_species",
		        "type": "persistent",
		        "fields": ["species"],
		        "estimates": true,
		        "cacheEnabled": false,
		        "deduplicate": false,
		        "sparse": false,
		        "unique": false
	        },
	        {
		        "name": "idx_geometry",
		        "type": "geo",
		        "fields": ["geometry"],
		        "geoJson": true,
		        "estimates": true,
		        "cacheEnabled": false,
		        "deduplicate": false,
		        "sparse": false,
		        "unique": false
	        }
        ]
    }
}

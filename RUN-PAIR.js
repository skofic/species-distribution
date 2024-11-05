/**
 * OBSOLETE
 */

/**
 * processEU-Forest
 *
 * This script will create all the required collections
 */

///
// Import libraries.
///
const fs = require('fs')
const csv = require('csv-parser')
const proj4 = require('proj4')
const { Database, aql } = require('arangojs')

///
// Import constants.
///
const K = require("./globals.localhost.js")
const console = require("node:console");
const {CollectionType} = require("arangojs/collection");

///
// Handle script arguments.
///
if(process.argv.length < 3) {
	throw new Error("USAGE: <script> <pair key>")
}

///
// Check pair information.
///
if(!K.pairs.hasOwnProperty(process.argv[2])) {
	throw new Error(`Unknown pair key: ${process.argv[2]}`)
}

///
// Set pair information.
///
const pair = K.pairs[process.argv[2]]

///
// connect to database.
///
const db = new Database(K.db)

///
// RUN.
///
main()


/**
 * MAIN
 */

/**
 * main
 *
 * This function will perform the following tasks:
 *
 * - Create all pair collections (full and round).
 */
async function main()
{
	///
	// Create collections.
	///
	await createCollections()
		.then( (results) => {
			console.log("All required collections were created.")
		})
		.catch( (error) => {
			console.log(error.message)
			return 1
		})
	
	// ///
	// // Build temperature-precipitation pair for Chelsa (FULL).
	// ///
	// if(K.flags.MakeTemperaturePrecipitation.makeTempPrecChelsaFull) {
	// 	await makeTempPrecChelsaFull()
	// }
	//
	// ///
	// // Build temperature-precipitation pair for EU-Forest (FULL).
	// ///
	// if(K.flags.MakeTemperaturePrecipitation.makeTempPrecEUForestFull) {
	// 	await makeTempPrecEUForestFull()
	// }
	
} // main()


/**
 * FUNCTIONS
 */

/**
 * createCollections
 *
 * This function will create the EU-Forest_Genus and EU-Forest_Species
 * collections, including indexes. If the collections exist they will be deleted.
 */
async function createCollections()
{
	// ///
	// // Init collections.
	// ///
	// const collections = pair.collections.map( (collection) => {
	// 	return db.collection(collection.name)
	// })
	//
	// ///
	// // Drop collections.
	// ///
	// console.log("")
	// console.log("Deleting collections")
	// for (const collection of collections) {
	// 	console.log("Dropping collection: ", collection.name)
	// 	await collection.drop()
	// 		.then( (results) => {
	// 			console.log("Dropped: ", collection.name)
	// 		})
	// 		.catch( (error) => {
	// 			console.log(error.message)
	// 		})
	// }
	//
	// ///
	// // Create collections.
	// ///
	// console.log("")
	// console.log("Creating collections")
	// for (const collection of collections) {
	// 	console.log("Creating collection: ", collection.name)
	// 	await collection.create({ type: CollectionType.DOCUMENT_COLLECTION })
	// 		.then( (results) => {
	// 			console.log("Created: ", collection.name)
	// 		})
	// 		.catch( (error) => {
	// 			console.log(error.message)
	// 		})
	// }
	//
	// ///
	// // Create indexes.
	// ///
	// console.log("")
	// console.log("Creating indexes")
	// const indexPromises = []
	// for (const record of pair.collections) {
	// 	console.log("Creating indexes for: ", record.name)
	// 	const collection = db.collection(record.name)
	// 	indexPromises.push(
	// 		collection.ensureIndex({
	// 			"name": "idx_count",
	// 			"type": "persistent",
	// 			"fields": ["count"],
	// 			"estimates": true,
	// 			"cacheEnabled": false,
	// 			"deduplicate": false,
	// 			"sparse": false,
	// 			"unique": false
	// 		})
	// 	)
	// 	if(record.species) {
	// 		indexPromises.push(
	// 			collection.ensureIndex({
	// 				"name": "idx_species",
	// 				"type": "persistent",
	// 				"fields": ["species_list[*]"],
	// 				"estimates": true,
	// 				"cacheEnabled": false,
	// 				"deduplicate": false,
	// 				"sparse": false,
	// 				"unique": false
	// 			})
	// 		)
	// 	}
	// 	if(record.units) {
	// 		indexPromises.push(
	// 			collection.ensureIndex({
	// 				"name": "idx_gcu_id_number_list",
	// 				"type": "persistent",
	// 				"fields": ["gcu_id_number_list[*]"],
	// 				"estimates": true,
	// 				"cacheEnabled": false,
	// 				"deduplicate": false,
	// 				"sparse": false,
	// 				"unique": false
	// 			})
	// 		)
	// 		indexPromises.push(
	// 			collection.ensureIndex({
	// 				"name": "idx_gcu_id_unit-id_list",
	// 				"type": "persistent",
	// 				"fields": ["gcu_id_unit-id_list[*]"],
	// 				"estimates": true,
	// 				"cacheEnabled": false,
	// 				"deduplicate": false,
	// 				"sparse": false,
	// 				"unique": false
	// 			})
	// 		)
	// 	}
	// 	for (const indicator of ['X', 'Y']) {
	// 		indexPromises.push(
	// 			collection.ensureIndex({
	// 				"name": `idx_${pair.key}_${pair[indicator]}`,
	// 				"type": "persistent",
	// 				"fields": [`properties.${pair[indicator]}`],
	// 				"estimates": true,
	// 				"cacheEnabled": false,
	// 				"deduplicate": false,
	// 				"sparse": false,
	// 				"unique": false
	// 			})
	// 		)
	// 	}
	// }
	// await Promise.allSettled(indexPromises)
	// 	.then( (results) => {
	// 		console.log("Indexes created.")
	// 	})
	// 	.catch( (error) => {
	// 		console.log(error.message)
	// 		return 1
	// 	})
	
} // createCollections()

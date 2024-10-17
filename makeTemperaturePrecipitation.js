/**
 * processEU-Forest
 *
 * This script expects two files in the input directory:
 *
 * - `EU-Forest_Genus.csv`: The coordinates of the Genus occurrences.
 * - `EU-Forest_Species.csv`: The coordinates of the Species occurrences.
 *
 * The function will load them in the respective collections.
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
 * The main function will perform the following tasks:
 *
 * - Create all working collections.
 * - Create temperature-Precipitation pair for Chelsa (FULL).
 * - Remove temporary collections.
 */
async function main()
{
	///
	// Create collections.
	///
	if(K.flags.MakeTemperaturePrecipitation.createCollections) {
		await createCollections()
	}
	
	///
	// Build temperature-precipitation pair for Chelsa (FULL).
	///
	if(K.flags.MakeTemperaturePrecipitation.makeTempPrecChelsaFull) {
		await makeTempPrecChelsaFull()
	}
	
	///
	// Build temperature-precipitation pair for EU-Forest (FULL).
	///
	if(K.flags.MakeTemperaturePrecipitation.makeTempPrecEUForestFull) {
		await makeTempPrecEUForestFull()
	}
	
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
	///
	// Init collections.
	///
	const collectionKeys = [
		'temp_prec_chelsa_full',
		'temp_prec_eu_full'
	]
	const collections = collectionKeys.map( (key) => {
		return db.collection(K.collections[key])
	})
	
	///
	// Drop collections.
	///
	console.log("Dropping collections")
	const dropPromises = collections.map(async (collection) => {
		return await collection.drop()
	})
	await Promise.allSettled(dropPromises)
		.then( (results) => {
			console.log("Dropped all collections")
		})
		.catch( (error) => {
			console.log(error.message)
			return
		})
	
	///
	// Create collections.
	///
	console.log("Creating collections")
	const createPromises = collections.map(async (collection) => {
		return await collection.create()
	})
	await Promise.allSettled(createPromises)
		.then( (results) => {
			console.log("Created all collections.")
		})
		.catch( (error) => {
			console.log(error.message)
			return
		})
	
	///
	// Create indexes.
	///
	console.log("Creating indexes")
	const indexPromises = []
	for (const key of collectionKeys) {
		console.log("Creating indexes for", key)
		const collection = db.collection(K.collections[key])
		for (const index of K.indexes[key]) {
			indexPromises.push(collection.ensureIndex(index))
		}
	}
	await Promise.allSettled(indexPromises)
		.then( (results) => {
			console.log("Created all indexes.")
		})
		.catch( (error) => {
			console.log(error.message)
			return
		})
	
} // createCollections()

/**
 * makeTempPrecChelsaFull
 *
 * This function will aggregate Chelsa temperature and precipitation
 * with full resolution.
 */
async function makeTempPrecChelsaFull()
{
	///
	// Init local storage.
	///
	const collectionStats = db.collection(K.collections.stats)
	const collectionChelsa = db.collection(K.collections.chelsa)
	const collectionTempPrecFull = db.collection(K.collections.temp_prec_chelsa_full)
	
	console.log("")
	console.log("Aggregate Chelsa by temperature and precipitation, full resolution.")
	try {
		const cursor = await db.query(aql`
			LET stat_chelsa = (
				FOR stat IN ${collectionStats}
					FILTER stat._key == "Chelsa"
				RETURN stat
			)[0]
			
			LET tas_chelsa_max = stat_chelsa.env_climate_tas.max
			LET tas_chelsa_min = stat_chelsa.env_climate_tas.min
			
			LET pr_chelsa_max = stat_chelsa.env_climate_pr.max
			LET pr_chelsa_min = stat_chelsa.env_climate_pr.min
			
			LET tas_chelsa_range = tas_chelsa_max - tas_chelsa_min
			LET pr_chelsa_range = pr_chelsa_max - pr_chelsa_min
			
			FOR doc IN ${collectionChelsa}
			
				COLLECT mean_annual_temp = doc.properties["1981-2010"].env_climate_tas,
						mean_annual_prc = doc.properties["1981-2010"].env_climate_pr
				WITH COUNT INTO items
			
			INSERT {
				_key: MD5(TO_STRING([mean_annual_temp, mean_annual_prc])),
				count: items,
				properties: {
					env_climate_tas: mean_annual_temp,
					env_climate_pr: mean_annual_prc
				},
				scale: {
					env_climate_tas_ratio: (mean_annual_temp - tas_chelsa_min) / tas_chelsa_range,
					env_climate_pr_ratio: (mean_annual_prc - pr_chelsa_min) / pr_chelsa_range
				}
			} INTO ${collectionTempPrecFull}
				OPTIONS {
					waitForSync: true,
					overwriteMode: "ignore",
					keepNull: false
				}
		`, {}, {
			maxRuntime: K.settings.maxRuntime,
			timeout: K.settings.timeout
		})
		
		for await(const item of cursor) {
			console.log(item)
		}
		
		console.log("  Query succeeded.")
		
	} catch (error) {
		console.log(error.message)
	}
	
} // makeTempPrecChelsaFull()

/**
 * makeTempPrecEUForestFull
 *
 * This function will aggregate Chelsa temperature and precipitation
 * with full resolution.
 */
async function makeTempPrecEUForestFull()
{
	///
	// Init local storage.
	///
	const collectionStats = db.collection(K.collections.stats)
	const collectionEUForest = db.collection(K.collections.final)
	const collectionTempPrecFull = db.collection(K.collections.temp_prec_eu_full)
	
	console.log("")
	console.log("Aggregate EU-Forest by temperature and precipitation, full resolution.")
	try {
		const cursor = await db.query(aql`
			LET stat_chelsa = (
				FOR stat IN ${collectionStats}
				FILTER stat._key == "Chelsa"
				RETURN stat
			)[0]
			
			LET tas_chelsa_max = stat_chelsa.env_climate_tas.max
			LET tas_chelsa_min = stat_chelsa.env_climate_tas.min
			
			LET pr_chelsa_max = stat_chelsa.env_climate_pr.max
			LET pr_chelsa_min = stat_chelsa.env_climate_pr.min
			
			LET tas_chelsa_range = tas_chelsa_max - tas_chelsa_min
			LET pr_chelsa_range = pr_chelsa_max - pr_chelsa_min
			
			FOR doc IN ${collectionEUForest}
			
				COLLECT mean_annual_temp = doc.properties.env_climate_tas,
						mean_annual_prc = doc.properties.env_climate_pr
				INTO items
				
				INSERT {
					_key: MD5(TO_STRING([mean_annual_temp, mean_annual_prc])),
					count: LENGTH(items),
					species_list: UNIQUE(FLATTEN(items[*].doc.properties.species_list)),
					properties: {
						env_climate_tas: mean_annual_temp,
						env_climate_pr: mean_annual_prc
					},
					scale: {
						env_climate_tas_ratio: (mean_annual_temp - tas_chelsa_min) / tas_chelsa_range,
						env_climate_pr_ratio: (mean_annual_prc - pr_chelsa_min) / pr_chelsa_range
					}
				} INTO ${collectionTempPrecFull}
					OPTIONS {
						waitForSync: true,
						overwriteMode: "ignore",
						keepNull: false
					}
		`, {}, {
			maxRuntime: K.settings.maxRuntime,
			timeout: K.settings.timeout
		})
		
		for await(const item of cursor) {
			console.log(item)
		}
		
		console.log("  Query succeeded.")
		
	} catch (error) {
		console.log(error.message)
	}
	
} // makeTempPrecEUForestFull()

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
// File references.
///
const inputDir = '/Users/milko/Local/Development/Workshop/data/original/EU-Forest'
const outputDir = '/Users/milko/Local/Development/Workshop/data/final/EU-Forest'
const fileGenusName = 'EU-Forest_Genus'
const fileSpeciesName = 'EU-Forest_Species'

///
// Define the EPSG:3015 and WGS-84 projections.
///
const projectionSource = '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs'
const projectionDestination = proj4.WGS84

///
// Create streams.
///
const inputFilePath = [
	inputDir + '/' + fileGenusName + '.csv',
	inputDir + '/' + fileSpeciesName + '.csv'
]
const outputFilePath = [
	outputDir + '/' + fileGenusName + '.jsonl',
	outputDir + '/' + fileSpeciesName + '.jsonl'
]

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
 * - Drop all collections.
 * - Create all working collections.
 * - Import data, package and generate dumps.
 * - Save data into the database.
 * - Aggregate species by location.
 * - Link species data to Chelsa.
 * - Aggregate species data by Chelsa location.
 * - Create statistics.
 * - Remove temporary collections.
 */
async function main()
{
	///
	// Create collections.
	///
	if(K.flags.ProcessEUForest.createCollections) {
		await createCollections()
	}

	///
	// Iterate files.
	///
	if(K.flags.ProcessEUForest.processFiles) {
		for (let i = 0; i < inputFilePath.length; i++) {
			await processFile(i)
		}
	}
	
	///
	// Group species records by location.
	///
	if(K.flags.ProcessEUForest.aggregateSpecies) {
		await aggregateSpecies()
	}
	
	///
	// Link Chelsa to species occurrences.
	///
	if(K.flags.ProcessEUForest.linkChelsa) {
		await linkChelsa()
	}
	
	///
	// Remove unlinked records.
	///
	if(K.flags.ProcessEUForest.cleanChelsa) {
		await cleanChelsa()
	}
	
	///
	// Aggregate Chelsa with species occurrences.
	///
	if(K.flags.ProcessEUForest.aggregateChelsa) {
		await aggregateChelsa()
	}
	
	///
	// Write EU-Forest Statistics.
	///
	if(K.flags.ProcessEUForest.writeEUStats) {
		await writeEUStats()
	}
	
	///
	// Write Chelsa Statistics.
	///
	if(K.flags.ProcessEUForest.writeChelsaStats) {
		await writeChelsaStats()
	}
	
	///
	// Drop work collections.
	///
	if(K.flags.ProcessEUForest.dropCollections) {
		await dropCollections()
	}
	
	///
	// Build temperature-precipitation pair for Chelsa (FULL).
	///
	if(K.flags.ProcessEUForest.makeTempPrecChelsaFull) {
		await makeTempPrecChelsaFull()
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
	const collectionNames = [
		K.collections.genus,
		K.collections.species,
		K.collections.location,
		K.collections.work,
		K.collections.final,
		K.collections.stats,
		K.collections.temp_prec_chelsa_full
	]
	const collections = collectionNames.map( (name) => {
		return db.collection(name)
	})
	
	///
	// Drop collections.
	///
	console.log("Dropping collections")
	const dropPromises = collections.map(async (collection) => {
		return await collection.drop()
	})
	Promise.allSettled(dropPromises)
		.then( (results) => {
			console.log("Dropped all collections")
		})
	
	///
	// Create collections.
	///
	console.log("Creating collections")
	const createPromises = collections.map(async (collection) => {
		return await collection.create()
	})
	Promise.allSettled(createPromises)
		.then( (results) => {
			console.log("Created all collections.")
		})
	
	///
	// Create indexes.
	///
	console.log("Creating indexes")
	for (const [key, indexes] of Object.entries(K.indexes)) {
		const collection = db.collection(K.collections[key])
		const indexPromises = indexes.map(async (index) => {
			return await collection.ensureIndex(index)
		})
		
		Promise.allSettled(indexPromises)
			.then( (results) => {
				console.log("Created indexes for", key)
			})
	}
	
} // createCollections()

/**
 * dropCollections
 *
 * This function will drop those collections used as temporary storage.
 */
async function dropCollections()
{
	///
	// Init collections.
	///
	const collectionNames = [
		K.collections.location,
		K.collections.work
	]
	const collections = collectionNames.map( (name) => {
		return db.collection(name)
	})
	
	///
	// Drop collections.
	///
	console.log("")
	console.log("Dropping work collections")
	const dropPromises = collections.map(async (collection) => {
		return await collection.drop()
	})
	Promise.all(dropPromises)
		.then( (results) => {
			console.log("Dropped all work collections")
		})
		.catch( (error) => {
			console.log(error.message)
		})
	
} // dropCollections()

/**
 * processFile
 *
 * The function will do the following:
 *
 * - Read CSV file.
 * - Package data into JSON.
 * - Insert data into database.
 *
 * The provided index has two values: 0 is for the Genus file,
 * 1 is for the Species file.
 */
async function processFile(theIndex)
{
	///
	// Make promise.
	///
	return new Promise((resolve, reject) => {
		const records = []
		const outputStream = fs.createWriteStream(outputFilePath[theIndex])
		
		///
		// Open a read stream.
		///
		fs.createReadStream(inputFilePath[theIndex])
			.pipe(csv())
			.on('data', (data) => {
				let record = {}
				switch (theIndex) {
					case 0:
						// Package genus data.
						record = packageGenus(data, projectionSource, projectionDestination)
						break
					case 1:
						// Package species data.
						record = packageSpecies(data, projectionSource, projectionDestination)
						break
				}
				
				// Write JSONL record.
				outputStream.write(JSON.stringify(record) + '\n')
				// Add to records list.
				records.push(record)
			})
			.on('end', async () => {
				outputStream.end()
				console.log('')
				
				try {
					// Set collection references.
					const collectionName = (theIndex === 0) ? K.collections.genus : K.collections.species
					const collection = db.collection(collectionName)
					console.log('Coordinates transformed and saved to ', outputFilePath[theIndex])
					
					// Save records to database.
					console.log('Writing to collection ', collectionName)
					await saveRecords(collection, records)
					resolve()
				} catch (error) {
					console.log('Failed: ', error)
					reject(error)
				}
			})
			.on('error', (error) => {
				console.log('Error reading file: ', error)
				reject(error)
			})
	})
	
} // processFile()

/**
 * packageGenus
 *
 * Package GENUS record.
 *
 * The function will return an object containing the EU-Forest genus record.
 * The coordinates will be converted to WGS-84 and the coordinates will be in
 * GeoJSON format.
 *
 * The function expects the CSV record packaged as an object and the conversion
 * setting for proj4.
 *
 * @param theCSV {Object}: The CSV record.
 * @param theSource {String}: The proj4 source conversion settings.
 * @param theDestination {String}: The proj4 destination conversion settings.
 *
 *
 * @return {Object}: The converted record.
 */
function packageGenus(theCSV, theSource, theDestination)
{
	///
	// Convert coorsinates.
	//
	const [lon, lat] =
		proj4(theSource, theDestination,
			[parseFloat(theCSV.X), parseFloat(theCSV.Y)]
		)
	
	///
	// Create record.
	///
	return {
		geometry: {
			type: 'Point',
			coordinates: [lon, lat]
		},
		properties: {
			genus: theCSV['Genus name'],
			std_country_name: theCSV.COUNTRY
		}
	}                                                                   // ==>
	
} // packageGenus()

/**
 * packageSpecies
 *
 * Package SPECIES record.
 *
 * The function will return an object containing the EU-Forest species record.
 * The coordinates will be converted to WGS-84 and the coordinates will be in
 * GeoJSON format.
 *
 * The function will also perform the following modifications:
 *
 * - DBHx: DBH-1 becomes chr_CircBreastHeight_DBH-1;
 *         DBH-2 becomes chr_CircBreastHeight_DBH-2.
 * - NFI; FF; BS: These categories become respectively  chr_database_NFI,
 *                chr_database_FF and chr_database_BS.
 * - EOO: It becomes a flag identified by chr_EOO.
 *
 * The function expects the CSV record packaged as an object.
 *
 * @param theCSV {Object}: The CSV record.
 * @param theSource {String}: The proj4 conversion settings.
 * @param theDestination {String}: The proj4 destination conversion settings.
 *
 * @return {Object}: The converted record.
 */
function packageSpecies(theCSV, theSource, theDestination)
{
	///
	// Convert coordinates.
	//
	const [lon, lat] =
		proj4(theSource, theDestination,
			[parseFloat(theCSV.X), parseFloat(theCSV.Y)]
		)
	
	///
	// Set coordinates.
	///
	const record = {
		geometry: {
			type: 'Point',
			coordinates: [lon, lat]
		}
	}
	
	///
	// Set properties property.
	///
	record.properties = {}
	
	///
	// Set species.
	///
	record.properties.species = theCSV['SPECIES NAME']
	
	///
	// Collect DBH.
	///
	const dbh = []
	if(theCSV.hasOwnProperty('DBH-1') && theCSV['DBH-1'] === '1') {
		dbh.push('chr_CircBreastHeight_DBH-1')
	}
	if(theCSV.hasOwnProperty('DBH-2') && theCSV['DBH-2'] === '1') {
		dbh.push('chr_CircBreastHeight_DBH-2')
	}
	if(dbh.length > 0) {
		record.properties.chr_CircBreastHeight_DBH = dbh
	}
	
	///
	// Collect database.
	///
	const db = []
	if(theCSV.hasOwnProperty('NFI') && theCSV['NFI'] === '1') {
		db.push('chr_database_NFI')
	}
	if(theCSV.hasOwnProperty('FF') && theCSV['FF'] === '1') {
		db.push('chr_database_FF')
	}
	if(theCSV.hasOwnProperty('BS') && theCSV['BS'] === '1') {
		db.push('chr_database_BS')
	}
	if(db.length > 0) {
		record.properties.chr_database = db
	}
	
	///
	// Collect extent of occurrence.
	///
	record.properties.chr_EOO = (theCSV.hasOwnProperty('EEO') && theCSV['EEO'] === '1')
	
	///
	// Create record.
	///
	return record                                                       // ==>
	
} // packageSpecies()

/**
 * saveRecords
 *
 * This function will save the provided list of records in the provided collection.
 *
 * @param theCollection {DocumentCollection}: The collection to write to.
 * @param theRecords {Object[]}: The records to write.
 */
async function saveRecords(theCollection, theRecords)
{
	try {
		await theCollection.saveAll(theRecords)
		
	} catch (error) {
		console.error(error.message)
	}

} // saveRecords()

/**
 * aggregateSpecies
 *
 * This function will aggregate EU-Forest_Species records by location into the
 * EU-Forest_Occurrences collection.
 */
async function aggregateSpecies()
{
	///
	// Init local storage.
	///
	const collectionSpecies = db.collection(K.collections.species)
	const collectionOccurrences = db.collection(K.collections.location)
	
	console.log("")
	console.log("Aggregate EU-Forest_Species by location.")
	try {
		await db.query(aql`
			FOR doc IN ${collectionSpecies}
				COLLECT geometry = doc.geometry
				INTO items
			INSERT {
				_key: MD5(
					TO_STRING(
						GEO_POINT(
							geometry.coordinates[0],
							geometry.coordinates[1]
						)
					)
				),
				geometry: geometry,
				properties: {
					species_list: UNIQUE(FLATTEN(items[*].doc.properties.species))
				}
			} INTO ${collectionOccurrences}
		`)
		
	} catch (error) {
		console.error(error.message)
	}
	
} // aggregateSpecies()

/**
 * linkChelsa
 *
 * This function will link Chelsa to the EU-Forest_Occurrences, by saving the
 * Chelsa ley reference in the record. This will allow us later to aggregate
 * the list of species with the specific Chelsa grid element.
 */
async function linkChelsa()
{
	///
	// Init local storage.
	///
	const collectionWork = db.collection(K.collections.work)
	const collectionChelsa = db.collection(K.collections.chelsa)
	const collectionOccurrences = db.collection(K.collections.location)
	
	console.log("")
	console.log("Link EU-Forest_Occurrences to Chelsa.")
	try {
		// Link Chelsa.
		await db.query(aql`
			FOR spc IN ${collectionOccurrences}
				LET links = (
					FOR che IN ${collectionChelsa}
						FILTER GEO_INTERSECTS(spc.geometry, che.geometry_bounds)
					RETURN che._key
				)
				
				INSERT {
					_key: spc._key,
					geometry: spc.geometry,
					geometry_hash: links[0],
					properties: spc.properties
				}
				INTO ${collectionWork}
		`)
		
	} catch (error) {
		console.error(error.message)
	}
	
} // linkChelsa()

/**
 * cleanChelsa
 *
 * This function will link Chelsa to the EU-Forest_Occurrences, by saving the
 * Chelsa ley reference in the record. This will allow us later to aggregate
 * the list of species with the specific Chelsa grid element.
 */
async function cleanChelsa()
{
	///
	// Init local storage.
	///
	const collectionWork = db.collection(K.collections.work)
	
	console.log("")
	console.log("Remove unlinked records.")
	try {
		// Remove unlinked.
		await db.query(aql`
			FOR doc IN ${collectionWork}
				FILTER doc.geometry_hash == null
			REMOVE doc._key IN ${collectionWork}
		`)
		
	} catch (error) {
		console.error(error.message)
	}
	
} // cleanChelsa()

/**
 * aggregateChelsa
 *
 * This function will aggregate EU-Forest_Work records by Chelsa reference
 * into the EU-Forest_Chelsa collection.
 */
async function aggregateChelsa()
{
	///
	// Init local storage.
	///
	const collectionWork = db.collection(K.collections.work)
	const collectionFinal = db.collection(K.collections.final)
	const collectionChelsa = db.collection(K.collections.chelsa)
	
	console.log("")
	console.log("Aggregate EU-Forest_Work by Chelsa in EU-Forest_Chelsa.")
	try {
		await db.query(aql`
			FOR doc IN ${collectionWork}
				COLLECT hash = doc.geometry_hash INTO items
				FOR che IN ${collectionChelsa}
					FILTER che._key == hash
			
			INSERT {
				_key: che._key,
				geometry: (LENGTH(items) > 1)
					? GEO_MULTIPOINT(items[*].doc.geometry.coordinates)
					: items[0].doc.geometry,
				geometry_bounds: che.geometry_bounds,
				properties: {
					species_list: UNIQUE(FLATTEN(items[*].doc.properties.species_list)),
					env_climate_bio01: che.properties["1981-2010"].env_climate_bio01,
					env_climate_bio04: che.properties["1981-2010"].env_climate_bio04,
					env_climate_bio05: che.properties["1981-2010"].env_climate_bio05,
					env_climate_bio06: che.properties["1981-2010"].env_climate_bio06,
					env_climate_bio12: che.properties["1981-2010"].env_climate_bio12,
					env_climate_bio15: che.properties["1981-2010"].env_climate_bio15,
					env_climate_vpd_mean: che.properties["1981-2010"].env_climate_vpd_mean
				}
			} INTO ${collectionFinal}
		`)
		
	} catch (error) {
		console.error(error.message)
	}
	
} // aggregateChelsa()

/**
 * writeEUStats
 *
 * This function will write to the Stats collection, one record for the
 * EU-Forest data .
 */
async function writeEUStats()
{
	///
	// Init local storage.
	///
	const collectionFinal = db.collection(K.collections.final)
	const collectionStats = db.collection(K.collections.stats)
	
	console.log("")
	console.log("Writing EU-Forest statistics")
	const promises = []
	
	// Add EU-Forest stats.
	try {
		await db.query(aql`
			LET result = (
				FOR doc IN ${collectionFinal}
					COLLECT
					AGGREGATE env_climate_bio01_min = MIN(doc.properties.env_climate_bio01),
							  env_climate_bio01_avg = AVG(doc.properties.env_climate_bio01),
							  env_climate_bio01_max = MAX(doc.properties.env_climate_bio01),
								
							  env_climate_bio04_min = MIN(doc.properties.env_climate_bio04),
							  env_climate_bio04_avg = AVG(doc.properties.env_climate_bio04),
							  env_climate_bio04_max = MAX(doc.properties.env_climate_bio04),
							  
							  env_climate_bio05_min = MIN(doc.properties.env_climate_bio05),
							  env_climate_bio05_avg = AVG(doc.properties.env_climate_bio05),
							  env_climate_bio05_max = MAX(doc.properties.env_climate_bio05),
							  
							  env_climate_bio06_min = MIN(doc.properties.env_climate_bio06),
							  env_climate_bio06_avg = AVG(doc.properties.env_climate_bio06),
							  env_climate_bio06_max = MAX(doc.properties.env_climate_bio06),
							  
							  env_climate_bio12_min = MIN(doc.properties.env_climate_bio12),
							  env_climate_bio12_avg = AVG(doc.properties.env_climate_bio12),
							  env_climate_bio12_max = MAX(doc.properties.env_climate_bio12),
							  
							  env_climate_bio15_min = MIN(doc.properties.env_climate_bio15),
							  env_climate_bio15_avg = AVG(doc.properties.env_climate_bio15),
							  env_climate_bio15_max = MAX(doc.properties.env_climate_bio15),
							  
							  env_climate_vpd_mean_min = MIN(doc.properties.env_climate_vpd_mean),
							  env_climate_vpd_mean_avg = AVG(doc.properties.env_climate_vpd_mean),
							  env_climate_vpd_mean_max = MAX(doc.properties.env_climate_vpd_mean)
					INSERT {
						_key: "EU-Forest",
						env_climate_bio01: {
							min: env_climate_bio01_min,
							avg: env_climate_bio01_avg,
							max: env_climate_bio01_max
						},
						env_climate_bio04: {
							min: env_climate_bio04_min,
							avg: env_climate_bio04_avg,
							max: env_climate_bio04_max
						},
						env_climate_bio05: {
							min: env_climate_bio05_min,
							avg: env_climate_bio05_avg,
							max: env_climate_bio05_max
						},
						env_climate_bio06: {
							min: env_climate_bio06_min,
							avg: env_climate_bio06_avg,
							max: env_climate_bio06_max
						},
						env_climate_bio12: {
							min: env_climate_bio12_min,
							avg: env_climate_bio12_avg,
							max: env_climate_bio12_max
						},
						env_climate_bio15: {
							min: env_climate_bio15_min,
							avg: env_climate_bio15_avg,
							max: env_climate_bio15_max
						},
						env_climate_vpd_mean: {
							min: env_climate_vpd_mean_min,
							avg: env_climate_vpd_mean_avg,
							max: env_climate_vpd_mean_max
						}
					} INTO ${collectionStats}
			)
			
			RETURN "Done!"
		`)
		console.log("  Written EU-Forest")
	} catch (error) {
		console.log(error.message)
	}
	
} // writeEUStats()

/**
 * writeChelsaStats
 *
 * This function will write to the Stats collection, one record for the
 * Chelsa data.
 */
async function writeChelsaStats()
{
	///
	// Init local storage.
	///
	const collectionChelsa = db.collection(K.collections.chelsa)
	const collectionStats = db.collection(K.collections.stats)
	
	console.log("")
	console.log("Writing statistics")
	const promises = []
	
	// Add Chelsa stats.
	// Remember to index all relevant fields, or the query will take forever.
	try {
		await db.query(aql`
			LET result = (
				FOR doc IN ${collectionChelsa}
					COLLECT
					AGGREGATE env_climate_bio01_min = MIN(doc.properties["1981-2010"].env_climate_bio01),
							  env_climate_bio01_avg = AVG(doc.properties["1981-2010"].env_climate_bio01),
							  env_climate_bio01_max = MAX(doc.properties["1981-2010"].env_climate_bio01),
								
							  env_climate_bio04_min = MIN(doc.properties["1981-2010"].env_climate_bio04),
							  env_climate_bio04_avg = AVG(doc.properties["1981-2010"].env_climate_bio04),
							  env_climate_bio04_max = MAX(doc.properties["1981-2010"].env_climate_bio04),
							  
							  env_climate_bio05_min = MIN(doc.properties["1981-2010"].env_climate_bio05),
							  env_climate_bio05_avg = AVG(doc.properties["1981-2010"].env_climate_bio05),
							  env_climate_bio05_max = MAX(doc.properties["1981-2010"].env_climate_bio05),
							  
							  env_climate_bio06_min = MIN(doc.properties["1981-2010"].env_climate_bio06),
							  env_climate_bio06_avg = AVG(doc.properties["1981-2010"].env_climate_bio06),
							  env_climate_bio06_max = MAX(doc.properties["1981-2010"].env_climate_bio06),
							  
							  env_climate_bio12_min = MIN(doc.properties["1981-2010"].env_climate_bio12),
							  env_climate_bio12_avg = AVG(doc.properties["1981-2010"].env_climate_bio12),
							  env_climate_bio12_max = MAX(doc.properties["1981-2010"].env_climate_bio12),
							  
							  env_climate_bio15_min = MIN(doc.properties["1981-2010"].env_climate_bio15),
							  env_climate_bio15_avg = AVG(doc.properties["1981-2010"].env_climate_bio15),
							  env_climate_bio15_max = MAX(doc.properties["1981-2010"].env_climate_bio15),
							  
							  env_climate_vpd_mean_min = MIN(doc.properties["1981-2010"].env_climate_vpd_mean),
							  env_climate_vpd_mean_avg = AVG(doc.properties["1981-2010"].env_climate_vpd_mean),
							  env_climate_vpd_mean_max = MAX(doc.properties["1981-2010"].env_climate_vpd_mean)
					INSERT {
						_key: "Chelsa",
						env_climate_bio01: {
							min: env_climate_bio01_min,
							avg: env_climate_bio01_avg,
							max: env_climate_bio01_max
						},
						env_climate_bio04: {
							min: env_climate_bio04_min,
							avg: env_climate_bio04_avg,
							max: env_climate_bio04_max
						},
						env_climate_bio05: {
							min: env_climate_bio05_min,
							avg: env_climate_bio05_avg,
							max: env_climate_bio05_max
						},
						env_climate_bio06: {
							min: env_climate_bio06_min,
							avg: env_climate_bio06_avg,
							max: env_climate_bio06_max
						},
						env_climate_bio12: {
							min: env_climate_bio12_min,
							avg: env_climate_bio12_avg,
							max: env_climate_bio12_max
						},
						env_climate_bio15: {
							min: env_climate_bio15_min,
							avg: env_climate_bio15_avg,
							max: env_climate_bio15_max
						},
						env_climate_vpd_mean: {
							min: env_climate_vpd_mean_min,
							avg: env_climate_vpd_mean_avg,
							max: env_climate_vpd_mean_max
						}
					} INTO ${collectionStats}
			)
			
			RETURN "Done!"
		`)
		console.log("  Written Chelsa")
	} catch (error) {
		console.log(error.message)
	}
	
} // writeChelsaStats()

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
		await db.query(aql`
			LET stat_chelsa = (
				FOR stat IN ${collectionStats}
					FILTER stat._key == "Chelsa"
				RETURN stat
			)[0]
			
			LET bio01_chelsa_max = stat_chelsa.env_climate_bio01.max
			LET bio01_chelsa_min = stat_chelsa.env_climate_bio01.min
			
			LET bio12_chelsa_max = stat_chelsa.env_climate_bio12.max
			LET bio12_chelsa_min = stat_chelsa.env_climate_bio12.min
			
			LET bio01_chelsa_range = bio01_chelsa_max - bio01_chelsa_min
			LET bio12_chelsa_range = bio12_chelsa_max - bio12_chelsa_min
			
			LET result = (
				FOR doc IN ${collectionChelsa}
				
					COLLECT mean_annual_temp = doc.properties["1981-2010"].env_climate_bio01,
							total_annual_prc = doc.properties["1981-2010"].env_climate_bio12
					WITH COUNT INTO items
				
				INSERT {
					_key: MD5(TO_STRING([mean_annual_temp, total_annual_prc])),
					count: items,
					properties: {
						env_climate_bio01: mean_annual_temp,
						env_climate_bio12: total_annual_prc
					},
					scale: {
						env_climate_bio01_ratio: (mean_annual_temp - bio01_chelsa_min) / bio01_chelsa_range,
						env_climate_bio12_ratio: (total_annual_prc - bio12_chelsa_min) / bio12_chelsa_range
					}
				} INTO ${collectionTempPrecFull}
					OPTIONS {
						waitForSync: true,
						overwriteMode: "ignore",
						keepNull: false
					}
			)
			
			RETURN "Done!"
		`)
		
	} catch (error) {
		console.error(error.message)
	}
	
} // makeTempPrecChelsaFull()

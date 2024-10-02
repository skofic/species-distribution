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

///
// Import constants.
///
const K = require("./globals.localhost.js")

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
const source = '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs'
const dest = proj4.WGS84

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
// Create collections.
///
createCollections()


/**
 * GENERATE DUMP FILES
 */

///
// Iterate files.
///
for(let i = 0; i < inputFilePath.length; i++)
{
	///
	// Init records list.
	///
	const records = []
	
	///
	// Create a writable stream for the JSONL output.
	///
	const outputStream = fs.createWriteStream(outputFilePath[i])

	///
	// Parse CSV file.
	///
	fs.createReadStream(inputFilePath[i])
		.pipe(csv())
		.on('data', (data) =>
		{
			///
			// Parse taxonomy.
			///
			let record = {}
			switch(i)
			{
				case 0:
					record = packageGenus(data, source, dest)
					outputStream.write(JSON.stringify(record) + '\n')
					records.push(record)
					break;
					
				case 1:
					record = packageSpecies(data, source, dest)
					outputStream.write(JSON.stringify(record) + '\n')
					records.push(record)
					break;
			}
		})
		.on('end', () => {
			outputStream.end()
			
			const collectionName = (i === 0) ? K.collections.genus : K.collections.species
			const collection = K.db.collection(collectionName)

			console.log('Coordinates transformed and saved to ', outputFilePath[i])
			console.log('Writing to collection ', collectionName)
			saveRecords(collection, records)
				.then(() => {
					console.log('Done')
				})
				.catch((error) => {
					console.log('failed: ', error)
				})
		})
}

///
// Write to database.
///
K.db.collection(K.collections.genus)


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
	const collectionGenus = K.db.collection(K.collections.genus)
	const collectionSpecies = K.db.collection(K.collections.species)
	
	///
	// Drop collections.
	///
	await collectionGenus.drop()
	await collectionSpecies.drop()
	
	///
	// Create collections and indexes.
	///
	await collectionGenus.create()
	for(const index of K.indexes.genus) {
		await collectionGenus.ensureIndex(index)
	}
	await collectionSpecies.create()
	for(const index of K.indexes.species) {
		await collectionSpecies.ensureIndex(index)
	}
	
} // createCollections()

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
	// Set species.
	///
	record.species = theCSV['SPECIES NAME']
	
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
		record.chr_CircBreastHeight_DBH = dbh
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
		record.chr_database = db
	}
	
	///
	// Collect extent of occurrence.
	///
	record.chr_EOO = (theCSV.hasOwnProperty('EEO') && theCSV['EEO'] === '1')
	
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
	theCollection.saveAll(theRecords)

} // saveRecords()

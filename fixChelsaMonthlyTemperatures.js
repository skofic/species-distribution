/**
 * fixChelsaMonthlyTemperatures
 *
 * This script will convert Chelsa monthly temperatures
 * from Kelvin to Centigrades.
 */
	
///
// Import libraries.
///
const fs = require('fs')
const path = require('path')
const { Database, aql } = require('arangojs')

///
// Globals.
///
const K = require("./globals.localhost.js")
const db = new Database(K.db)
const collectionName = K.collections.chelsa
const collection = db.collection(collectionName)

///
// Constants and variables.
///
const batchSize = 3
const outputFilePath = path.join(__dirname, 'data/output.jsonl')

///
// Collection processing function.
///
async function processCollection() {
	try {
		// Initial page value
		let page = 0
		
		// Create a writable stream
		const writableStream = fs.createWriteStream(outputFilePath)
		
		while (true) {
			// Get batch.
			const cursor = await db.query(aql`
                FOR doc IN ${collection} LIMIT ${page}, ${batchSize} RETURN doc
            `)
			
			// Check if the cursor has any results
			if (!cursor.hasNext) {
				break // Exit the loop if no more documents
			}
			
			while (cursor.hasNext) {
				const doc = await cursor.next()
				const modifiedDoc = await processDocument(doc)
				writableStream.write(JSON.stringify(modifiedDoc) + '\n')
			}
			break
			
			// Next page.
			page += batchSize
		}
		
		writableStream.end()
		console.log(`Finished processing. Data written to ${outputFilePath}`)
	} catch (error) {
		console.error('Error processing collection:', error)
	}
}

///
// Document processing function.
///
async function processDocument(doc) {
	// init local storage.
	const propLabel = 'properties'
	const mpiLabel = 'MPI-ESM1-2-HR'
	const sspLabel = 'ssp370'
	const monthLabel = 'std_date_span_month'
	const periods = ["1981-2010", "2011-2040", "2041-2070", "2071-2100"]
	const tempLabels = ["env_climate_tas", "env_climate_tasmax", "env_climate_tasmin"]
	
	// Handle 1981-2010 period.
	if(doc.hasOwnProperty(propLabel)){
		const props = doc[propLabel]
		for(let pIdx = 0; pIdx < periods.length; pIdx++) {
			let months = props[periods[pIdx]]
			
			if(pIdx !== 0) {
				months = months[mpiLabel][sspLabel]
			}
			
			if(months.hasOwnProperty(monthLabel)) {
				months = months[monthLabel]
				for(let mIdx = 0; mIdx < months.length; mIdx++) {
					tempLabels.forEach( (tempLabel) => {
						months[mIdx][tempLabel] = months[mIdx][tempLabel] - 273.15
					})
				}
			}
		}
	}
	
	return doc
}

/**
 * MAIN
 */

// Main function to execute the script
(async () => {
	await processCollection()
})()

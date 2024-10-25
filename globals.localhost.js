'use strict'

/**
 * globals.localhost.js
 *
 * This file contains the global variables used in the project.
 */

///
// Includes.
///
const credentials = require("./credentials.localhost.js")

///
// Globals.
///
module.exports = Object.freeze({
	// Database connection.
	db: credentials.db,
	
	// Collection names.
	collections: {
		chelsa: 'Chelsa',
		genus: 'EU-Forest_Genus',
		species: 'EU-Forest_Species',
		location: 'EU-Forest_Occurrences',
		work: 'EU-Forest_Work',
		work_eufgis: 'EUFGIS_Work',
		final: 'EU-Forest_Chelsa',
		final_eufgis: 'EUFGIS_Chelsa',
		stats: 'Stats'
	},
	
	// Collection indexes.
	indexes: {
		chelsa: [
		],
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
				"name": "idx_geometry",
				"type": "geo",
				"fields": ["geometry"],
				"geoJson": true,
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_species",
				"type": "persistent",
				"fields": ["properties.species"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			}
		],
		location: [
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
			},
			{
				"name": "idx_species",
				"type": "persistent",
				"fields": ["properties.species_list[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			}
		],
		work: [
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
			},
			{
				"name": "idx_geometry_hash",
				"type": "persistent",
				"fields": ["geometry_hash"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_species",
				"type": "persistent",
				"fields": ["properties.species_list[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			}
		],
		work_eufgis: [
			{
				"name": "idx_geometry_hash",
				"type": "persistent",
				"fields": ["geometry_hash"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_gcu_id_number",
				"type": "persistent",
				"fields": "gcu_id_number",
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_gcu_id_unit-id",
				"type": "persistent",
				"fields": "gcu_id_unit-id",
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			}
		],
		final: [
			{
				"name": "idx_species",
				"type": "persistent",
				"fields": ["properties.species_list[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_pr",
				"type": "persistent",
				"fields": ["properties.env_climate_pr"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_tas",
				"type": "persistent",
				"fields": ["properties.env_climate_tas"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio01",
				"type": "persistent",
				"fields": ["properties.env_climate_bio01"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio04",
				"type": "persistent",
				"fields": ["properties.env_climate_bio04"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio05",
				"type": "persistent",
				"fields": ["properties.env_climate_bio05"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio06",
				"type": "persistent",
				"fields": ["properties.env_climate_bio06"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio12",
				"type": "persistent",
				"fields": ["properties.env_climate_bio12"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio15",
				"type": "persistent",
				"fields": ["properties.env_climate_bio15"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_vpd_mean",
				"type": "persistent",
				"fields": ["properties.env_climate_vpd_mean"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			}
		],
		final_eufgis: [
			{
				"name": "idx_gcu_id_number",
				"type": "persistent",
				"fields": ["properties.gcu_id_number_list[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_gcu_id_unit-id",
				"type": "persistent",
				"fields": ["properties.`gcu_id_unit-id_list`[*]"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": false,
				"unique": false
			},
			{
				"name": "idx_pr",
				"type": "persistent",
				"fields": ["properties.env_climate_pr"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_tas",
				"type": "persistent",
				"fields": ["properties.env_climate_tas"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio01",
				"type": "persistent",
				"fields": ["properties.env_climate_bio01"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio04",
				"type": "persistent",
				"fields": ["properties.env_climate_bio04"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio05",
				"type": "persistent",
				"fields": ["properties.env_climate_bio05"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio06",
				"type": "persistent",
				"fields": ["properties.env_climate_bio06"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio12",
				"type": "persistent",
				"fields": ["properties.env_climate_bio12"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_bio15",
				"type": "persistent",
				"fields": ["properties.env_climate_bio15"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			},
			{
				"name": "idx_vpd_mean",
				"type": "persistent",
				"fields": ["properties.env_climate_vpd_mean"],
				"estimates": true,
				"cacheEnabled": false,
				"deduplicate": false,
				"sparse": true,
				"unique": false
			}
		],
		stats: [
		]
	},
	pairs: {
		tas_pr: {
			key: "tas_pr",
			X: "env_climate_tas",
			Y: "env_climate_pr",
			collections: [
				{
					name: "tas_pr_chelsa_full",
					species: false,
					units: false
				},
				{
					name: "tas_pr_eu_full",
					species: true,
					units: false
				},
				{
					name: "tas_pr_eufgis_full",
					species: false,
					units: true
				},
				{
					name: "tas_pr_chelsa_round",
					species: false,
					units: false
				},
				{
					name: "tas_pr_eu_round",
					species: true,
					units: false
				},
				{
					name: "tas_pr_eufgis_round",
					species: false,
					units: true
				}
			]
		},
		bio01_bio12: {
			key: "bio01_bio12",
			X: "env_climate_bio01",
			Y: "env_climate_bio12",
			collections: [
				{
					name: "bio01_bio12_chelsa_full",
					species: false,
					units: false
				},
				{
					name: "bio01_bio12_eu_full",
					species: true,
					units: false
				},
				{
					name: "bio01_bio12_eufgis_full",
					species: false,
					units: true
				},
				{
					name: "bio01_bio12_chelsa_round",
					species: false,
					units: false
				},
				{
					name: "bio01_bio12_eu_round",
					species: true,
					units: false
				},
				{
					name: "bio01_bio12_eufgis_round",
					species: false,
					units: true
				}
			]
		},
		tas_bio12: {
			key: "bio01_bio12",
			X: "env_climate_tas",
			Y: "env_climate_bio12",
			collections: [
				{
					name: "tas_bio12_chelsa_full",
					species: false,
					units: false
				},
				{
					name: "tas_bio12_eu_full",
					species: true,
					units: false
				},
				{
					name: "tas_bio12_eufgis_full",
					species: false,
					units: true
				},
				{
					name: "tas_bio12_chelsa_round",
					species: false,
					units: false
				},
				{
					name: "tas_bio12_eu_round",
					species: true,
					units: false
				},
				{
					name: "tas_bio12_eufgis_round",
					species: false,
					units: true
				}
			]
		},
		bio06_vpd: {
			key: "bio06_vpd",
			X: "env_climate_bio06",
			Y: "env_climate_vpd_mean",
			collections: [
				{
					name: "bio06_vpd_chelsa_full",
					species: false,
					units: false
				},
				{
					name: "bio06_vpd_eu_full",
					species: true,
					units: false
				},
				{
					name: "bio06_vpd_eufgis_full",
					species: false,
					units: true
				},
				{
					name: "bio06_vpd_chelsa_round",
					species: false,
					units: false
				},
				{
					name: "bio06_vpd_eu_round",
					species: true,
					units: false
				},
				{
					name: "bio06_vpd_eufgis_round",
					species: false,
					units: true
				}
			]
		},
		bio14_bio15: {
			key: "bio14_bio15",
			X: "env_climate_bio14",
			Y: "env_climate_bio15",
			collections: [
				{
					name: "bio14_bio15_chelsa_full",
					species: false,
					units: false
				},
				{
					name: "bio14_bio15_eu_full",
					species: true,
					units: false
				},
				{
					name: "bio14_bio15_eufgis_full",
					species: false,
					units: true
				},
				{
					name: "bio14_bio15_chelsa_round",
					species: false,
					units: false
				},
				{
					name: "bio14_bio15_eu_round",
					species: true,
					units: false
				},
				{
					name: "bio14_bio15_eufgis_round",
					species: false,
					units: true
				}
			]
		}
	},
	settings: {
		maxRuntime: 0,      // No limit.
		timeout: 3600000    // One hour.
	}
})

#!/bin/sh

###
# Create temperature/precipitation pair, full resolution.
###

###
# Dump Chelsa full resolution temperature and precipitation.
###
echo "******************************************************************"
echo "* Dump Chelsa full resolution temperature and precipitation.      "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  'Chelsa_Temperature_Precipitation_FULL' \
  ./Workshop/species-distribution/queries/ChelsaFullTemperaturePrecipitation.aql \
  '{"@@collectionStats": "Stats", "@@collectionChelsa": "Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load Chelsa full resolution temperature and precipitation.
###
echo ""
echo "******************************************************************"
echo "* Load Chelsa full resolution temperature and precipitation.      "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  'Chelsa_Temperature_Precipitation_FULL' \
  'Chelsa_Temperature_Precipitation_FULL'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Dump EU-Forest full resolution temperature and precipitation.
###
echo ""
echo "******************************************************************"
echo "* Dump EU-Forest full resolution temperature and precipitation.   "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  'EU-Forest_Temperature_Precipitation_FULL' \
  ./Workshop/species-distribution/queries/EUFullTemperaturePrecipitation.aql \
  '{"@@collectionStats": "Stats", "@@collectionFinal": "EU-Forest_Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load EU-Forest full resolution temperature and precipitation.
###
echo ""
echo "******************************************************************"
echo "* Load EU-Forest full resolution temperature and precipitation.   "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  'EU-Forest_Temperature_Precipitation_FULL' \
  'EU-Forest_Temperature_Precipitation_FULL'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

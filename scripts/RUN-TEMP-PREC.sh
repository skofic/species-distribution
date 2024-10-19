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
# Set Chelsa temperature and precipitation statistics.
###
echo ""
echo "******************************************************************"
echo "* Set Chelsa temperature and precipitation statistics.            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteChelsaPairStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionPair": "Chelsa_Temperature_Precipitation_FULL", "key": "Chelsa_tas-pr", "indicatorA": "env_climate_tas", "indicatorB": "env_climate_pr"}'
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

###
# Set Chelsa temperature and precipitation statistics.
###
echo ""
echo "******************************************************************"
echo "* Set EU-Forest temperature and precipitation statistics.         "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteChelsaPairStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionPair": "EU-Forest_Temperature_Precipitation_FULL", "key": "EU-Forest_tas-pr", "indicatorA": "env_climate_tas", "indicatorB": "env_climate_pr"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

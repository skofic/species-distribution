#!/bin/sh

###
# Create indicators pair, full resolution.
#
# $1: Pair key.
# $2: Indicator X.
# $3: Indicator Y.
###

###
# GLOBALS
###
collectionChelsaFull="${1}_chelsa_full"
collectionEUFull="${1}_eu_full"
collectionEufgisFull="${1}_eufgis_full"

echo ""
echo "******************************************************************"
echo "*** Pair: ${2} and ${3}"
echo "*** in ${collectionChelsaFull}, ${collectionEUFull} and ${collectionEufgisFull}"
echo "******************************************************************"

###
# Dump Chelsa pair full resolution.
###
echo ""
echo "******************************************************************"
echo "* Dump Chelsa full resolution pair.                               "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionChelsaFull" \
  ./Workshop/species-distribution/queries/DumpChelsaPair.aql \
  "{\"@@collectionChelsa\": \"Chelsa\", \"indicatorX\": \"${2}\", \"indicatorY\": \"${3}\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load Chelsa full resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load Chelsa full resolution pair.                               "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionChelsaFull" \
  "$collectionChelsaFull"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Set Chelsa pair statistics.
###
echo ""
echo "******************************************************************"
echo "* Set Chelsa pair statistics.                                     "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WritePairStatsFull.aql \
  "{\"@@collectionStats\": \"Stats\", \"@@collectionPair\": \"${collectionChelsaFull}\", \"key\": \"${collectionChelsaFull}\", \"indicatorX\": \"${2}\", \"indicatorY\": \"${3}\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Dump EU-Forest full resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Dump EU-Forest full resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionEUFull" \
  ./Workshop/species-distribution/queries/DumpEUPair.aql \
  "{\"@@collectionFinal\": \"EU-Forest_Chelsa\", \"indicatorX\": \"$2\", \"indicatorY\": \"$3\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load EU-Forest full resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load EU-Forest full resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionEUFull" \
  "$collectionEUFull"
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
echo "* Set EU-Forest pair statistics.                                  "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WritePairStatsFull.aql \
  "{\"@@collectionStats\": \"Stats\", \"@@collectionPair\": \"$collectionEUFull\", \"key\": \"$collectionEUFull\", \"indicatorX\": \"$2\", \"indicatorY\": \"$3\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Dump EUFGIS pair full resolution.
###
echo ""
echo "******************************************************************"
echo "* Dump EUFGIS full resolution pair.                               "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionEufgisFull" \
  ./Workshop/species-distribution/queries/DumpEufgisPair.aql \
  "{\"@@collectionFinal\": \"EUFGIS_Chelsa\", \"indicatorX\": \"${2}\", \"indicatorY\": \"${3}\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load EUFGIS full resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load EUFGIS full resolution pair.                               "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionEufgisFull" \
  "$collectionEufgisFull"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Set EUFGIS pair statistics.
###
echo ""
echo "******************************************************************"
echo "* Set EUFGIS pair statistics.                                     "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WritePairStatsFull.aql \
  "{\"@@collectionStats\": \"Stats\", \"@@collectionPair\": \"$collectionEufgisFull\", \"key\": \"$collectionEufgisFull\", \"indicatorX\": \"$2\", \"indicatorY\": \"$3\"}"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

#!/bin/sh

###
# Create indicators pair, rounded resolution.
#
# $1: Pair key.
# $2: Indicator X.
# $3: Indicator Y.
# $4: Interval X.
# $5: Interval Y.
###

###
# GLOBALS
###
collectionChelsaFull="${1}_chelsa_full"
collectionEUFull="${1}_eu_full"
collectionEufgisFull="${1}_eufgis_full"
collectionChelsaRound="${1}_chelsa_round"
collectionEURound="${1}_eu_round"
collectionEufgisRound="${1}_eufgis_round"

echo ""
echo "******************************************************************"
echo "*** Pair: ${2} and ${3}"
echo "*** Intervals: ${4} and ${5}"
echo "*** in ${collectionChelsaRound}, ${collectionEURound} and ${collectionEufgisRound}"
echo "******************************************************************"

###
# Dump Chelsa pair rounded resolution.
###
echo ""
echo "******************************************************************"
echo "* Dump Chelsa rounded resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionChelsaRound" \
  ./Workshop/species-distribution/queries/DumpChelsaRoundedPair.aql \
  "{
      \"@@collectionFULL\": \"${collectionChelsaFull}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load Chelsa rounded resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load Chelsa rounded resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionChelsaRound" \
  "$collectionChelsaRound"
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
  ./Workshop/species-distribution/queries/WritePairStatsRounded.aql \
  "{
      \"@@collectionStats\": \"Stats\",
      \"@@collectionPair\": \"${collectionChelsaRound}\",
      \"key\": \"${collectionChelsaRound}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Dump EU-Forest pair rounded resolution.
###
echo ""
echo "******************************************************************"
echo "* Dump EU-Forest rounded resolution pair.                         "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionEURound" \
  ./Workshop/species-distribution/queries/DumpEURoundedPair.aql \
  "{
      \"@@collectionFULL\": \"${collectionEUFull}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load EU-Forest rounded resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load EU-Forest rounded resolution pair.                         "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionEURound" \
  "$collectionEURound"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Set EU-Forest pair statistics.
###
echo ""
echo "******************************************************************"
echo "* Set EU-Forest pair statistics.                                  "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WritePairStatsRounded.aql \
  "{
      \"@@collectionStats\": \"Stats\",
      \"@@collectionPair\": \"${collectionEURound}\",
      \"key\": \"${collectionEURound}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Dump EUFGIS pair rounded resolution.
###
echo ""
echo "******************************************************************"
echo "* Dump EUFGIS rounded resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  "$collectionEufgisRound" \
  ./Workshop/species-distribution/queries/DumpEufgisRoundedPair.aql \
  "{
      \"@@collectionFULL\": \"${collectionEufgisFull}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Load EUFGIS rounded resolution pair.
###
echo ""
echo "******************************************************************"
echo "* Load EUFGIS rounded resolution pair.                            "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  "$collectionEufgisRound" \
  "$collectionEufgisRound"
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
  ./Workshop/species-distribution/queries/WritePairStatsRounded.aql \
  "{
      \"@@collectionStats\": \"Stats\",
      \"@@collectionPair\": \"${collectionEufgisRound}\",
      \"key\": \"${collectionEufgisRound}\",
      \"indicatorX\": \"${2}\",
      \"indicatorY\": \"${3}\",
      \"intervalX\": \"${4}\",
      \"intervalY\": \"${5}\"
  }"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

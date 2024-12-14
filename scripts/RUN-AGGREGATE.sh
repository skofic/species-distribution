#!/bin/sh

###
# Aggregate Chelsa, EU-Forest and EUFGIS into a single collection.
#
# Each record is identified by the unique combination of the indicators
# pair values and contains a "properties" property listing the counts,
# species list and unit numbers featuring the indicators pair values.
#
# The aggregation will be executed for the three resolutions:
# full, medium and low.
#
# $1: Pair key, for instance "tas_pr".
# $2: Indicator X.
# $3: Indicator Y.
# $4: Resolutions list, for instance "full med low".
###

###
# GLOBALS
###
name_chelsa="${1}_chelsa"
name_eu="${1}_eu"
name_eufgis="${1}_eufgis"

echo ""
echo "******************************************************************"
echo "*** Pair: ${2} and ${3}"
echo "******************************************************************"

###
# Iterate resolutions.
###
for resolution in $4; do

  echo ""
  echo "******************************************************************"
  echo "*** Pair: ${2} and ${3}"
  echo "*** in ${name_chelsa}_${resolution}, ${name_eu}_${resolution} and ${name_eufgis}_${resolution}"
  echo "******************************************************************"

  ####
  ## Dump aggregate.
  ####
  echo ""
  echo "******************************************************************"
  echo "* Dump aggregate."
  echo "******************************************************************"
  sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
    SpeciesOccurrences \
    "${1}_${resolution}" \
    ./Workshop/species-distribution/queries/AGGREGATE.aql \
    "{\"@@collection_chelsa\": \"${name_chelsa}_${resolution}\", \"@@collection_eu\": \"${name_eu}_${resolution}\", \"@@collection_eufgis\": \"${name_eufgis}_${resolution}\", \"indicator_1\": \"${2}\", \"indicator_2\": \"${3}\"}"
  if [ $? -ne 0 ]
  then
    echo "*************"
    echo "*** ERROR ***"
    echo "*************"
    exit 1
  fi

  ###
  # Load aggregate.
  ###
  echo ""
  echo "******************************************************************"
  echo "* Load ${1}_${resolution} aggregate."
  echo "******************************************************************"
  sh ./Workshop/species-distribution/scripts/import_collection.sh \
    SpeciesOccurrences \
    "${1}_${resolution}" \
    "${1}_${resolution}"
  if [ $? -ne 0 ]
  then
    echo "*************"
    echo "*** ERROR ***"
    echo "*************"
    exit 1
  fi

done

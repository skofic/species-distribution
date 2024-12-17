#!/bin/sh

###
# Populate database.
###

###
# Aggregate EU-Forest_Species by location.
###
echo ""
echo "******************************************************************"
echo "* Aggregate EU-Forest_Species by location.                        "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/AggregateSpecies.aql \
  '{"@@collectionSpecies": "EU-Forest_Species", "@@collectionOccurrences": "EU-Forest_Occurrences"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Set Chelsa grid reference in species occurrences.
###
echo ""
echo "******************************************************************"
echo "* Set Chelsa grid reference in species occurrences.               "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/LinkSpeciesToChelsa.aql \
  '{"@@collectionWork": "EU-Forest_Work", "@@collectionChelsa": "Chelsa", "@@collectionOccurrences": "EU-Forest_Occurrences"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Remove species occurrences out of Chelsa coordinates grid.
###
echo ""
echo "******************************************************************"
echo "* Remove species occurrences out of Chelsa coordinates grid.      "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/RemoveUnlinkedOccurrences.aql \
  '{"@@collectionWork": "EU-Forest_Work"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Combine EU-Forest species occurrences with matching Chelsa grid elements.
###
echo ""
echo "******************************************************************"
echo "* Aggregate EU-Forest species occurrences by Chelsa grid.         "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/CombineSpeciesWithChelsa.aql \
  '{"@@collectionWork": "EU-Forest_Work", "@@collectionChelsa": "Chelsa", "@@collectionFinal": "EU-Forest_Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

##
# Following block inserts records into a collection,
# The following two blocks do the same, except that
# they dum to file and load from file.
##

####
## Insert Chelsa grid reference in EUFGIS units.
####
#echo ""
#echo "******************************************************************"
#echo "* Insert Chelsa grid reference in EUFGIS units.                      "
#echo "******************************************************************"
#sh ./Workshop/species-distribution/scripts/execute_aql.sh \
#  SpeciesOccurrences \
#  ./Workshop/species-distribution/queries/LinkEufgisToChelsa.aql \
#  '{"@@collectionWork": "EUFGIS_Work", "@@collectionChelsa": "Chelsa", "@@collectionShapes": "Shapes", "@@collectionUnits": "UnitPolygons"}'
#if [ $? -ne 0 ]
#then
#	echo "*************"
#	echo "*** ERROR ***"
#	echo "*************"
#	exit 1
#fi

###
# Dump Chelsa grid reference in EUFGIS units.
###
echo ""
echo "******************************************************************"
echo "* Dump Chelsa grid reference in EUFGIS units."
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/export_aql_jsonl.sh \
  SpeciesOccurrences \
  EUFGIS_Work \
  ./Workshop/species-distribution/queries/DumpLinkEufgisToChelsa.aql \
  '{"@@collectionChelsa": "Chelsa", "@@collectionShapes": "Shapes", "@@collectionUnits": "UnitPolygons"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Set Chelsa grid reference in EUFGIS units.
###
echo ""
echo "******************************************************************"
echo "* Load Chelsa grid reference in EUFGIS units."
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/import_collection.sh \
  SpeciesOccurrences \
  EUFGIS_Work \
  EUFGIS_Work
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Combine EUFGIS units with matching Chelsa grid elements.
###
echo ""
echo "******************************************************************"
echo "* Aggregate EUFGIS units by Chelsa grid.                          "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/CombineEufgisWithChelsa.aql \
  '{"@@collectionWork": "EUFGIS_Work", "@@collectionChelsa": "Chelsa", "@@collectionFinal": "EUFGIS_Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Write Chelsa selected indicators statistics.
###
echo ""
echo "******************************************************************"
echo "* Write Chelsa selected indicators statistics.                    "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteChelsaStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionChelsa": "Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Write EU-Forest selected indicators statistics.
###
echo ""
echo "******************************************************************"
echo "* Write EU-Forest selected indicators statistics.                 "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteEUStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionFinal": "EU-Forest_Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Write EUFGIS selected indicators statistics.
###
echo ""
echo "******************************************************************"
echo "* Write EUFGIS selected indicators statistics.                    "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteEufgisStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionFinal": "EUFGIS_Chelsa"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

###
# Write EU-Forest species into statistics.
###
echo ""
echo "******************************************************************"
echo "* Write EU-Forest list of species into statistics.                "
echo "******************************************************************"
sh ./Workshop/species-distribution/scripts/execute_aql.sh \
  SpeciesOccurrences \
  ./Workshop/species-distribution/queries/WriteSpeciesStats.aql \
  '{"@@collectionStats": "Stats", "@@collectionSpecies": "EU-Forest_Species"}'
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

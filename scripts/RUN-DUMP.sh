#!/bin/sh

###
# Dump collections required by services.
#
# The script will dump all aggregated collections to a JSONL file.
# The dump file is not in compressed format and has the collection name.
#
# $1: Database name.
# $2: Pair keys, for instance "tas_pr bio01_bio12".
# $3: Resolutions list, for instance "full med low".
###

###
# Load default parameters.
###
source "${HOME}/.ArangoDB"

###
# Check parameters.
###
if [ "$#" -ne 3 ]
then
    echo "Usage: RUN-DUMP.sh <database> <pairs> <resolutions>"
	exit 1
fi

echo "******************************************"
echo "*** EXPORT COLLECTIONS IN JSONL FORMAT ***"
echo "******************************************"
echo "* Database:    ${1}"
echo "* Pairs:       ${2}"
echo "* Resolutions: ${3}"
echo "******************************************"

###
# GLOBALS
###
cache="${path}/cache"
folder="${path}/export"

###
# Iterate pairs.
###
for pair in $2; do

  ###
  # Iterate resolutions.
  ###
  for resolution in $3; do

    echo ""
    echo "******************************************************************"
    echo "*** Dumping collection: ${pair}_${resolution}"
    echo "******************************************************************"

    ###
    # Execute.
    ###
    arangoexport \
      --server.endpoint "$host" \
      --server.username "$user" \
      --server.password "$pass" \
      --output-directory "$cache" \
      --server.database "$1" \
      --collection "${pair}_${resolution}" \
      --type "jsonl" \
      --compress-output false \
      --overwrite true \
      --progress true
    if [ $? -ne 0 ]
    then
      echo "*************"
      echo "*** ERROR ***"
      echo "*************"
      exit 1
    fi

    ###
    # Name dump to the collection name.
    ###
    mv -f "${cache}/${pair}_${resolution}.jsonl" "${folder}/${pair}_${resolution}.jsonl"
    if [ $? -ne 0 ]
    then
      echo "*************"
      echo "*** ERROR ***"
      echo "*************"
      exit 1
    fi

  done

done

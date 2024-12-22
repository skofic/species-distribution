#!/bin/sh

###
# Load collections required by services.
#
# The script will load all aggregated collections from a JSONL file.
# The dump file is not in compressed format and has the collection name.
#
# $1: Database name.
# $2: Pair keys, for instance "tas_pr bio01_bio12".
# $3: Resolutions list, for instance "full med low".
# $4: Export directory containing the dump files.
###

###
# Load default parameters.
###
source "${HOME}/.ArangoDB"

###
# Check parameters.
###
if [ "$#" -ne 4 ]
then
    echo "Usage: RUN-DUMP.sh <database> <pairs> <resolutions> <dump directory>"
	exit 1
fi

echo "******************************************"
echo "*** EXPORT COLLECTIONS IN JSONL FORMAT ***"
echo "******************************************"
echo "* Database:    ${1}"
echo "* Pairs:       ${2}"
echo "* Resolutions: ${3}"
echo "* Directory:   ${4}"
echo "******************************************"

###
# GLOBALS
###
cache="${path}/cache"
folder="${path}/export/${4}"

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
    echo "*** Loading collection: ${pair}_${resolution}"
    echo "******************************************************************"

    ###
    # Execute.
    ###
    arangoimport \
        --auto-rate-limit true \
        --server.endpoint "$host" \
        --server.username "$user" \
        --server.password "$pass" \
        --server.database "$1" \
        --collection "${pair}_${resolution}" \
        --create-database true \
        --create-collection true \
        --create-collection-type "document" \
        --overwrite true \
        --file "${folder}/${pair}_${resolution}.jsonl" \
        --type "jsonl" \
        --progress true
    if [ $? -ne 0 ]
    then
        echo "*************"
        echo "*** ERROR ***"
        echo "*************"
        exit 1
    fi

  done

done

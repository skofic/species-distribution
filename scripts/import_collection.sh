#!/bin/sh
# $1: Database name.
# $2: Collection name.
# $3: Import file base name

###
# Import collection.
# Expects database name, collection name and import file name.
#
# The dump file should be in compressed JSONL format and be in the data/export directory.
# Provide only the file base name.
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
    echo "Usage: import_collection.sh <database> <collection> <JSONL file name>"
	exit 1
fi

###
# Globals.
###
path="/home/Workshop/species-distribution/data"
cache="${path}/cache"
folder="${path}/export"

###
# Execute.
###
arangoimport \
	--server.endpoint "$host" \
	--server.username "$user" \
	--server.password "$pass" \
	--server.database "$1" \
	--collection "$2" \
	--create-database true \
	--create-collection true \
	--create-collection-type "document" \
	--overwrite true \
	--file "${folder}/${2}.jsonl.gz" \
	--type "jsonl" \
	--progress true
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

#!/bin/sh
# $1: Database name.
# $2: File name.
# $3: AQL query file path.
# $4: AQL query bind variables.

###
# Export AQL query as JSONL file.
#
# Expects database name, export file name and query file path as parameters.
# Will store in folder "export" and use folder "cache" for temporary work.
#
# The dump file will be in JSONL compressed format.
#
# The script assumes there is a file named '.ArangoDB' in the directory $HOME
# containing the following lines:
#
# host=<database endpoint>
# user=<database user>
# pass=<database user password>
# path="/home/ArangoDB"
#
# Note that the path will be ignored here.
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
    echo "Usage: sh export_aql_jsonl.sh <database> <export file name> <AQL query file path> <AQL query bind variables>"
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
arangoexport \
	--server.endpoint "$host" \
	--server.username "$user" \
	--server.password "$pass" \
	--output-directory "$cache" \
	--server.database "$1" \
	--type "jsonl" \
	--compress-output true \
	--overwrite true \
	--progress true \
	--documents-per-batch 100 \
	--custom-query-file "$3" \
	--custom-query-bindvars "$4"
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
mv -f "${cache}/query.jsonl.gz" "${folder}/${2}.jsonl.gz"
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

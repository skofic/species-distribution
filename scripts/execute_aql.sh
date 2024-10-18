#!/bin/sh
# $1: Database name.
# $3: AQL query file path.
# $4: AQL query bind variables.

###
# Execute AQL query.
#
# Expects database name, query file path and bind variables.
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
if [ "$#" -ne 3 ]
then
    echo "Usage: sh execute_aql.sh <database> <AQL query file path> <AQL query bind variables>"
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
	--output-directory "$cache" \
	--server.database "$1" \
	--type "jsonl" \
	--compress-output true \
	--overwrite true \
	--progress true \
	--custom-query-file "$2" \
	--custom-query-bindvars "$3" \
	--custom-query-max-runtime 3600
if [ $? -ne 0 ]
then
	echo "*************"
	echo "*** ERROR ***"
	echo "*************"
	exit 1
fi

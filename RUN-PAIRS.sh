#!/bin/sh

###
# Create all pairs full resolution.
###

sh /home/Workshop/species-distribution/scripts/RUN-PAIR.sh "bio01_bio12" "env_climate_bio01" "env_climate_bio12"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR.sh "bio06_vpd" "env_climate_bio06" "env_climate_vpd_mean"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR.sh "bio14_bio15" "env_climate_bio14" "env_climate_bio15"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR.sh "tas_bio12" "env_climate_tas" "env_climate_bio12"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR.sh "tas_pr" "env_climate_tas" "env_climate_pr"

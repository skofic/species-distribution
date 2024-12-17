#!/bin/sh

###
# Create all pairs rounded resolution.
###

sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio01_bio12" "env_climate_bio01" "env_climate_bio12" 0 14.46 "med"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio01_bio12" "env_climate_bio01" "env_climate_bio12" 0.194 27.4 "low"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio06_vpd" "env_climate_bio06" "env_climate_vpd_mean" 0 5.38 "med"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio06_vpd" "env_climate_bio06" "env_climate_vpd_mean" 0.225 11.8 "low"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio14_bio15" "env_climate_bio14" "env_climate_bio15" 0.613 0.271 "med"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "bio14_bio15" "env_climate_bio14" "env_climate_bio15" 1.7 0.755 "low"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "tas_bio12" "env_climate_tas" "env_climate_bio12" 0.07 10.0 "med"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "tas_bio12" "env_climate_tas" "env_climate_bio12" 0.21 30.0 "low"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "tas_pr" "env_climate_tas" "env_climate_pr" 0.07 0.9 "med"
sh /home/Workshop/species-distribution/scripts/RUN-PAIR-ROUND.sh "tas_pr" "env_climate_tas" "env_climate_pr" 0.212 2.79 "low"

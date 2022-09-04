# I will navigate to /var/spool/cron/crontabs
# This is not a systemwide cron job, it is specific to me
# I will execute contab -e
# I will edit the contabs file to say:
# 0 17 * * * ./home/thetaxgaap/TheTaxGaap/jdm_chron_report.sh


# Then, I create the following file with the .sh suffix in the appropriate file folder (see above)


# The appropriate shebang address can be found
# by 'which bash' from the command line

#! /usr/bin/bash

# Send e-mail to ME
# First, ensure you have installed mailutils
# $ sudo apt install mailutils
# When Mongo is given a file... It Knows to Exit the Shell!
# Otherwise This Would Get Hung Up as It Would be Open in Interactive Mode
mongo bash_query.js > /tmp/thetaxgaap_status.email

mail -s 'Daily Update' -a 'From:Admin\<admin@thetaxgaap.com\> jmcdon35@uic.edu' < /tmp/thetaxgaap_status.email  

exit 1


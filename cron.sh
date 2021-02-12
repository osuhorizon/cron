echo entering lets

cd /PATH/TO/LETS

echo recalculating scores

python3.6 tomejerry.py -r

python3.6 tomejerry-relax.py -r

python3.6 tomejerry-auto.py -r

python3.6 tomejerry-v2.py -r

echo entering cron

cd /PATH/TO/CRON/js

echo Removing Privileges

node restrict.js

cd /PATH/TO/CRON

echo using cron

python3.6 cron.py

echo Privileges reset

cd /PATH/TO/CRON/js

node unrestrict.js

echo everything done! Going to sleep.

sleep 24h

./cron.sh
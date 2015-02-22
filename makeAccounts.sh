# makeAccounts.sh <number of accouts>

function max5 {
   while [ `jobs | wc -l` -ge 5 ]
   do
      sleep 2
   done
}
for i in `seq 1 $1`;
do
  max5; node app &
done 
wait

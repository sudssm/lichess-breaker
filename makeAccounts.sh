# makeAccounts.sh <number of accouts>

for i in `seq 1 $1`;
do
  node app&
done 
wait

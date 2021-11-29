#! /bin/sh

DAY=$2;
DIR="day-$DAY"

if [ -z "$DAY" ] 2> /dev/null
then 
  echo "❌ day needs to be supplied (e.g. npm run day 6), please try again!\n"
  exit 0 
fi

if [ "$DAY" -eq "$DAY" ] 2> /dev/null
then
  echo "";
else
  echo "❌ day needs to be a number (e.g. npm run day 13), please try again!\n"
  exit 0 
fi

if [ "$DAY" -le 0 ] 2> /dev/null
then
  echo "❌ day needs to be between 1-31, please try again!\n" 
  exit 0
fi

if [ "$DAY" -ge 32 ] 2> /dev/null
then
  echo "❌ day needs to be between 1-31, please try again!\n" 
  exit 0
fi

echo "🛠 setting up exercise for day $DAY";

mkdir -p $DIR;
cp __template__/index.js $DIR;

if [ ! -f session.txt ];
then
  echo "\r\n👋 to scaffold things for you, I need your adventofcode.com session id (you will only need to do this once)";
  echo "\r\n1. pls ensure you are authenticated at https://adventofcode.com/2020/day/${DAY}";
  echo "2. find your browsers session cookie and paste in the value below (waiting...)";

  read SESSION;

  echo $SESSION | sed s/session=// > session.txt;
  sleep 0.5
  echo "✨ success!"
fi

SESSION_ID=`cat session.txt`;

curl --request GET \
  --silent \
  --url "https://adventofcode.com/2021/day/$DAY/input" \
  --header "cookie: session=$SESSION_ID" \
  --cookie "session=$SESSION_ID" >> $DIR/input.txt

echo "\n🎉 $DIR is ready to go. good luck!\n";

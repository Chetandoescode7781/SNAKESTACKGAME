#!/bin/bash

FILE="history.txt"

while true; do
  echo "1. Query by user"
  echo "2. View recent games"
  echo "3. Analytics"
  echo "4. Delete entries"
  echo "5. Log rotation"
  echo "6. Sort view"
  echo "7. Exit"
  read -p "Choose option: " opt

  case $opt in
    1) 
      read -p "Enter username: " user
      grep "$user" "$FILE"
      ;;
    2) 
      tail -n 10 "$FILE"
      ;;
    3) 
      read -p "Enter username for analytics: " user
      grep "$user" "$FILE" | head -n 10 | awk -F'|' '{sum+=$2; count++} END {if(count>0) print "Mean Score (first 10):", sum/count; else print "No entries found."}'
      ;;
    4) 
      echo "Delete Options:"
     
      echo "a) By date"
      echo "b) By score"
      read -p "Choose option: " delopt
      case $delopt in
        a) read -p "Enter date (YYYY-MM-DD) to delete: " date; sed -i "/$date/d" "$FILE" ;;
        b) read -p "Enter score to delete: " score; sed -i "/| $score |/d" "$FILE" ;;
      esac
      ;;
    5) 
      cp "$FILE" backup.txt
      tail -n 10 "$FILE" > "$FILE"
      ;;
    6) 
      echo "Sort Options:"
      echo "a) By recent date"
      echo "b) By score"
      read -p "Choose option: " sortopt
      case $sortopt in
        a) sort -k1,1 "$FILE" ;;   # assumes timestamp at start of line
        b) sort -t'|' -k2 -n "$FILE" ;;
      esac
      ;;
    7) 
      exit
      ;;
  esac
done

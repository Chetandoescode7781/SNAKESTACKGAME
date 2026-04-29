#!/bin/bash
HISTORY="history.txt"

check_file() {
    if [ ! -f "$HISTORY" ]; then
        echo "Error: history.txt not found!"
        exit 1
    fi
    if [ ! -s "$HISTORY" ]; then
        echo "Error: No games played!"
        exit 1
    fi
}

view_all() {
    check_file
    cat "$HISTORY"
    echo "Total records: $(wc -l < "$HISTORY")" 
}

user_stats() {
    check_file
    echo "Enter username: "
    read username
    result=$(grep "$username" "$HISTORY")
    if [[ -z "$result" ]]; then
        echo "No records found :("
    else
        echo "$username stats:"
        echo "$result"
    fi
}

view_recent() {
    check_file
    echo "Recent games:"
    tail -n 10 "$HISTORY"
}

analytics() {
    check_file
    total="$(wc -l < "$HISTORY")"
    echo "Total games: $total"

    avg_score=$(awk -F '|' '{sum += $2} END {printf "%.1f", sum/NR}' "$HISTORY")
    echo "average score= $avg_score"

    high_score=$(awk -F '|' '{if($2>max) max=$2} END {print max}' "$HISTORY")
    echo "High score= $high_score"

    avg_duration=$(awk -F'|' '{sum += $4} END {printf "%.1f", sum/NR}' "$HISTORY")
    echo "Average duration= ${avg_duration}s"

    wall_death=$(grep -c "WALL" "$HISTORY")
    echo "Wall deaths= $wall_death"

    self_death=$(grep -c "SELF" "$HISTORY")
    echo "Self deaths= $self_death"

}

sort_result(){
    check_file
    sort -t '|' -k4,4 -rn "$HISTORY"
}

delete_user(){
    check_file
    echo "Enter the Username:"
    read username
    result=$(grep "$username" "$HISTORY")
    if [ -z "$result" ]; then
        echo "No records found :("
    else
        echo "Are you sure: Y or N"
        read confirm
        if [ "$confirm" == "Y" ]; then
            sed -i "/$username/d" "$HISTORY"
            echo "records deleted"
        else
            echo "Cancelled"
        fi
    fi
}

log_rotation(){
    check_file
    backup="history_backup_$(date +%Y%m%d_%H%M%S).txt"
    cp "$HISTORY" "$backup"
    echo "Backup created: $backup"

    tail -n 10 "$HISTORY" > temp.txt
    mv temp.txt "$HISTORY"
    echo "Log rotated, only recent 10 records kept."
}

show_menu() {
    

    while true; do
        echo "Admin Menu:"
        echo "1. View all game records"
        echo "2. View user statistics"
        echo "3. View recent games"
        echo "4. Analytics"
        echo "5. Sort results by duration"
        echo "6. Delete user records"
        echo "7. Log rotation"
        echo "8. Exit"
        echo "Enter your choice (1-8): "
        read choice
        case $choice in
            1) view_all ;;
            2) user_stats ;;
            3) view_recent ;;
            4) analytics ;;
            5) sort_result ;;
            6) delete_user ;;
            7) log_rotation ;;
            8) echo "Exiting..."; exit 0 ;;
            *) echo "Ivalid, please enter a number between 1 and 8." ;;
        esac
        echo ""
        echo -n "Press any key to continue..."
        read
    done
}
 show_menu

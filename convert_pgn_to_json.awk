BEGIN {
    ORS=""
    isFirst = 1
    if (ARGC < 2) {
        print("PGN file is not provided.")
        exit_invoked = 1
        exit
    } else print("[")
}
{
    # remove square brackets to make parsing easier
    gsub(/[\[\]]/, "", $0)
    if($1 ~ /^Event$/)           { event = $2; next }
    if($1 ~ /^Site$/)            { site = $2; next }
    if($1 ~ /^Date$/)            { date = $2; next }
    if($1 ~ /^White$/)           { white = $2; next }
    if($1 ~ /^Black$/)           { black = $2; next }
    if($1 ~ /^Result$/)          { result = $2; next }
    if($1 ~ /^UTCDate$/)         { utcDate = $2; next }
    if($1 ~ /^UTCTime$/)         { utcTime = $2; next }
    if($1 ~ /^WhiteElo$/)        { whiteElo = $2; next }
    if($1 ~ /^BlackElo$/)        { blackElo = $2; next }
    if($1 ~ /^WhiteRatingDiff$/) { whiteRatingDiff = $2; next }
    if($1 ~ /^BlackRatingDiff$/) { blackRatingDiff = $2; next }
    if($1 ~ /^Variant$/)         { variant = $2; next }
    if($1 ~ /^TimeControl$/)     { timeControl = $2; next }
    if($1 ~ /^ECO$/)             { ECO = $2; next }
    if($1 ~ /^Opening$/)         { opening = $2; next }
    if($1 ~ /^Termination$/)     { termination = $2; next }

    moves = ""
    if($1 ~ /^1/) {
        if ($0 ~ /%clk/ && $0 ~ /%eval/) {
            for (i = 2; i < NF; i++) {
                if($(i-1) ~ /%clk/) {
                    clock = $i
                    eval = $(i-2)
                    move = $(i-5)
                    moves = moves sprintf("{\"m\":\"%s\",\"e\":\"%s\",\"c\":\"%s\"},", move, eval, clock)
                }
            }
        }
        else if ($0 ~ /%eval/) {
            for (i = 2; i < NF; i++) {
                if($(i-1) ~ /%eval/) {
                    eval = $i
                    move = $(i-3)
                    moves = moves sprintf("{\"m\":\"%s\",\"e\":\"%s\"},", move, eval)
                }
            }
        }
        else if ($0 ~ /%clk/) {
            for (i = 2; i < NF; i++) {
                if($(i-1) ~ /%clk/) {
                    clock = $i
                    move = $(i-3)
                    moves = moves sprintf("{\"m\":\"%s\",\"c\":\"%s\"},", move, clock)
                }
            }
        } else {
            for (i = 2; i < NF; i++) {
                if($i !~ /^[0-9]+\./) {
                    moves = moves sprintf("{\"m\":\"%s\"},", $i)
                }
            }
        }


        print((isFirst ? "" : ",") "{")
        printf("\"event\":%s,", event)
        printf("\"site\":%s,", site)
        printf("\"date\":%s,", date)
        printf("\"white\":%s,", white)
        printf("\"black\":%s,", black)
        printf("\"result\":%s,", result)
        printf("\"utcDate\":%s,", utcDate)
        printf("\"utcTime\":%s,", utcTime)
        printf("\"whiteElo\":%s,", whiteElo)
        printf("\"blackElo\":%s,", blackElo)
        # whiteRatingDiff and blackRatingDiff can be empty
        printf("\"whiteRatingDiff\":%s,", whiteRatingDiff ? whiteRatingDiff : "null")
        printf("\"blackRatingDiff\":%s,", blackRatingDiff ? blackRatingDiff : "null")
        printf("\"variant\":%s,", variant)
        printf("\"timeControl\":%s,", timeControl)
        printf("\"ECO\":%s,", ECO)
        printf("\"opening\":%s,", opening)
        printf("\"termination\":%s,", termination)
        printf("\"moves\":[%s]", substr(moves, 1, length(moves) - 1)) # substr removes trailing comma
        print("}")

        isFirst = 0;
        event = null;
        game_id = null;
        date = null;
        white = null;
        black = null;
        result = null;
        utcDate = null;
        utcTime = null;
        whiteElo = null;
        blackElo = null;
        whiteRatingDiff = null;
        blackRatingDiff = null;
        variant = null;
        timeControl = null;
        ECO = null;
        opening = null;
        termination = null;
    }
}
END {
    if (!exit_invoked)
        print("]")
}

BEGIN {
    ORS=""
    isFirst = 1
    if (ARGC < 2) {
        print("PGN file is not provided.")
        exit_invoked = 1
        exit
    } else print("[")
}

# PGN tag pair
/^\[/ {
    gsub(/[\[\]]/, "", $0)
    if (!in_record) {
      print((isFirst ? "" : ",") "{")
    }
    printf("\"%s\":%s,", $1, $2 ? $2 : "null")
    in_record = 1
    next
}

# Movetext
/^1\./ {
        gsub(/[\[\]]/, "", $0)
        moves = ""
        if ($0 ~ /%clk/ && $0 ~ /%eval/) {
            for (i = 2; i < NF; i++) {
                if ($(i-1) ~ /%clk/) {
                    clock = $i
                    eval = $(i-2)
                    move = $(i-5)
                    moves = moves sprintf("{\"m\":\"%s\",\"e\":\"%s\",\"c\":\"%s\"},", move, eval, clock)
                }
            }
        }
        else if ($0 ~ /%eval/) {
            for (i = 2; i < NF; i++) {
                if ($(i-1) ~ /%eval/) {
                    eval = $i
                    move = $(i-3)
                    moves = moves sprintf("{\"m\":\"%s\",\"e\":\"%s\"},", move, eval)
                }
            }
        }
        else if ($0 ~ /%clk/) {
            for (i = 2; i < NF; i++) {
                if ($(i-1) ~ /%clk/) {
                    clock = $i
                    move = $(i-3)
                    moves = moves sprintf("{\"m\":\"%s\",\"c\":\"%s\"},", move, clock)
                }
            }
        }
        else {
            for (i = 2; i < NF; i++) {
                if ($i !~ /^[0-9]+\./) {
                    moves = moves sprintf("{\"m\":\"%s\"},", $i)
                }
            }
        }


        printf("\"moves\":[%s]", substr(moves, 1, length(moves) - 1)) # substr removes trailing comma
        print("}")

        isFirst = 0
        in_record = 0

}

END {
    if (!exit_invoked)
        print("]")
}

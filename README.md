# Convert lichess pgn file to json

[![build](https://app.travis-ci.com/blevantovych/lichess-pgn-to-json.svg?branch=main)](https://app.travis-ci.com/github/blevantovych/lichess-pgn-to-json)

A simple awk script to generate a json file from lichess PGN file.

## Features

- Input file may contain multiple games
- Handles games with clock, evaluation info

## Limitations

- doesn't handle pgn with move comments
- all moves in a game should be on one line
- if a game has computer evaluation and/or clock information, every move should have them

## AWK version
GNU Awk 5.3.0, API 4.0, (GNU MPFR 4.2.1, GNU MP 6.3.0)

## Usage

```sh
awk -vFPAT='([^ ]*)|("[^"]+")' -f convert_pgn_to_json.awk game.pgn
```

## Development

To run tests nodejs needs to be installed

```sh
npm install
npm test
```

## Example

Contents of the input file

```
[Event "Rated Bullet game"]
[Site "https://lichess.org/CdwUKIHh"]
[Date "2022.06.29"]
[White "DrNykterstein"]
[Black "Blazinq"]
[Result "1-0"]
[UTCDate "2022.06.29"]
[UTCTime "22:34:25"]
[WhiteElo "3279"]
[BlackElo "3038"]
[WhiteRatingDiff "+2"]
[BlackRatingDiff "-2"]
[WhiteTitle "GM"]
[BlackTitle "FM"]
[Variant "Standard"]
[TimeControl "60+0"]
[ECO "B23"]
[Opening "Sicilian Defense: Closed"]
[Termination "Normal"]

1. e4 { [%eval 0.33] [%clk 0:01:00] } 1... c5 { [%eval 0.32] [%clk 0:01:00] } 2. Nc3 { [%eval 0.24] [%clk 0:01:00] } 2... d6 { [%eval 0.36] [%clk 0:00:59] } 3. f4 { [%eval 0.0] [%clk 0:01:00] } 3... g6 { [%eval 0.15] [%clk 0:00:58] } 4. Nf3 { [%eval 0.0] [%clk 0:01:00] } 4... Bg7 { [%eval 0.0] [%clk 0:00:58] } 5. Bb5+ { [%eval 0.0] [%clk 0:00:59] } 5... Bd7 { [%eval 0.06] [%clk 0:00:58] } 6. a4 { [%eval 0.03] [%clk 0:00:58] } 6... a6 { [%eval 0.28] [%clk 0:00:56] } 7. Bc4 { [%eval -0.02] [%clk 0:00:57] } 7... e6 { [%eval 0.0] [%clk 0:00:55] } 8. O-O { [%eval -0.48] [%clk 0:00:57] } 8... Ne7 { [%eval 0.14] [%clk 0:00:54] } 9. d3 { [%eval -0.36] [%clk 0:00:56] } 9... O-O { [%eval -0.08] [%clk 0:00:54] } 10. Qe1 { [%eval -0.23] [%clk 0:00:56] } 10... Nbc6 { [%eval -0.22] [%clk 0:00:53] } 11. f5 { [%eval -0.42] [%clk 0:00:55] } 11... gxf5 { [%eval -0.44] [%clk 0:00:52] } 12. Qh4 { [%eval -1.58] [%clk 0:00:55] } 12... Ng6 { [%eval -0.22] [%clk 0:00:51] } 13. Qh5 { [%eval -0.69] [%clk 0:00:54] } 13... Nce5 { [%eval 0.11] [%clk 0:00:47] } 14. exf5 { [%eval -0.39] [%clk 0:00:52] } 14... Nxc4 { [%eval 6.95] [%clk 0:00:42] } 15. Ng5 { [%eval 6.56] [%clk 0:00:48] } 15... h6 { [%eval 6.68] [%clk 0:00:39] } 16. f6 { [%eval 6.27] [%clk 0:00:46] } 16... hxg5 { [%eval 5.7] [%clk 0:00:30] } 17. Bxg5 { [%eval 5.38] [%clk 0:00:42] } 17... Re8 { [%eval 7.51] [%clk 0:00:16] } 18. fxg7 { [%eval 7.39] [%clk 0:00:39] } 18... Qb6 { [%eval 14.21] [%clk 0:00:16] } 19. Bf6 { [%eval #2] [%clk 0:00:34] } 1-0
```

Output (unminified)

```json
[
  {
    "Event": "Rated Bullet game",
    "Site": "https://lichess.org/CdwUKIHh",
    "Date": "2022.06.29",
    "White": "DrNykterstein",
    "Black": "Blazinq",
    "Result": "1-0",
    "UTCDate": "2022.06.29",
    "UTCTime": "22:34:25",
    "WhiteElo": "3279",
    "BlackElo": "3038",
    "WhiteRatingDiff": "+2",
    "BlackRatingDiff": "-2",
    "WhiteTitle": "GM",
    "BlackTitle": "FM",
    "Variant": "Standard",
    "TimeControl": "60+0",
    "ECO": "B23",
    "Opening": "Sicilian Defense: Closed",
    "Termination": "Normal",
    "moves": [
      {
        "m": "e4",
        "e": "0.33",
        "c": "0:01:00"
      },
      {
        "m": "c5",
        "e": "0.32",
        "c": "0:01:00"
      },
      {
        "m": "Nc3",
        "e": "0.24",
        "c": "0:01:00"
      },
      {
        "m": "d6",
        "e": "0.36",
        "c": "0:00:59"
      },
      {
        "m": "f4",
        "e": "0.0",
        "c": "0:01:00"
      },
      {
        "m": "g6",
        "e": "0.15",
        "c": "0:00:58"
      },
      {
        "m": "Nf3",
        "e": "0.0",
        "c": "0:01:00"
      },
      {
        "m": "Bg7",
        "e": "0.0",
        "c": "0:00:58"
      },
      {
        "m": "Bb5+",
        "e": "0.0",
        "c": "0:00:59"
      },
      {
        "m": "Bd7",
        "e": "0.06",
        "c": "0:00:58"
      },
      {
        "m": "a4",
        "e": "0.03",
        "c": "0:00:58"
      },
      {
        "m": "a6",
        "e": "0.28",
        "c": "0:00:56"
      },
      {
        "m": "Bc4",
        "e": "-0.02",
        "c": "0:00:57"
      },
      {
        "m": "e6",
        "e": "0.0",
        "c": "0:00:55"
      },
      {
        "m": "O-O",
        "e": "-0.48",
        "c": "0:00:57"
      },
      {
        "m": "Ne7",
        "e": "0.14",
        "c": "0:00:54"
      },
      {
        "m": "d3",
        "e": "-0.36",
        "c": "0:00:56"
      },
      {
        "m": "O-O",
        "e": "-0.08",
        "c": "0:00:54"
      },
      {
        "m": "Qe1",
        "e": "-0.23",
        "c": "0:00:56"
      },
      {
        "m": "Nbc6",
        "e": "-0.22",
        "c": "0:00:53"
      },
      {
        "m": "f5",
        "e": "-0.42",
        "c": "0:00:55"
      },
      {
        "m": "gxf5",
        "e": "-0.44",
        "c": "0:00:52"
      },
      {
        "m": "Qh4",
        "e": "-1.58",
        "c": "0:00:55"
      },
      {
        "m": "Ng6",
        "e": "-0.22",
        "c": "0:00:51"
      },
      {
        "m": "Qh5",
        "e": "-0.69",
        "c": "0:00:54"
      },
      {
        "m": "Nce5",
        "e": "0.11",
        "c": "0:00:47"
      },
      {
        "m": "exf5",
        "e": "-0.39",
        "c": "0:00:52"
      },
      {
        "m": "Nxc4",
        "e": "6.95",
        "c": "0:00:42"
      },
      {
        "m": "Ng5",
        "e": "6.56",
        "c": "0:00:48"
      },
      {
        "m": "h6",
        "e": "6.68",
        "c": "0:00:39"
      },
      {
        "m": "f6",
        "e": "6.27",
        "c": "0:00:46"
      },
      {
        "m": "hxg5",
        "e": "5.7",
        "c": "0:00:30"
      },
      {
        "m": "Bxg5",
        "e": "5.38",
        "c": "0:00:42"
      },
      {
        "m": "Re8",
        "e": "7.51",
        "c": "0:00:16"
      },
      {
        "m": "fxg7",
        "e": "7.39",
        "c": "0:00:39"
      },
      {
        "m": "Qb6",
        "e": "14.21",
        "c": "0:00:16"
      },
      {
        "m": "Bf6",
        "e": "#2",
        "c": "0:00:34"
      }
    ]
  }
]
```

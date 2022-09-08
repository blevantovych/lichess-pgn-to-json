import fs from "fs/promises";
import groupBy from "lodash.groupby";
import groupby from "lodash.groupby";

const file = await fs.readFile("lichess_bodya17_2022-09-04__with__fens.json");

const games = JSON.parse(file);

const benoniStructureGames = games.filter((game) => {
    return game.fens?.some((fen) => {
        // return /.*?\/.*?\/...p..p.\/..pP.*?\/....PP../.test(fen);
        return /........\/........\/...p..p.\/..pP....\/....PP../.test(fen);
    });
});

console.log(
    JSON.stringify(
        groupBy(
            benoniStructureGames.map((g) => {
                delete g.moves;
                delete g.fens;
                return g;
            }),
            (g) => g.Opening
        ),
        null,
        4
    )
);

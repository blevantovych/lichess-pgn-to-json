import fs from "fs/promises";
import { Chess } from "chess.js";

const file = await fs.readFile("lichess_bodya17_2022-09-04.json");

const games = JSON.parse(file);

games.forEach((game) => {
    const chess = Chess();
    const fens = game.moves.map(({ m }) => {
        chess.move(m);
        const fen = chess.fen();
        const spaceIndex = fen.indexOf(" ");
        const bareFen = fen.slice(0, spaceIndex);
        const fixedRankWidthFen = bareFen.replace(/\d/g, (n) => ".".repeat(n));
        return fixedRankWidthFen;
    });
    game.fens = fens;
});

await fs.writeFile(
    "lichess_bodya17_2022-09-04__with__fens.json",
    JSON.stringify(games)
);

import child_process from "child_process";
import util from "util";
import { describe, expect, test } from "vitest";

const exec = util.promisify(child_process.exec);

const convertPgnToJson = (file = "game.pgn") => {
    const cmd = `gawk -vFPAT='([^ ]*)|("[^"]+")' -f convert_pgn_to_json.awk ${file}`;
    return exec(cmd);
};

describe("convert_pgn_to_json", () => {
    test("doesn't error", async () => {
        const { stdout, stderr } = await convertPgnToJson();
        expect(stderr).toBe("");
        expect(stdout).toMatchSnapshot();
    });

    test("converts pgn to valid json", async () => {
        const { stdout } = await convertPgnToJson();
        expect(() => JSON.parse(stdout)).not.toThrow();
    });

    test("handles custom tag names", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/custom_tag_name.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Custom: "custom tag value",
                moves: [{ m: "e4" }, { m: "e5" }],
            },
        ]);
    });

    test("handles multiple game in a single file", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/multiple_games.pgn"
        );
        expect(stdout).toMatchSnapshot();
    });

    test("handles moves with evaluation and clock info", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/eval_clock.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Round: "1",
                moves: [
                    { m: "e4", e: "0.33", c: "0:01:00" },
                    { m: "c5", e: "0.32", c: "0:01:00" },
                ],
            },
        ]);
    });

    test("handles abandoned game with no moves", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/abandoned_by_white.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Event: "Українська ліга 137 Team Battle",
                Site: "https://lichess.org/QexeKNjN",
                Date: "2023.09.18",
                White: "IgorNds",
                Black: "game2020",
                Result: "0-1",
                UTCDate: "2023.09.18",
                UTCTime: "18:18:09",
                WhiteElo: "1945",
                BlackElo: "2086",
                WhiteRatingDiff: "-4",
                BlackRatingDiff: "+4",
                WhiteTeam: "6s03nPhu",
                BlackTeam: "Ydful3Z4",
                Variant: "Standard",
                TimeControl: "180+0",
                ECO: "?",
                Termination: "Abandoned",
                moves: [],
            },
        ]);
    });

    test("handles game that ended in a mate and as a result doesn't have evaluation for the last move", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/game_with_mate.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Event: "Titled Arena Jun '24",
                Site: "https://lichess.org/apzXqc2m",
                Date: "2024.06.22",
                White: "jonasbjerre",
                Black: "DrNykterstein",
                Result: "0-1",
                moves: [
                    { m: "e4", e: "0.15", c: "0:01:00" },
                    { m: "c6", e: "0.26", c: "0:01:00" },
                    { m: "Nc3", e: "0.36", c: "0:00:59" },
                    { m: "d5", e: "0.32", c: "0:01:00" },
                    { m: "Nf3", e: "0.16", c: "0:00:59" },
                    { m: "dxe4", e: "0.24", c: "0:00:59" },
                    { m: "Nxe4", e: "0.17", c: "0:00:58" },
                    { m: "Nf6", e: "0.27", c: "0:00:59" },
                    { m: "Ng3", e: "0.0", c: "0:00:58" },
                    { m: "h5", e: "0.25", c: "0:00:58" },
                    { m: "h3", e: "0.01", c: "0:00:57" },
                    { m: "h4", e: "0.1", c: "0:00:58" },
                    { m: "Ne2", e: "0.05", c: "0:00:56" },
                    { m: "e5", e: "0.44", c: "0:00:57" },
                    { m: "Nxe5", e: "0.31", c: "0:00:54" },
                    { m: "Bd6", e: "0.62", c: "0:00:57" },
                    { m: "Nf3", e: "0.24", c: "0:00:53" },
                    { m: "O-O", e: "0.96", c: "0:00:57" },
                    { m: "d3", e: "0.27", c: "0:00:53" },
                    { m: "Re8", e: "0.2", c: "0:00:57" },
                    { m: "Be3", e: "-0.86", c: "0:00:51" },
                    { m: "Nd5", e: "-0.77", c: "0:00:53" },
                    { m: "Qd2", e: "-0.73", c: "0:00:48" },
                    { m: "Nxe3", e: "-0.49", c: "0:00:51" },
                    { m: "fxe3", e: "-0.6", c: "0:00:48" },
                    { m: "a5", e: "-0.55", c: "0:00:50" },
                    { m: "O-O-O", e: "-0.48", c: "0:00:47" },
                    { m: "a4", e: "-0.51", c: "0:00:50" },
                    { m: "a3", e: "-1.03", c: "0:00:46" },
                    { m: "b5", e: "-1.1", c: "0:00:49" },
                    { m: "Kb1", e: "-1.8", c: "0:00:45" },
                    { m: "b4", e: "-1.9", c: "0:00:49" },
                    { m: "axb4", e: "-1.58", c: "0:00:43" },
                    { m: "a3", e: "-0.78", c: "0:00:49" },
                    { m: "b3", e: "-0.76", c: "0:00:41" },
                    { m: "a2+", e: "-0.71", c: "0:00:48" },
                    { m: "Ka1", e: "-0.84", c: "0:00:40" },
                    { m: "Na6", e: "-0.53", c: "0:00:47" },
                    { m: "c3", e: "-0.69", c: "0:00:40" },
                    { m: "Qf6", e: "1.39", c: "0:00:46" },
                    { m: "Ned4", e: "-0.66", c: "0:00:39" },
                    { m: "c5", e: "-0.76", c: "0:00:45" },
                    { m: "bxc5", e: "-1.68", c: "0:00:37" },
                    { m: "Nxc5", e: "-1.5", c: "0:00:45" },
                    { m: "b4", e: "-1.61", c: "0:00:35" },
                    { m: "Na4", e: "-1.26", c: "0:00:44" },
                    { m: "e4", e: "-2.53", c: "0:00:33" },
                    { m: "Bf4", e: "-2.49", c: "0:00:43" },
                    { m: "Qc2", e: "-2.32", c: "0:00:32" },
                    { m: "Bd7", e: "-1.93", c: "0:00:42" },
                    { m: "Qb3", e: "-5.05", c: "0:00:29" },
                    { m: "Rec8", e: "-4.86", c: "0:00:41" },
                    { m: "Ne2", e: "-6.41", c: "0:00:22" },
                    { m: "Nxc3", e: "-6.44", c: "0:00:40" },
                    { m: "e5", e: "-6.4", c: "0:00:21" },
                    { m: "Bxe5", e: "-5.96", c: "0:00:39" },
                    { m: "Nxe5", e: "-6.01", c: "0:00:21" },
                    { m: "Qxe5", e: "-5.11", c: "0:00:39" },
                    { m: "d4", e: "-5.41", c: "0:00:20" },
                    { m: "Qe3", e: "-5.35", c: "0:00:36" },
                    { m: "Nxc3", e: "#-10", c: "0:00:19" },
                    { m: "Rxc3", e: "#-9", c: "0:00:35" },
                    { m: "Qb2", e: "#-9", c: "0:00:18" },
                    { m: "Rb3", e: "#-12", c: "0:00:33" },
                    { m: "Qc2", e: "#-5", c: "0:00:15" },
                    { m: "Rb1+", e: "#-7", c: "0:00:32" },
                    { m: "Rxb1", e: "#-7", c: "0:00:14" },
                    { m: "axb1=Q+", e: "#-7", c: "0:00:32" },
                    { m: "Kxb1", e: "#-7", c: "0:00:14" },
                    { m: "Bf5", e: "#-6", c: "0:00:31" },
                    { m: "Qxf5", e: "#-6", c: "0:00:11" },
                    { m: "Qb3+", e: "#-5", c: "0:00:31" },
                    { m: "Kc1", e: "#-5", c: "0:00:09" },
                    { m: "Qc3+", e: "#-4", c: "0:00:30" },
                    { m: "Kd1", e: "#-4", c: "0:00:08" },
                    { m: "Ra1+", e: "#-3", c: "0:00:30" },
                    { m: "Ke2", e: "#-2", c: "0:00:08" },
                    { m: "Re1+", e: "#-1", c: "0:00:29" },
                    { m: "Kf2", e: "#-1", c: "0:00:07" },
                    { m: "Qe3#", c: "0:00:29" },
                ],
            },
        ]);
    });

    test("shows message when no pgn file is provided", async () => {
        const { stdout } = await convertPgnToJson("");
        expect(stdout).toBe("PGN file is not provided.");
    });

    test("handles games set up from position and that don't start with move 1", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/game_from_position_starting_from_move_16.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Event: "Casual correspondence game",
                Site: "https://lichess.org/uOVImFxZ",
                Date: "2023.01.30",
                White: "Openingmastery96",
                Black: "lichess AI level 8",
                Result: "1-0",
                UTCDate: "2023.01.30",
                UTCTime: "14:04:27",
                WhiteElo: "1500",
                BlackElo: "?",
                Variant: "From Position",
                TimeControl: "-",
                ECO: "?",
                Opening: "?",
                Termination: "Normal",
                FEN: "r1bbqrk1/1p1n2pp/2p2n2/p4p2/2PpP3/2NN1PP1/PB4BP/R2QR1K1 w - - 0 16",
                SetUp: "1",
                moves: [
                    { m: "exf5" },
                    { m: "Qf7" },
                    { m: "Ne4" },
                    { m: "Nxe4" },
                    { m: "fxe4" },
                    { m: "Bc7" },
                    { m: "c5" },
                    { m: "b6" },
                ],
            },
        ]);
    });

    test("converts correctly when only clock info is present", async () => {
        const { stdout } = await convertPgnToJson(
            "./test/fixtures/only_clock.pgn"
        );
        expect(JSON.parse(stdout)).toMatchObject([
            {
                Round: "1",
                moves: [
                    { m: "d4", c: "0:01:00" },
                    { m: "e6", c: "0:01:00" },
                    { m: "Nf3", c: "0:01:00" },
                    { m: "b6", c: "0:00:59" },
                    { m: "Bf4", c: "0:01:00" },
                ],
            },
        ]);
    });
});

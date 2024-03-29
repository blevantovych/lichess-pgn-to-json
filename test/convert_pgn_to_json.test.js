import child_process from "child_process";
import util from "util";
import { describe, expect, test } from "vitest";

const exec = util.promisify(child_process.exec);

const convertPgnToJson = (file = "game.pgn") => {
  const cmd = `awk -vFPAT='([^ ]*)|("[^"]+")' -f convert_pgn_to_json.awk ${file}`;
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
    const { stdout } = await convertPgnToJson("./test/custom_tag_name.pgn");
    expect(JSON.parse(stdout)).toMatchObject([
      {
        Custom: "custom tag value",
        moves: [{ m: "e4" }, { m: "e5" }],
      },
    ]);
  });

  test("handles multiple game in a single file", async () => {
    const { stdout } = await convertPgnToJson("./test/multiple_games.pgn");
    expect(stdout).toMatchSnapshot();
  });

  test("handles moves with evaluation and clock info", async () => {
    const { stdout } = await convertPgnToJson("./test/eval_clock.pgn");
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
    const { stdout } = await convertPgnToJson("./test/abandoned_by_white.pgn");
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

  test("shows message when no pgn file is provided", async () => {
    const { stdout } = await convertPgnToJson("");
    expect(stdout).toBe("PGN file is not provided.");
  });
});

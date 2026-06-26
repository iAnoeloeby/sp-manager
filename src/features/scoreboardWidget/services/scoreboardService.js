/**
 * Scoreboard Service
 *
 * Temporary scoreboard data provider backed by local mock data.
 * Used for development and UI testing until a real football API
 * integration is implemented.
 *
 * TODO:
 * - Replace mock data source with a real API implementation.
 * - Add response normalization, error handling, and caching.
 * - Support live match and competition updates.
 */

/* ---------- mock data ---------- */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {string} short
 * @property {string} logo
 * @property {string} league
 *
 * @typedef {Object} FixtureTeam
 * @property {string} id
 * @property {string} name
 * @property {string} short
 * @property {string} logo
 *
 * @typedef {Object} Fixture
 * @property {string} id
 * @property {string} competition
 * @property {string} round
 * @property {string} kickoff
 * @property {"scheduled" | "live" | "finished"} status
 * @property {FixtureTeam} home
 * @property {FixtureTeam} away
 *
 * @typedef {Object} TeamScoreboard
 * @property {Team} team
 * @property {Fixture|null} featuredFixture
 * @property {Fixture[]} fixtures
 */

/** @type {TeamScoreboard} */
const MOCK_TEAM_SCOREBOARD = {
    team: {
        id: "2817",
        name: "FC Barcelona",
        short: "FCB",
        league: "La Liga",
        logo: "https://img.sofascore.com/api/v1/team/2817/image",
    },

    featuredFixture: {
        id: "tm-1",
        competition: "La Liga",
        round: "Matchday 12",
        kickoff: "2024-10-15T22:00:00Z",
        status: "scheduled",
        home: {
            id: "2817",
            name: "FC Barcelona",
            short: "FCB",
            logo: "https://img.sofascore.com/api/v1/team/2817/image",
        },
        away: {
            id: "8",
            name: "Liverpool",
            short: "LIV",
            logo: "https://img.sofascore.com/api/v1/team/44/image",
        },
    },

    fixtures: [
        {
            id: "tm-1",
            competition: "La Liga",
            round: "Matchday 12",
            kickoff: "2024-10-15T22:00:00Z",
            status: "scheduled",
            home: {
                id: "2817",
                name: "FC Barcelona",
                short: "FCB",
                logo: "https://img.sofascore.com/api/v1/team/2817/image",
            },
            away: {
                id: "8",
                name: "Liverpool",
                short: "LIV",
                logo: "https://img.sofascore.com/api/v1/team/44/image",
            },
        },

        {
            id: "tm-2",
            competition: "UEFA Champions League",
            round: "League Stage",
            kickoff: "2024-10-19T19:00:00Z",
            status: "scheduled",
            home: {
                id: "40",
                name: "Bayern München",
                short: "BAY",
                logo: "https://img.sofascore.com/api/v1/team/2672/image",
            },
            away: {
                id: "2817",
                name: "FC Barcelona",
                short: "FCB",
                logo: "https://img.sofascore.com/api/v1/team/2817/image",
            },
        },

        {
            id: "tm-3",
            competition: "Friendly Match",
            round: "Club Friendly",
            kickoff: "2024-10-22T16:30:00Z",
            status: "scheduled",
            home: {
                id: "2817",
                name: "FC Barcelona",
                short: "FCB",
                logo: "https://img.sofascore.com/api/v1/team/2817/image",
            },
            away: {
                id: "42",
                name: "Arsenal",
                short: "ARS",
                logo: "https://img.sofascore.com/api/v1/team/42/image",
            },
        },

        {
            id: "tm-4",
            competition: "Friendly Match",
            round: "Club Friendly",
            kickoff: "2024-10-25T18:45:00Z",
            status: "scheduled",
            home: {
                id: "38",
                name: "Chelsea",
                short: "CHE",
                logo: "https://img.sofascore.com/api/v1/team/38/image",
            },
            away: {
                id: "2817",
                name: "FC Barcelona",
                short: "FCB",
                logo: "https://img.sofascore.com/api/v1/team/2817/image",
            },
        },

        {
            id: "tm-5",
            competition: "Friendly Match",
            round: "Club Friendly",
            kickoff: "2024-10-29T20:00:00Z",
            status: "scheduled",
            home: {
                id: "2817",
                name: "FC Barcelona",
                short: "FCB",
                logo: "https://img.sofascore.com/api/v1/team/2817/image",
            },
            away: {
                id: "17",
                name: "Manchester City",
                short: "MCI",
                logo: "https://img.sofascore.com/api/v1/team/17/image",
            },
        },
    ],
};

/**
 * @typedef {Object} LeagueFixture
 * @property {string} id
 * @property {string} competition
 * @property {string} kickoff
 * @property {string} status
 * @property {{ id: string, name: string, short: string, logo: string }} home
 * @property {{ id: string, name: string, short: string, logo: string }} away
 *
 * @typedef {Object} LeagueScoreboard
 * @property {string} id
 * @property {string} name
 * @property {number} matchday
 * @property {LeagueFixture[]} fixtures
 *
 * @typedef {Object} ScoreboardData
 * @property {Team} team
 * @property {Fixture|null} featuredFixture
 * @property {Fixture[]} fixtures
 * @property {LeagueScoreboard} league
 */

/** @type {LeagueScoreboard} */
const MOCK_LEAGUE_SCOREBOARD = {
    id: "premier-league",
    name: "Premier League",
    matchday: 12,

    fixtures: [
        {
            id: "lm-1",
            competition: "Premier League",
            kickoff: "2026-10-15T22:30:00Z",
            status: "scheduled",

            home: {
                id: "liverpool",
                name: "Liverpool",
                short: "LIV",
                logo: "https://img.sofascore.com/api/v1/team/44/image",
            },

            away: {
                id: "arsenal",
                name: "Arsenal",
                short: "ARS",
                logo: "https://img.sofascore.com/api/v1/team/42/image",
            },
        },

        {
            id: "lm-2",
            competition: "Premier League",
            kickoff: "2026-10-16T19:30:00Z",
            status: "scheduled",

            home: {
                id: "tottenham",
                name: "Tottenham",
                short: "TOT",
                logo: "https://img.sofascore.com/api/v1/team/33/image",
            },

            away: {
                id: "chelsea",
                name: "Chelsea",
                short: "CHE",
                logo: "https://img.sofascore.com/api/v1/team/38/image",
            },
        },
    ],
};

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Internal: fetch scoreboard data from local mock storage.
 * Replace this with a real API call when integrating a football data provider.
 *
 * @returns {Promise<ScoreboardData>}
 */
async function fetchScoreboardFromMock() {
    await delay(500);
    return {
        team: MOCK_TEAM_SCOREBOARD.team,
        featuredFixture: MOCK_TEAM_SCOREBOARD.featuredFixture,
        fixtures: MOCK_TEAM_SCOREBOARD.fixtures,
        league: MOCK_LEAGUE_SCOREBOARD,
    };
}

/**
 * Public: fetch the full scoreboard payload (team, fixtures, and league data).
 * Currently delegates to mock data; swap the body to call a real API.
 *
 * @returns {Promise<ScoreboardData>}
 */
export async function fetchScoreboard() {
    // return fetchScoreboardFromAPI();

    await delay(1000);

    return fetchScoreboardFromMock();
}

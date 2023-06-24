function findMatch(matches, team) {
  let nextGame = null;

  for (const match of matches) {
    if (match.home_team === team || match.away_team === team) {
      nextGame = match;
      break;
    }
  }

  if (nextGame) {
    const opponent = nextGame.home_team === team ? nextGame.away_team : nextGame.home_team;
    return {
      team,
      opponent,
      match_date_time: nextGame.match_date_time,
      odds: {
        victory: nextGame.home_team_win,
        draw: nextGame.draw,
        defeat: nextGame.away_team_win,
      },
    };
  } else {
    return null;
  }
}

module.exports = findMatch;

def find_match(matches, team):
    next_game = None

    for match in matches:
        if match.home_team == team or match.away_team == team:
            next_game = match
            break

    if next_game:
        opponent = next_game.home_team if next_game.away_team == team else next_game.away_team
        return {
            'team': team,
            'opponent': opponent,
            'match_date_time': next_game.match_date_time,
            'odds': {
                'victory': next_game.home_team_win,
                'draw': next_game.draw,
                'defeat': next_game.away_team_win
            }
        }
    else:
        return None

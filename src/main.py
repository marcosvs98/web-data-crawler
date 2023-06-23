import json
import logging

from utils import find_match
from dtos import Parameter, Template, TemplateSettings
from filters import DateFilterHandler, DecimalFilterHandler, JSONStringDecoderHandler
from http_client import request_content
from parsers import TeamLeagueContentParser
from text_parser.sequential_text_parser import SequentialTextParser
from text_parser.static_text_parser import StaticTextParser

logger = logging.getLogger(__name__)


def main():
    # Template configuration and settings
    template_settings = TemplateSettings(
        http_method='POST',
        headers=[
            'Accept: application/json, text/plain, */*',
            'Connection: keep-alive',
            'Content-Type: application/json',
            'Cookie: MgidSensorHref=https://estrelabet.com/ptb/bet/fixture-detail'
            '/soccer/brazil/brasileiro-serie-a-2023;',
            'Origin: https://estrelabet.com',
            'Referer: https://estrelabet.com/ptb/bet/fixture-detail/'
            'soccer/brazil/brasileiro-serie-a-2023',
            'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'bragiurl: https://bragi.sportingtech.com/',
        ],
        postdata=json.dumps(
            {
                'requestBody': {
                    'betTypeGroupLimit': 20,
                    'bragiUrl': 'https://bragi.sportingtech.com/',
                },
                'device': 'd',
                'languageId': 23,
            }
        ),
    )

    template = Template(
        url='https://estrelabet.com/api-v2/fixture/category-details/d/23/estrelabet/null/false/'
        'no-ante/20/soccer/brazil/brasileiro-serie-a-2023',
        parameters=[
            # Extraction parameters
            Parameter(
                order=1,
                name='LEAGUE',
                start_tag='"seaSURL": "brasileiro-serie-a-2023"',
                end_tag='"cSURL": "brazil"',
            ),
            Parameter(order=2, name='MATCH_DATE_TIME', start_tag='"fsd": ', end_tag='000,'),
            Parameter(order=3, name='HOME_TEAM', start_tag='"hcN": "', end_tag='",'),
            Parameter(order=4, name='AWAY_TEAM', start_tag='"acN": "', end_tag='",'),
            Parameter(order=5, name='HOME_TEAM_WIN', start_tag='"hO": ', end_tag=','),
            Parameter(order=6, name='DRAW', start_tag='"hO": ', end_tag=','),
            Parameter(order=7, name='AWAY_TEAM_WIN', start_tag='hO": ', end_tag=','),
        ],
        settings=template_settings,
    )

    # Requesting and obtaining API content
    content = json.dumps(
        request_content(template.url, template.settings.headers, template.settings.postdata)
    )

    # Filters configuration
    filters = {
        'HOME_TEAM': JSONStringDecoderHandler(),
        'AWAY_TEAM': JSONStringDecoderHandler(),
        'MATCH_DATE_TIME': DateFilterHandler(),
        'HOME_TEAM_WIN': DecimalFilterHandler(),
        'DRAW': DecimalFilterHandler(),
        'AWAY_TEAM_WIN': DecimalFilterHandler(),
    }

    # Initialization and execution of the parser
    parser = TeamLeagueContentParser(
        template=template,
        content=content,
        filters=filters,
        text_parser_static=StaticTextParser(),
        text_parser_sequential=SequentialTextParser(),
    )
    matches = parser.parse()

    next_game = find_match(matches, team='Cruzeiro')

    if next_game:
        print(f"Próximo jogo do {next_game['team']}:")
        print("Time adversário:", next_game['opponent'])
        print("Dia e horário:", next_game['match_date_time'])
        print("Odds - Vitória:", next_game['odds']['victory'])
        print("Odds - Empate:", next_game['odds']['draw'])
        print("Odds - Derrota:", next_game['odds']['defeat'], "\n")
    else:
        print(f"Não há jogos futuros do {team} na lista.", "\n")


if __name__ == '__main__':
    main()

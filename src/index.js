const {sleep, findMatch} = require('./utils/utils');
const fs = require('fs');
const { Template, Parameter, TemplateSettings } = require('./schemas/dtos');

const { AsyncCrawlerHandlerLifecycle } = require('./context/context');
const { DateFilterHandler, DecimalFilterHandler, JSONStringDecoderHandler } = require('./filters/filters');
const { requestContent } = require('./client/client');
const { StaticTextParser } = require('./text-parser/static-text-parser');
const { SequentialTextParser } = require('./text-parser/sequential-text-parser');
const { TeamLeagueContentParser } = require('./content-parser/league_parser');


async function handler() {
  // Template configuration and settings
  const templateSettings = new TemplateSettings({
    http_method: 'POST',
    headers: [
      'Accept: application/json, text/plain, */*',
      'Connection: keep-alive',
      'Content-Type: application/json',
      'Cookie: MgidSensorHref=https://estrelabet.com/ptb/bet/fixture-detail/soccer/brazil/brasileiro-serie-a-2023;',
      'Origin: https://estrelabet.com',
      'Referer: https://estrelabet.com/ptb/bet/fixture-detail/soccer/brazil/brasileiro-serie-a-2023',
      'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      'bragiurl: https://bragi.sportingtech.com/',
    ],
    postdata: JSON.stringify({
      requestBody: {
        betTypeGroupLimit: 20,
        bragiUrl: 'https://bragi.sportingtech.com/',
      },
      device: 'd',
      languageId: 23,
    }),
  });

  const template = new Template({
    url: 'https://estrelabet.com/api-v2/fixture/category-details/d/23/estrelabet/null/false/no-ante/20/soccer/brazil/brasileiro-serie-a-2023',
    parameters: [
      // Extraction parameters
      new Parameter({
        order: 1,
        name: 'LEAGUE',
        start_tag: '"BRASILEIRO-SERIE-A-2023"',
        end_tag: '"CSURL":"BRAZIL"',
      }),
      new Parameter({
        order: 2,
        name: 'MATCH_DATE_TIME',
        start_tag: '"FSD":',
        end_tag: '000,',
      }),
      new Parameter({
        order: 3,
        name: 'HOME_TEAM',
        start_tag: '"HCN":"',
        end_tag: '",',
      }),
      new Parameter({
        order: 4,
        name: 'AWAY_TEAM',
        start_tag: '"ACN":"',
        end_tag: '",',
      }),
      new Parameter({
        order: 5,
        name: 'HOME_TEAM_WIN',
        start_tag: '"HO":',
        end_tag: ',',
      }),
      new Parameter({
        order: 6,
        name: 'DRAW',
        start_tag: '"HO":',
        end_tag: ',',
      }),
      new Parameter({
        order: 7,
        name: 'AWAY_TEAM_WIN',
        start_tag: '"HO":',
        end_tag: ',',
      }),
    ],
    settings: templateSettings,
  });

  // Requesting and obtaining API content
  const response = await requestContent(template.url, template.settings.headers, template.settings.postdata);
  const content = JSON.stringify(response);
  //const content = '<h1>Hello World</h1>'

  const filters = {
    HOME_TEAM: new JSONStringDecoderHandler(),
    AWAY_TEAM: new JSONStringDecoderHandler(),
    MATCH_DATE_TIME: new DateFilterHandler(),
    HOME_TEAM_WIN: new DecimalFilterHandler(),
    DRAW: new DecimalFilterHandler(),
    AWAY_TEAM_WIN: new DecimalFilterHandler(),
  };

  // Initialization and execution of the parser
  const parser = new TeamLeagueContentParser(
    template,
    content,
    filters,
    new StaticTextParser(),
    new SequentialTextParser()
  );
  const matches = parser.parse();

  const team = 'CRUZEIRO';
  const nextGame = findMatch(matches, team);

  if (nextGame) {
    console.log(`\nPróximo jogo do ${nextGame.team}:`);
    console.log('Time adversário:', nextGame.opponent);
    console.log('Dia e horário:', nextGame.match_date_time);
    console.log('Odds - Vitória:', nextGame.odds.victory);
    console.log('Odds - Empate:', nextGame.odds.draw);
    console.log('Odds - Derrota:', nextGame.odds.defeat, '\n');
  } else {
    console.log(`Não há jogos futuros do ${team} na lista.`, '\n');
    console.log(matches);
  }
}


async function main() {
  console.log('Starting WebCrawler Application...');
  const crawler = new AsyncCrawlerHandlerLifecycle(handler);

  try {
    await crawler.start();

    while (true) {
      console.error('Waiting for time for next data extraction');
      await sleep(10000);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    console.log('Terminating application...');
    await crawler.stop();
  }
}


if (require.main === module) {
  main();
}

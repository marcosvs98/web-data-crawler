class DataTransferObject {
  constructor(data) {
    Object.assign(this, data);
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json) {
    const data = JSON.parse(json);
    return new this(data);
  }
}

class Parameter extends DataTransferObject {
  constructor(data) {
    super(data);
    this.order = data.order;
    this.name = data.name;
    this.start_tag = data.start_tag || null;
    this.end_tag = data.end_tag || null;
  }
}

class TemplateSettings extends DataTransferObject {
  constructor(data) {
    super(data);
    this.http_method = data.http_method;
    this.headers = data.headers || null;
    this.postdata = data.postdata;
  }
}

class Template extends DataTransferObject {
  constructor(data) {
    super(data);
    this.url = data.url;
    this.parameters = data.parameters || [];
    this.settings = data.settings || null;
  }
}

class Match extends DataTransferObject {
  constructor(data) {
    super(data);
    this.match_date_time = data.match_date_time ? data.match_date_time : null;
    this.home_team = data.home_team ? data.home_team : null;
    this.away_team = data.away_team ? data.away_team : null;
    this.home_team_win = data.home_team_win ? data.home_team_win : null;
    this.draw = data.draw ? data.draw : null;
    this.away_team_win = data.away_team_win ? data.away_team_win : null;
  }
}


module.exports = {Template, Parameter, TemplateSettings, Match};
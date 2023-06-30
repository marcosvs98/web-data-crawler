from typing import Union, List
from datetime import datetime

from pydantic import BaseModel, Field


class DataTransferObject(BaseModel):
    """Base class for data transfer objects (DTOs)"""


class Parameter(DataTransferObject):
    order: int = Field(..., description='Reading order')
    name: str = Field(..., description='Parameter name')
    start_tag: str = Field(None, description='Initial Token')
    end_tag: str = Field(None, description='End Token')


class TemplateSettings(DataTransferObject):
    http_method: str
    headers: list
    postdata: Union[dict, str]


class Template(DataTransferObject):
    url: str
    parameters: List[Parameter] = []
    settings: TemplateSettings


class Match(DataTransferObject):
    match_date_time: datetime
    home_team: str
    away_team: str
    home_team_win: float
    draw: float
    away_team_win: float
from datetime import datetime

import pytz

from filters.handlers import AbstractHandler


class DateFilterHandler(AbstractHandler):
    def filter(self, value: int) -> str:
        if len(str(value)) > 10:
            value = int(str(value)[:-3])

        dt = datetime.fromtimestamp(int(value))
        timezone = pytz.timezone('America/Sao_Paulo')
        localized_dt = timezone.localize(dt)
        return localized_dt.strftime('%d/%m/%Y %H:%M')


class DecimalFilterHandler(AbstractHandler):
    def filter(self, value: str) -> float:
        return float(value)



class JSONStringDecoderHandler(AbstractHandler):
	def filter(self, value):
		return value.encode().decode('unicode_escape')
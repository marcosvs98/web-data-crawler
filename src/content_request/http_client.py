import json
from io import BytesIO
from typing import Union

import pycurl


def request_content(url: str, headers: list, postdata: Union[str, dict]):
    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.HTTPHEADER, headers)
    c.setopt(c.POSTFIELDS, postdata)
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()

    return json.loads(buffer.getvalue())

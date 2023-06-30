FROM python:3.9

WORKDIR /app

ADD requirements.txt /app
COPY requirements.txt .

RUN pip install -r requirements.txt

ADD . /app

CMD [ "python", "src/main.py" ]

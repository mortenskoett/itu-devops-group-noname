FROM python:3.7-alpine

WORKDIR /minitwit-python-test

COPY ./server/tests/* ./

RUN pip install -r requirements.txt

CMD ["pytest"]
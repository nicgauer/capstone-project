FROM node:12 AS build-stage

WORKDIR /react-app
COPY react-app/. .

# Build our React App
RUN npm install
RUN npm run build

FROM python:3.12-slim

ENV FLASK_APP=app

EXPOSE 8000

WORKDIR /var/www
COPY . .
# Note: the glob flatten is load-bearing — it merges build/static/* into
# app/static/static/*, matching the /static/js/... URLs in CRA's index.html.
COPY --from=build-stage /react-app/build/* app/static/

# Install Python Dependencies
RUN pip install -r requirements.txt

CMD ["./entrypoint.sh"]

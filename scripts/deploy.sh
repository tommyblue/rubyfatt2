#!/bin/sh

set -eu

cd "$(dirname "${0}")/../"

heroku container:push web --arg SECRET_KEY_BASE="$(heroku config:get SECRET_KEY_BASE)"
heroku container:release web

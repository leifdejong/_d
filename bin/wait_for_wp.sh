#!/bin/bash

host="localhost"
port="3002"

echo "Waiting for the wordpress ..."

end="$((SECONDS+180))"
while true; do
    [[ "302" = $(curl --silent --write-out %{http_code} --connect-timeout 2 --max-time 5 --output /dev/null http://${host}:${port}) ]] && break
    [[ "301" = $(curl --silent --write-out %{http_code} --connect-timeout 2 --max-time 5 --output /dev/null http://${host}:${port}) ]] && break
    [[ "200" = $(curl --silent --write-out %{http_code} --connect-timeout 2 --max-time 5 --output /dev/null http://${host}:${port}) ]] && break
    [[ "${SECONDS}" -ge "${end}" ]] && echo "Wordpress Error: connection timed out" && exit 1
    sleep 1
done

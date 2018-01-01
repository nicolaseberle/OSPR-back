#!/bin/bash

if [ $SERVICE_DIR == "publishing" ]
then
  cp "publishing/app/config/index.js.dist" "publishing/app/config/index.js"
fi

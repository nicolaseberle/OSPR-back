#!/bin/bash
cd $1
# dump sql
docker-compose down
cd ..
rm -rf $1-back_save
mv $1 $1-save
tar -xzf package.tgz
rm package.tgz
mv build $1
cd $1
docker-compose -f docker-compose.production.yml up --build -d
#import sql
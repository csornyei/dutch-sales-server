#!/bin/sh

if [ "$EUID" -ne 0 ] 
  then 
    echo "Please run as root!"
    exit 1
fi

cp ./sales-server.service /etc/systemd/system/sales-server.service

systemctl start sales-server
systemctl enable sales-server

touch /etc/cron.d/sales-server
echo "10 10 * * * curl localhost:3000/shop/jumbo >> /etc/cron.d/sales-server"
echo "20 10 * * * curl localhost:3000/shop/albert-heijn >> /etc/cron.d/sales-server"
echo "30 10 * * * curl localhost:3000/shop/aldi >> /etc/cron.d/sales-server"
echo "40 10 * * * curl localhost:3000/shop/ekoplaza >> /etc/cron.d/sales-server"
#!/bin/sh
cp ./sales-server.service /etc/systemd/system/sales-server.service

systemctl start sales-server
systemctl enable sales-server


(crontab -l 2>/dev/null; echo "40 10 * * * curl localhost:8080/shop/jumbo") | crontab -
(crontab -l 2>/dev/null; echo "50 10 * * * curl localhost:8080/shop/albert-heijn") | crontab -
(crontab -l 2>/dev/null; echo "0 11 * * * curl localhost:8080/shop/aldi") | crontab -
(crontab -l 2>/dev/null; echo "10 11 * * * curl localhost:8080/shop/ekoplaza") | crontab -
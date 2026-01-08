#!/bin/bash
# SSL 인증서 초기 발급 스크립트

DOMAIN="yourdomain.com"
EMAIL="your-email@example.com"

echo "=== Let's Encrypt SSL 인증서 발급 ==="

docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/www/certbot:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --preferred-challenges http \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

echo "=== 인증서 발급 완료 ==="
echo "인증서는 /etc/letsencrypt/live/$DOMAIN/ 에 저장되었습니다."
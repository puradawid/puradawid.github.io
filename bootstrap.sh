apt-get update
apt-get install -y npm nodejs ruby gem ruby-dev build-essential
gem install bundler jekyll
npm install -g http-server

cd /vagrant && screen -dmS jekyll jekyll build --config _config.yml,_config_dev.yml --force_polling --watch && screen -dmS http-server http-server -p 80 _site

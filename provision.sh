sudo apt-get update
sudo apt-get install net-tools apache2 -y

sudo ufw allow 'Apache'
sudo systemctl start apache2
sudo systemctl enable apache2



sudo mkdir /var/www/
cd /var/www/
sudo rm -rf html/
sudo mkdir /var/www/html/
sudo mkdir /var/www/html/dashboard

sudo cp /vagrant/index.html /var/www/html/
sudo yes | cp -r /vagrant/punto3/* /var/www/html/dashboard
sudo chmod -R 777 /var/www/html/*

sudo cp /vagrant/punto3/jmeter.conf /etc/apache2/sites-available/
sudo cp /vagrant/punto3/index.conf /etc/apache2/sites-available/

cd /etc/apache2/sites-available
sudo a2ensite jmeter.conf
sudo a2ensite index.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl restart apache2


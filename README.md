Hackeneurs

# CryptoFolio

This web development project was built as a part of the hackathon, *The Ultimate Crypto Challenge - unifynd*.

The Django website is developed with the aim of providing various tools to manage and control a cryptocurrency portfolio such as a performance dashboard, price predictor, real-time price watcher for several cryptocurrencies in  single page, real-time exchange rates between different currencies. The flagship feature of this project is the DIgital Will concept. A person can create a Digital Will linked to his cryptocurrency portfolio wallet where he can mention the beneficiaries and the proportion of wealth to be allocated to each of them. The Will will be validated with a trustee as well. The user can set a maximum time-period of no activity in the account after which the user is assumed dead and the wallet wealth will be distributed to the beneficiaries as mentioned in the Will.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites

You need to have python 3 installed. That's it!

### Installation

Follow the below steps : 

```
git clone https://github.com/sprerak48/Hackeneurs_UCC.git
cd Hackeneurs_UCC/website
pip install -r requirements.txt
```

And Run

```
python manage.py makemigrations
python manage.py migrate --run-syncdb
python manage.py collectstatic
python manage.py runserver
```
This will start the server on http://127.0.0.1:8000/ from the current working directory.



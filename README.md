Hackeneurs

# CryptoFolio

This web development project was built as a part of the hackathon, *The Ultimate Crypto Challenge - unifynd**.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites

You need to have python 3 installed. That's it!

### Installation

Follow the below steps : 

```
git clone https://github.com/sprerak48/Hackeneurs_UCC.git
cd Hackeneurs_UCC
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



release: sh -c 'python manage.py makemigrations && python manage.py migrate'
web: gunicorn -w 4 factoryforge.wsgi:application
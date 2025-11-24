set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py makemigrations users

python manage.py migrate

if [[ $CREATE_SUPERUSER ]]
then
    echo "Email is: $DJANGO_SUPERUSER_EMAIL"
    echo "Password is: $DJANGO_SUPERUSER_PASSWORD"
    python manage.py createsuperuser --no-input
fi
### Docker

Чтобы успешно сделать docker-compose up необходимо создать файл .env и заполнить его часть связанную с настройками DB(см .env.example).
Затем необходимо выполнить вручную миграции 
```bash 
 docker-compose exec nodejs npx sequelize db:migrate
```
Если настрйки были указаны верно, можно увидеть работу приложения по адресу localhost(127.0.0.1).

### Git

При разворачивании проекта из Git после клонирования выполнить npm i. 
Создать MYSQL базу под проект. Создать и внести настройки в файл .env.
Выполнить миграции:
```bash
 npx sequelize db:migrate
```
После проект можно запустить npm start в режиме разработки или npm run production в продакшн.

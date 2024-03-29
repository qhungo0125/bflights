## bflights

### Database

https://erd.dbdesigner.net/designer/schema/1685726649-untitled-4e5c19c7-2276-4267-a2af-5622c68c37be

### Description:

-   Web app use for booking plane ticket
-   2 roles: admin( add flights, aiports, term,...) and customer( buy ticket, view schedule,...)

### Usage:
Cách 1: Chạy server trên local.
- ở thư mục gốc của folder blights -> mở Terminal -> yarn -> yarn start
Cách 2: Sử dụng API trực tiếp ở server đã deploy:
- https://bflights.onrender.com/

### Authentication

#### Noted:

-   use 2 jwt token: `accesstoken` and `refresh token`
-   when client request, add `accesstoken` returned from login to header with key: `token`
-   `accesstoken` has a limited time, if expire time, client need to request a new access token by `call GET "/auth/refresh"` with header has 2 key: `token` and `refreshtoken`.
    > `token` has value `accesstoken` returned from login, and `refreshtoken` has value `refreshToken` returned from login.
-   `accesstoken` is stored in BE, only be deleted when client request a expired accesstoken or logout

#### Usage:

-   post '/auth/register'
    -   body flow this structure:
        `{
  "email": "khachhang4@gmail.com",
  "password": "12345678",
  "phone": "84237972004",
  "fullname": "Khach hang 4",
  "role": "customer",
  "identificationCode": "012345678004"
}`
-   post '/auth/login'
    -   body flow this structure:
        `{
  "email": "khachhang4@gmail.com",
  "password": "12345678"
}`
-   get '/auth/refresh'
    -   header has 2 key: `token` and `refreshtoken`. `token` has value `accesstoken` returned from login, and `refreshtoken` has value `refreshToken` returned from login.
-   post '/auth/logout'
    -   header has 1 key: `token` and `refreshtoken`. `token` has value `accesstoken` returned from login.

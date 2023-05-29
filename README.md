## bflights

### Description:

- Web app use for booking plane ticket

### Authentication

- use 2 jwt token: accesstoken and refresh token
- when client request, add accesstoken returned from login to header with key: "token"
- accesstoken has a limited time, if expire time, client need to request a new access token by call GET "/auth/refresh" with header has 2 key: "token" and "refreshtoken".
  > "token" has value accesstoken returned from login, and "refreshtoken" has value refreshToken returned from login.
- accesstoken is stored in BE, only be deleted when client request a expired accesstoken or logout

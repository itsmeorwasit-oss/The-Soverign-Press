# Sovereign Press API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Users
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update user profile (protected)
- `GET /users` - Search users

### Articles
- `POST /articles` - Create article (protected)
- `GET /articles` - Get all articles with pagination
- `GET /articles/:id` - Get single article
- `PUT /articles/:id` - Update article (protected)
- `DELETE /articles/:id` - Delete article (protected)
- `GET /articles/author/:authorId` - Get user's articles

### Comments
- `POST /comments` - Create comment (protected)
- `GET /comments/article/:articleId` - Get article comments
- `PUT /comments/:id` - Update comment (protected)
- `DELETE /comments/:id` - Delete comment (protected)

### Likes
- `POST /likes/article/:articleId` - Like/unlike article (protected)
- `POST /likes/comment/:commentId` - Like/unlike comment (protected)

### Follows
- `POST /follows/:userId` - Follow/unfollow user (protected)
- `GET /follows/:userId/followers` - Get user followers
- `GET /follows/:userId/following` - Get user following

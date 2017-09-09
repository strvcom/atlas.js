/**
 * pure objects that follow objection naming conventions
 * and are used to create Model classes
 */
const user = {
  tableName: 'users',
  jsonSchema: {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  relationMappings: {
    movies: {
      relation: 'ManyToManyRelation',
      modelClass: 'movie',
      join: {
        from: 'movies.id',
        to: 'users.id',
        through: {
          modelClass: 'movieLike',
          from: 'user_likes_movie.movie_id',
          to: 'user_likes_movie.user_id',
        },
      },
    },
    myType: {
      relation: 'BelongsToOneRelation',
      modelClass: 'userType',
      join: {
        from: 'users.user_type_id',
        to: 'user_types.id',
      },
    },
  },
}

const movieLike = {
  tableName: 'user_likes_movie',
  jsonSchema: {
    type: 'object',
    required: ['userId', 'movieId'],
    properties: {
      userId: { type: 'integer' },
      movieId: { type: 'integer' },
    },
  },
  relationMappings: {
    users: {
      relation: 'HasManyRelation',
      modelClass: 'user',
      join: {
        from: 'user_likes_movie.user_id',
        to: 'users.id',
      },
    },
    movies: {
      relation: 'HasManyRelation',
      modelClass: 'movie',
      join: {
        from: 'user_likes_movie.movie_id',
        to: 'movies.id',
      },
    },
  },
}

const userType = {
  tableName: 'user_types',
  jsonSchema: {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  relationMappings: {
    users: {
      relation: 'HasManyRelation',
      modelClass: 'user',
      join: {
        from: 'user_types.id',
        to: 'users.user_type_id',
      },
    },
  },
}

const movie = {
  tableName: 'movies',
  jsonSchema: {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  relationMappings: {
    likers: {
      relation: 'ManyToManyRelation',
      modelClass: 'user',
      join: {
        from: 'users.id',
        to: 'movies.id',
        through: {
          modelClass: 'movieLike',
          from: 'user_likes_movie.user_id',
          to: 'user_likes_movie.movie_id',
        },
      },
    },
  },
}

const empty = {
  tableName: 'empty',
  jsonSchema: {},
}

export {
  empty,
  movieLike,
  user,
  movie,
  userType,
}

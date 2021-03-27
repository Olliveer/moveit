// create faunadb server key
// create collections: users, accounts, sessions, verificationRequests
// create required indexes
/**
 * create the above in shell using the following

CreateCollection({name: 'accounts'});
CreateCollection({name: 'sessions'});
CreateCollection({name: 'users'});
CreateCollection({name: 'verification_requests'});


CreateIndex({
    name: 'ref_by_user_by_id',
    source: Collection('users'),
    unique: true,
    terms: [
        { field: ['data', 'id'] }
    ]
});
CreateIndex({
    name: 'ref_by_user_by_email',
    source: Collection('users'),
    unique: true,
    terms: [
        { field: ['data', 'email'] }
    ]
});
CreateIndex({
    name: 'ref_by_account_provider_account_id',
    source: Collection('accounts'),
    unique: true,
    terms: [
        { field: ['data', 'providerId'] },
        { field: ['data', 'providerAccountId'] }
    ]
});

CreateIndex({
    name: 'ref_by_vertification_request_token',
    source: Collection('verification_requests'),
    unique: true,
    terms: [
        { field: ['data', 'token'] }
    ]
});
CreateIndex({
    name: 'ref_by_session_id',
    source: Collection('sessions'),
    unique: true,
    terms: [
        { field: ['data', 'id'] }
    ]
});
CreateIndex({
    name: 'ref_by_session_token',
    source: Collection('sessions'),
    unique: true,
    terms: [
        { field: ['data', 'sessionToken'] }
    ]
});
 */

import faunadb, { query as q } from 'faunadb';
import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto'

const INDEX_USERS_ID = 'ref_by_user_by_id'
const INDEX_USERS_EMAIL = 'ref_by_user_by_email'
const INDEX_USERS_ACCOUNT_ID_PROVIDER_ID = 'ref_by_account_provider_account_id'
const INDEX_VERIFICATION_REQUESTS_TOKEN = 'ref_by_vertification_request_token'
const INDEX_SESSIONS_ID = 'ref_by_session_id'
const INDEX_SESSIONS_SESSION_TOKEN = 'ref_by_session_token'

const faunaClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })


const Adapter = (_config: any, _options = {}) => {

  function faunaWrapper(faunaQ, errorTag) {
    try {
      return faunaClient.query(faunaQ)
    } catch (error) {
      console.error(errorTag, error)
      return Promise.reject(new Error(error)) // removed errorTag here cos typescript says it only accepts one params and `error` seems the most logical msg to be displayed as error msg
    }
  }
  function _debug(...args) {
    console.log('[next-auth-fauna][debug]', ...args)
  }

  async function getAdapter(appOptions) {
    if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
      console.log('no default options for session');
    }

    const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
    const sessionMaxAge =
      appOptions && appOptions.session && appOptions.session.maxAge
        ? appOptions.session.maxAge * 1000
        : defaultSessionMaxAge;
    const sessionUpdateAge =
      appOptions && appOptions.session && appOptions.session.updateAge
        ? appOptions.session.updateAge * 1000
        : 24 * 60 * 60 * 1000;

    async function createUser(profile) {
      _debug('CREATE_USER', profile)
      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('users'), {
            data: {
              ...profile,
              emailVerified: profile.emailVerified
                ? profile.emailVerified.toISOString()
                : null,
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          }),
        ),
        'CREATE_USER_ERROR',
      );
    }

    async function getUser(id: string) {
      _debug('GET_USER', id)
      const user = await faunaWrapper(
        q.Select('data', q.Get(q.Match(q.Index(INDEX_USERS_ID), id))),
        'GET_USER_BY_ID_ERROR',
      );
      return user;

    }

    async function getUserByEmail(email) {
      _debug('GET_USER_BY_EMAIL', email)
      return faunaWrapper(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_USERS_EMAIL), email),
          },
          q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
        ),
        'GET_USER_BY_EMAIL_ERROR',
      );
    }

    async function getUserByProviderAccountId(providerId, providerAccountId) {
      _debug('GET_USER_BY_PROVIDER_ACCOUNT_ID', providerId, providerAccountId)
      return faunaWrapper(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_USERS_ACCOUNT_ID_PROVIDER_ID), [
              providerId,
              providerAccountId,
            ]),
          },
          q.If(
            q.Exists(q.Var('ref')),
            q.Select(
              'data',
              q.Get(
                q.Match(
                  q.Index(INDEX_USERS_ID),
                  q.Select('userId', q.Select('data', q.Get(q.Var('ref')))),
                ),
              ),
            ),
            null,
          ),
        ),
        'GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR',
      );
    }

    async function updateUser(user) {
      _debug('UPDATE_USER', user)
      return faunaWrapper(
        q.Select(
          'data',
          q.Update(q.Select('ref', q.Get(q.Match(q.Index(INDEX_USERS_ID), user.id))), {
            data: {
              ...user,
              updatedAt: Date.now(),
              emailVerified: user.emailVerified
                ? user.emailVerified.toISOString()
                : null,
            },
          }),
        ),
        'UPDATE_USER_ERROR',
      );
    }

    async function deleteUser(userId) {
      _debug('DELETE_USER', userId)

      const FQL = q.Delete(
        q.Ref(q.Collection('user'), userId)
      )

      try {
        await faunaClient.query(FQL)
      } catch (error) {
        console.error('DELETE_USER_ERROR', error)
        return Promise.reject(new Error('DELETE_USER_ERROR'))
      }
    }

    async function linkAccount(
      userId,
      providerId,
      providerType,
      providerAccountId,
      refreshToken,
      accessToken,
      accessTokenExpires,
    ) {
      _debug('LINK_ACCOUNT', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires)
      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('accounts'), {
            data: {
              userId,
              providerId,
              providerType,
              providerAccountId,
              refreshToken,
              accessToken,
              accessTokenExpires,
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          }),
        ),
        'LINK_ACCOUNT_ERROR',
      );
    }

    async function unlinkAccount(userId, providerId, providerAccountId) {
      _debug('UNLINK_ACCOUNT', userId, providerId, providerAccountId)

      const FQL = q.Delete(
        q.Match(
          q.Index(INDEX_USERS_ACCOUNT_ID_PROVIDER_ID),
          [providerId, providerAccountId]
        )
      )

      try {
        return await faunaClient.query(FQL)
      } catch (error) {
        console.error('UNLINK_ACCOUNT_ERROR', error)
        return Promise.reject(new Error(error))
      }
    }

    async function createSession(user) {
      _debug('CREATE_SESSION', user)
      let expires = null;
      if (sessionMaxAge) {
        const dateExpires = new Date();
        dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
        expires = dateExpires.toISOString();
      }

      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('sessions'), {
            data: {
              expires,
              userId: user.id,
              sessionToken: randomBytes(32).toString('hex'),
              accessToken: randomBytes(32).toString('hex'),
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          }),
        ),
        'CREATE_SESSION_ERROR',
      );
    }

    async function getSession(sessionToken: string) {
      _debug('GET_SESSION', sessionToken)
      const session: any = await faunaClient.query(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken),
          },
          q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
        ),
      );
      // Check session has not expired (do not return it if it has)
      if (session && session.expires && new Date() > session.expires) {
        await faunaClient.query(
          q.Delete(
            q.Select(
              'ref',
              q.Get(q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken)),
            ),
          ),
        );
        return null;
      }

      return session;
    }

    async function updateSession(session, force) {
      _debug('UPDATE_SESSION', session)
      if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
        // Calculate last updated date, to throttle write updates to database
        // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
        //     e.g. ({expiry date} - 30 days) + 1 hour
        //
        // Default for sessionMaxAge is 30 days.
        // Default for sessionUpdateAge is 1 hour.
        const dateSessionIsDueToBeUpdated = new Date(session.expires);
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge,
        );
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge,
        );

        // Trigger update of session expiry date and write to database, only
        // if the session was last updated more than {sessionUpdateAge} ago
        if (new Date() > dateSessionIsDueToBeUpdated) {
          const newExpiryDate = new Date();
          newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
          session.expires = newExpiryDate;
        } else if (!force) {
          return null;
        }
      } else {
        // If session MaxAge, session UpdateAge or session.expires are
        // missing then don't even try to save changes, unless force is set.
        if (!force) {
          return null;
        }
      }

      const { id, expires } = session;
      const newSession = faunaWrapper(
        q.Update(q.Select('ref', q.Get(q.Match(q.Index(INDEX_SESSIONS_ID), id))), {
          data: {
            expires,
            updatedAt: Date.now(),
          },
        }),
        'UPDATE_SESSION_ERROR',
      );
      return newSession
    }

    async function deleteSession(sessionToken) {
      _debug('DELETE_SESSION', sessionToken)
      return faunaWrapper(
        q.Delete(
          q.Select(
            'ref',
            q.Get(q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken)),
          ),
        ),
        'DELETE_SESSION_ERROR',
      );
    }

    async function createVerificationRequest(identifier, url, token, secret, provider) {
      _debug('CREATE_VERIFICATION_REQUEST', identifier)
      // console.log((identifier, url, token, secret, provider));
      try {
        const { baseUrl } = appOptions;
        const { sendVerificationRequest, maxAge } = provider;

        // Store hashed token (using secret as salt) so that tokens cannot be exploited
        // even if the contents of the database is compromised.
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');

        let expires = null;
        if (maxAge) {
          const dateExpires = new Date();
          dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
          expires = dateExpires.toISOString();
        }

        // Save to database
        const verificationRequest = await faunaClient.query(
          q.Create(q.Collection('verification_requests'), {
            data: {
              id: uuidv4(),
              identifier,
              token: hashedToken,
              expires,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          }),
        );

        // With the verificationCallback on a provider, you can send an email, or queue
        // an email to be sent, or perform some other action (e.g. send a text message)
        await sendVerificationRequest({ identifier, url, token, baseUrl, provider });

        return verificationRequest;
      } catch (error) {
        return Promise.reject(new Error(error));
      }
    }

    async function getVerificationRequest(_identifier, token, secret, _provider) {
      _debug('GET_VERIFICATION_REQUEST', _identifier, token)
      // console.log((identifier, token, secret, provider));
      try {
        // Hash token provided with secret before trying to match it with database
        // @TODO Use bcrypt instead of salted SHA-256 hash for token
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
        const verificationRequest = (await faunaClient.query(
          q.Let(
            {
              ref: q.Match(q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN), hashedToken),
            },
            q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
          ),
        ) as any);

        if (
          verificationRequest &&
          verificationRequest.expires &&
          new Date() > verificationRequest.expires
        ) {
          // Delete verification entry so it cannot be used again
          await faunaClient.query(
            q.Delete(
              q.Select(
                'ref',
                q.Get(
                  q.Match(
                    q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN),
                    hashedToken,
                  ),
                ),
              ),
            ),
          );
          return null;
        }

        return verificationRequest;
      } catch (error) {
        console.error('GET_VERIFICATION_REQUEST_ERROR', error);
        return Promise.reject(new Error(error));
      }
    }

    async function deleteVerificationRequest(_identifier, token, secret, _provider) {
      _debug('DELETE_VERIFICATION', _identifier, token)
      try {
        // Delete verification entry so it cannot be used again
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
        await faunaClient.query(
          q.Delete(
            q.Select(
              'ref',
              q.Get(q.Match(q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN), hashedToken)),
            ),
          ),
        );
      } catch (error) {
        console.error('DELETE_VERIFICATION_REQUEST_ERROR', error);
        return Promise.reject(new Error(error));
      }
    }

    return Promise.resolve({
      createUser,
      getUser,
      getUserByEmail,
      getUserByProviderAccountId,
      updateUser,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession,
      createVerificationRequest,
      getVerificationRequest,
      deleteVerificationRequest,
    });
  }

  return {
    getAdapter,
  };
};

export default {
  Adapter,
};
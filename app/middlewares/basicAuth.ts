import * as basicAuth from 'basic-auth';
import * as createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';

const debug = createDebug('waiter-prototype:middlewares:basicAuth');

/**
 * ベーシック認証ミドルウェア
 */
export default (req: Request, res: Response, next: NextFunction) => {
    // ベーシック認証のための環境変数設定なければスルー
    if (process.env.SSKTS_API_BASIC_AUTH_NAME === undefined || process.env.SSKTS_API_BASIC_AUTH_PASS === undefined) {
        next();

        return;
    }

    const user = basicAuth(req);
    if (user !== undefined
        && user.name === process.env.SSKTS_API_BASIC_AUTH_NAME
        && user.pass === process.env.SSKTS_API_BASIC_AUTH_PASS) {
        debug('authenticated!');
        // 認証情報が正しければOK
        next();

        return;
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="waiter-prototype Authentication"');
    res.status(UNAUTHORIZED).end('Unauthorized');
};

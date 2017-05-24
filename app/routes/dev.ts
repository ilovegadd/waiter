/**
 * devルーター
 *
 * @ignore
 */
import * as express from 'express';
const devRouter = express.Router();

import * as createDebug from 'debug';
import { NO_CONTENT } from 'http-status';
import * as mongoose from 'mongoose';

import mongooseConnectionOptions from '../../mongooseConnectionOptions';

const debug = createDebug('waiter-prototype:*');

devRouter.get(
    '/500',
    () => {
        throw new Error('500 manually');
    });

devRouter.get(
    '/environmentVariables',
    (req, res) => {
        debug('ip:', req.ip);
        res.json({
            data: {
                type: 'envs',
                attributes: process.env
            }
        });
    });

devRouter.get(
    '/mongoose/connect',
    (req, res, next) => {
        debug('ip:', req.ip);
        mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions, (err) => {
            if (err instanceof Error) {
                next(err);

                return;
            }

            res.status(NO_CONTENT).end();
        });
    });

devRouter.get(
    '/mongoose/disconnect',
    (req, res, next) => {
        debug('ip:', req.ip);
        mongoose.disconnect((err) => {
            if (err instanceof Error) {
                next(err);

                return;
            }

            res.status(NO_CONTENT).end();
        });
    });

export default devRouter;

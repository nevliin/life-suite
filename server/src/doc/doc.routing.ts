import {NextFunction, Request, Response, Router} from 'express';
import {ErrorCodeUtil} from '../utils/error-code/error-code.util';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {DocService} from './doc.service';
import {DocumentModel} from './model/document.model';
import {FolderModel} from './model/folder.model';
import {TagModel} from './model/tag.model';
import {DIContainer} from '../core/di-container';
import {DocTypes} from './doc.types';

const express = require('express');

export const docRouter = (): Router => {
    const docRouter = express.Router();

    const docService: DocService = DIContainer.get(DocTypes.DocService);

    docRouter.use('/document', DIContainer.get(DocTypes.DocumentCRUD).getRouter());

    docRouter.use('/folder', DIContainer.get(DocTypes.FolderCRUD).getRouter());

    docRouter.use('/tag', DIContainer.get(DocTypes.TagCRUD).getRouter());

    return docRouter;
};

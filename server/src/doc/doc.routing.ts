import {NextFunction, Request, Response, Router} from 'express';
import {ErrorCodeUtil} from '../utils/error-code/error-code.util';
import {CRUDConstructor, DBType} from '../core/crud/crud-constructor';
import {DocService} from './doc.service';
import {DocumentModel} from './model/document.model';
import {FolderModel} from './model/folder.model';
import {TagModel} from './model/tag.model';

const express = require('express');

export const docRouter = (): Router => {
    const docRouter = express.Router();

    const docService: DocService = new DocService();

    // CRUD Routes
    const documentModelCRUD: CRUDConstructor<DocumentModel> = new CRUDConstructor(new DocumentModel(), 'doc_document', 'document', {
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    const folderModelCRUD: CRUDConstructor<FolderModel> = new CRUDConstructor(new FolderModel(), 'doc_folder', 'folder', {
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    const tagModelCRUD: CRUDConstructor<TagModel> = new CRUDConstructor(new TagModel(), 'doc_tag', 'tag', {
        autoIncrementId: true,
        dbType: DBType.PGSQL
    });

    docRouter.use('/document', documentModelCRUD.getRouter());

    docRouter.use('/folder', folderModelCRUD.getRouter());

    docRouter.use('/tag', tagModelCRUD.getRouter());

    return docRouter;
};

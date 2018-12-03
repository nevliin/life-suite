export interface IServerConfig {
    jwtsecret: string;
    mysqldb: IDBConfig;
    pgsqldb: IDBConfig;
    auth: IDBConfig;
}

export interface IDBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}
export interface ServerConfig {
    jwtsecret: string;
    volume: string;
    mysqldb: DBConfig;
    pgsqldb: DBConfig;
    auth: DBConfig;
}

export interface DBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

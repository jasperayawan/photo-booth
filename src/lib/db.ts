import "server-only"
import { Pool, QueryResult, QueryResultRow } from "pg"

// Define environment variable types
declare global {
    var pgPool: Pool | undefined;

    namespace NodeJS {
        interface ProcessEnv {
            DB_HOST: string;
            DB_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_PORT?: string;
            DB_CA_CERTIFICATE?: string;
        }

        // Extend the global interface to include our database instance
        interface Global {
            pgPool?: Pool
        }
    }
}

// Define the database interface

interface Database {
    query<T extends QueryResultRow = any>(
        text: string,
        params?: any[]
    ): Promise<QueryResult<T>>;
    getPool(): Pool;
    end(): Promise<void>;
}

const poolConfig = {
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERTIFICATE
    }
}
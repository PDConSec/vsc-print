import {Repository} from "./repository";
import {Client as PgClient} from 'pg';
import {DatabaseModel} from "../models/domain/databaseModel";
import {TableColumn} from "../models/domain/tableColumn";
import {TableRelationship} from "../models/domain/tableRelationship";
import {TableConstraint} from "../models/domain/tableConstraint";
import {TableIndex} from "../models/domain/tableIndex";

export class PostgresRepository implements Repository {
    private readonly connectionString: string;
    private readonly schemaName: string;
    private readonly tables?: string[];

    constructor(connectionString: string, schemaName?: string, tables?: string[]) {
        this.connectionString = connectionString;
        this.schemaName = schemaName ?? "public";
        this.tables = tables;
    }

    async getDatabaseInfo(): Promise<DatabaseModel> {
        const client = new PgClient({connectionString: this.connectionString});
        await client.connect();

        const columnsQuery = `
        SELECT 
            c.table_name, 
            c.column_name, 
            c.udt_name,
            CASE 
                WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'PK'
                WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'FK'
                ELSE NULL
            END AS keyType
        FROM 
            information_schema.columns c
            LEFT JOIN information_schema.key_column_usage kcu
              ON c.table_schema = kcu.table_schema
              AND c.table_name = kcu.table_name
              AND c.column_name = kcu.column_name
            LEFT JOIN information_schema.table_constraints tc
              ON kcu.constraint_name = tc.constraint_name
              AND kcu.table_schema = tc.table_schema
        WHERE 
            c.table_schema = $1
            ${this.tables ? 'AND c.table_name = ANY($2)' : ''}
    `;

        const relationshipsQuery = `
        SELECT 
            tc.table_name AS primaryTable,
            kcu.column_name AS primaryKey,
            ccu.table_name AS foreignTable,
            ccu.column_name AS foreignKey
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE 
            tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = $1
            ${this.tables ? 'AND tc.table_name = ANY($2)' : ''}
    `;

        const constraintsQuery = `
        SELECT 
            tc.table_name, 
            tc.constraint_name, 
            tc.constraint_type, 
            kcu.column_name
        FROM 
            information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
        WHERE 
            tc.table_schema = $1
            ${this.tables ? 'AND tc.table_name = ANY($2)' : ''}
    `;

        const indexesQuery = `
        SELECT 
            t.relname AS table_name,
            i.relname AS index_name,
            a.attname AS column_name
        FROM 
            pg_class t, 
            pg_class i, 
            pg_index ix, 
            pg_attribute a
        WHERE 
            t.oid = ix.indrelid
            AND i.oid = ix.indexrelid
            AND a.attrelid = t.oid
            AND a.attnum = ANY(ix.indkey)
            AND t.relkind = 'r'
            AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = $1)
            ${this.tables ? 'AND t.relname = ANY($2)' : ''}
    `;

        const parms: any[] = [this.schemaName];
        if (this.tables) parms.push(this.tables);
        const columnsResult = await client.query(columnsQuery, parms);
        const relationshipsResult = await client.query(relationshipsQuery, parms);
        const constraintsResult = await client.query(constraintsQuery, parms);
        const indexesResult = await client.query(indexesQuery, parms);

        const tables: TableColumn[] = columnsResult.rows.map(row => ({
            tableName: row.table_name,
            columnName: row.column_name,
            columnType: row.udt_name,
            keyType: row.keytype
        }));

        const relationships: TableRelationship[] = relationshipsResult.rows.map((row: any) => ({
            primaryTable: row.primarytable,
            foreignTable: row.foreigntable,
            primaryKey: row.primarykey,
            foreignKey: row.foreignkey
        }));

        const constraints: TableConstraint[] = constraintsResult.rows.map((row: any) => ({
            tableName: row.table_name,
            constraintName: row.constraint_name,
            constraintType: row.constraint_type,
            columnName: row.column_name
        }));

        const indexes: TableIndex[] = indexesResult.rows.map((row: any) => ({
            tableName: row.table_name,
            indexName: row.index_name,
            columnName: row.column_name
        }));

        await client.end();

        return {tables, relationships, constraints, indexes};
    }
}

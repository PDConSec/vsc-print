import {Repository} from "./repository";
import {DatabaseModel} from "../models/domain/databaseModel";
import mysql from 'mysql2/promise';
import {TableIndex} from "../models/domain/tableIndex";
import {TableConstraint} from "../models/domain/tableConstraint";
import {TableRelationship} from "../models/domain/tableRelationship";
import {TableColumn} from "../models/domain/tableColumn";

export class MySqlRepository implements Repository {
    private readonly connectionString: string;
    private readonly schemaName: string;
    private readonly tables?: string[];

    constructor(connectionString: string, schemaName?: string, tables?: string[]) {
        this.connectionString = connectionString;
        this.schemaName = schemaName ?? "mysql";
        this.tables = tables;
    }

    async getDatabaseInfo(): Promise<DatabaseModel> {
        const connection = await mysql.createConnection(this.connectionString);

        const columnsQuery = `
        SELECT 
            c.table_name AS tableName, 
            c.column_name AS columnName, 
            c.data_type AS columnType,
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
            c.table_schema = ?
            ${this.tables ? 'AND c.table_name IN (?)' : ''}
    `;

        const relationshipsQuery = `
        SELECT 
            kcu.table_name AS primaryTable,
            kcu.column_name AS primaryKey,
            kcu.referenced_table_name AS foreignTable,
            kcu.referenced_column_name AS foreignKey
        FROM 
            information_schema.key_column_usage kcu
        WHERE 
            kcu.referenced_table_schema = ?
            ${this.tables ? 'AND kcu.table_name IN (?)' : ''}
    `;

        const constraintsQuery = `
        SELECT 
            tc.table_name AS tableName,
            tc.constraint_name AS constraintName,
            tc.constraint_type AS constraintType,
            kcu.column_name AS columnName
        FROM 
            information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
        WHERE 
            tc.table_schema = ?
            ${this.tables ? 'AND tc.table_name IN (?)' : ''}
    `;

        const indexesQuery = `
        SELECT 
            table_name AS tableName,
            index_name AS indexName,
            column_name AS columnName
        FROM 
            information_schema.statistics
        WHERE 
            table_schema = ?
            ${this.tables ? 'AND table_name IN (?)' : ''}
    `;

        const [columnsResult] = await connection.execute(columnsQuery, [this.schemaName, this.tables]);
        const [relationshipsResult] = await connection.execute(relationshipsQuery, [this.schemaName, this.tables]);
        const [constraintsResult] = await connection.execute(constraintsQuery, [this.schemaName, this.tables]);
        const [indexesResult] = await connection.execute(indexesQuery, [this.schemaName, this.tables]);

        const tables: TableColumn[] = (columnsResult as any[]).map((row: any) => ({
            tableName: row.table_name,
            columnName: row.column_name,
            columnType: row.data_type,
            keyType: row.keyType
        }));

        const relationships: TableRelationship[] = (relationshipsResult as any[]).map((row: any) => ({
            primaryTable: row.primaryTable,
            foreignTable: row.foreignTable,
            primaryKey: row.primaryKey,
            foreignKey: row.foreignKey
        }));

        const constraints: TableConstraint[] = (constraintsResult as any[]).map((row: any) => ({
            tableName: row.table_name,
            constraintName: row.constraint_name,
            constraintType: row.constraint_type,
            columnName: row.column_name
        }));

        const indexes: TableIndex[] = (indexesResult as any[]).map((row: any) => ({
            tableName: row.table_name,
            indexName: row.index_name,
            columnName: row.column_name
        }));

        await connection.end();

        return {tables, relationships, constraints, indexes};
    }


}

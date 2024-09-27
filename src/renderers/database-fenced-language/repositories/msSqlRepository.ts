import {Repository} from "./repository";
import {DatabaseModel} from "../models/domain/databaseModel";
import * as mssql from "mssql";
import {TableColumn} from "../models/domain/tableColumn";
import {TableRelationship} from "../models/domain/tableRelationship";
import {TableConstraint} from "../models/domain/tableConstraint";
import {TableIndex} from "../models/domain/tableIndex";

export class MsSqlRepository implements Repository {
    private readonly connectionString: string;
    private readonly schemaName: string;
    private readonly tables?: string[];

    constructor(connectionString: string, schemaName?: string, tables?: string[]) {
        this.connectionString = this.sanitizeConnectionString(connectionString);
        this.schemaName = schemaName ?? "dbo";
        this.tables = tables;
    }

    async getDatabaseInfo(): Promise<DatabaseModel> {
        const pool = await mssql.connect(this.connectionString);

        let tablesCondition = '';
        if (this.tables && this.tables.length > 0) {
            // Prepare a list of parameters
            tablesCondition = 'AND t.name IN (' + this.tables.map((_, i) => `@table${i}`).join(', ') + ')';
        }

        const columnsQuery = `
        SELECT 
            t.name AS tableName, 
            c.name AS columnName, 
            tp.name AS columnType,
            CASE 
                WHEN i.is_primary_key = 1 THEN 'PK'
                WHEN fk.name IS NOT NULL THEN 'FK'
                ELSE NULL
            END AS keyType
        FROM 
            sys.tables t
            INNER JOIN sys.columns c ON t.object_id = c.object_id
            INNER JOIN sys.types tp ON c.user_type_id = tp.user_type_id
            LEFT JOIN sys.index_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
            LEFT JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
            LEFT JOIN sys.foreign_key_columns fkc ON c.object_id = fkc.parent_object_id AND c.column_id = fkc.parent_column_id
            LEFT JOIN sys.foreign_keys fk ON fkc.constraint_object_id = fk.object_id
        WHERE 
            t.schema_id = SCHEMA_ID(@schema)
            ${tablesCondition}
    `;

        const relationshipsQuery = `
        SELECT 
            fk.name AS foreignKey,
            t.name AS primaryTable,
            cp.name AS primaryKey,
            tf.name AS foreignTable,
            cf.name AS foreignKeyColumn
        FROM 
            sys.foreign_keys fk
            INNER JOIN sys.tables t ON fk.referenced_object_id = t.object_id
            INNER JOIN sys.tables tf ON fk.parent_object_id = tf.object_id
            INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
            INNER JOIN sys.columns cp ON fkc.referenced_column_id = cp.column_id AND fkc.referenced_object_id = cp.object_id
            INNER JOIN sys.columns cf ON fkc.parent_column_id = cf.column_id AND fkc.parent_object_id = cf.object_id
        WHERE 
            t.schema_id = SCHEMA_ID(@schema)
            ${tablesCondition}
    `;

        const constraintsQuery = `
        SELECT 
            t.name AS tableName,
            c.name AS constraintName,
            c.type_desc AS constraintType,
            col.name AS columnName
        FROM 
            sys.tables t
            INNER JOIN sys.check_constraints c ON t.object_id = c.parent_object_id
            INNER JOIN sys.columns col ON c.parent_column_id = col.column_id
        WHERE 
            t.schema_id = SCHEMA_ID(@schema)
            ${tablesCondition}
    `;

        const indexesQuery = `
        SELECT 
            t.name AS tableName,
            i.name AS indexName,
            c.name AS columnName
        FROM 
            sys.tables t
            INNER JOIN sys.indexes i ON t.object_id = i.object_id
            INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        WHERE 
            t.schema_id = SCHEMA_ID(@schema)
            ${tablesCondition}
    `;

        const columnsRequest = pool.request();
        columnsRequest.input('schema', this.schemaName);
        if (this.tables) {
            this.tables.forEach((table, index) => {
                columnsRequest.input(`table${index}`, mssql.NVarChar, table);
            });
        }

        const relationshipsRequest = pool.request();
        relationshipsRequest.input('schema', this.schemaName);
        if (this.tables) {
            this.tables.forEach((table, index) => {
                relationshipsRequest.input(`table${index}`, mssql.NVarChar, table);
            });
        }

        const constraintsRequest = pool.request();
        constraintsRequest.input('schema', this.schemaName);
        if (this.tables) {
            this.tables.forEach((table, index) => {
                constraintsRequest.input(`table${index}`, mssql.NVarChar, table);
            });
        }

        const indexesRequest = pool.request();
        indexesRequest.input('schema', this.schemaName);
        if (this.tables) {
            this.tables.forEach((table, index) => {
                indexesRequest.input(`table${index}`, mssql.NVarChar, table);
            });
        }

        const columnsResult = await columnsRequest.query(columnsQuery);
        const relationshipsResult = await relationshipsRequest.query(relationshipsQuery);
        const constraintsResult = await constraintsRequest.query(constraintsQuery);
        const indexesResult = await indexesRequest.query(indexesQuery);

        const tables: TableColumn[] = columnsResult.recordset.map((row: any) => ({
            tableName: row.tableName,
            columnName: row.columnName,
            columnType: row.columnType,
            keyType: row.keyType
        }));

        const relationships: TableRelationship[] = relationshipsResult.recordset.map((row: any) => ({
            primaryTable: row.primaryTable,
            foreignTable: row.foreignTable,
            primaryKey: row.primaryKey,
            foreignKey: row.foreignKeyColumn
        }));

        const constraints: TableConstraint[] = constraintsResult.recordset.map((row: any) => ({
            tableName: row.tableName,
            constraintName: row.constraintName,
            constraintType: row.constraintType,
            columnName: row.columnName
        }));

        const indexes: TableIndex[] = indexesResult.recordset.map((row: any) => ({
            tableName: row.tableName,
            indexName: row.indexName,
            columnName: row.columnName
        }));

        return {tables, relationships, constraints, indexes};
    }

    private sanitizeConnectionString(connectionString: string): string {
        // https://stackoverflow.com/a/67005280
        if (!connectionString.includes('trustServerCertificate')) {
            connectionString += `trustServerCertificate=true`;
        }

        return connectionString;
    }
}

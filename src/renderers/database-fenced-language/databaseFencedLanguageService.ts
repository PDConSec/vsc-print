import {DatabaseDiagramRequest} from "./models/request/databaseDiagramRequest";
import {MsSqlRepository} from "./repositories/msSqlRepository";
import {PostgresRepository} from "./repositories/postgresRepository";
import {Repository} from "./repositories/repository";
import {DatabaseType} from "./models/request/databaseType";
import {DatabaseDiagramResponse} from "./models/response/databaseDiagramResponse";
import {DatabaseModel} from "./models/domain/databaseModel";
import {MySqlRepository} from "./repositories/mySqlRepository";

export class databaseFencedLanguageService {
    // https://mermaid.js.org/syntax/entityRelationshipDiagram.html
    createKrokiMarkup(databaseInformation: DatabaseModel, detail: "tables" | "keys" | "columns" | "types"): DatabaseDiagramResponse {
        let mermaid = '%%{init: {"er": {"layoutDirection": "TB", "useMaxWidth": true }}}%%\nerDiagram\n';

        // Generate table definitions
        const tables = new Map<string, Set<string>>();

        for (let i = 0; i < databaseInformation.tables.length; i++) {
            const column = databaseInformation.tables[i];
            if (!tables.has(column.tableName)) {
                tables.set(column.tableName, new Set());
            }
            let columnDetail = `${column.columnType} ${column.columnName.replace(/ /g, "-")}`;
            if (column.keyType) {
                columnDetail += ` ${column.keyType}`;
            }
            tables.get(column.tableName)!.add(columnDetail.trim());
        }

        for (const [tableName, columns] of tables) {
            mermaid += `  "${tableName}" {\n`;
            for (const column of columns) {
                mermaid += `    ${column}\n`;
            }
            mermaid += `  }\n`;
        }

        // Generate relationships
        if (detail === 'keys' || detail === 'columns' || detail === 'types') {
            for (let i = 0; i < databaseInformation.relationships.length; i++) {
                const relationship = databaseInformation.relationships[i];
                mermaid += `  ${relationship.primaryTable} ||--o{ ${relationship.foreignTable} : "${relationship.primaryKey} to ${relationship.foreignKey}"\n`;
            }
        }

        return {
            markupLanguage: 'MERMAID',
            value: mermaid
        };
    }

    async getDatabaseInformation(request: DatabaseDiagramRequest): Promise<DatabaseModel> {
        let repository: Repository;

        switch (request.DatabaseType) {
            case DatabaseType.mssql:
                repository = new MsSqlRepository(request.ConnectionString, request.Schema, request.Tables);
                break;
            case DatabaseType.postgresql:
                repository = new PostgresRepository(request.ConnectionString, request.Schema, request.Tables);
                break;
            case DatabaseType.mysql:
                repository = new MySqlRepository(request.ConnectionString, request.Schema, request.Tables);
                break;
            default:
                throw new Error("Database type not supported");
        }

        return await repository.getDatabaseInfo();
    }
}

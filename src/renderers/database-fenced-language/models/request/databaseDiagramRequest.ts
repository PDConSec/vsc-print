import {DatabaseType} from "./databaseType";

export interface DatabaseDiagramRequest {
    DatabaseType: DatabaseType;
    ConnectionString: string;
    Schema?: string;
    Tables?: string[];
    Detail: 'tables' | 'keys' | 'columns' | 'types';
}

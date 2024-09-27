import {DatabaseModel} from "../models/domain/databaseModel";

export interface Repository {
    getDatabaseInfo(): Promise<DatabaseModel>;
}

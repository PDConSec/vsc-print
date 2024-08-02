import {TableColumn} from "./tableColumn";
import {TableRelationship} from "./tableRelationship";
import {TableConstraint} from "./tableConstraint";
import {TableIndex} from "./tableIndex";

export interface DatabaseModel {
    tables: TableColumn[];
    relationships: TableRelationship[];
    constraints: TableConstraint[];
    indexes: TableIndex[];
}

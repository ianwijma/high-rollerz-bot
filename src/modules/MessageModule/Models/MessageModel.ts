import DatabaseManager from "../../../core/DatabaseManager";
import * as Bookshelf from "bookshelf";
let bookshelf:Bookshelf = DatabaseManager.ormDb();

export default class MessageModel extends bookshelf.Model<MessageModel> {
    tableName:string = 'message';
}
import DatabaseManager from "../../../core/DatabaseManager";
import * as Bookshelf from "bookshelf";
var bookshelf:Bookshelf = DatabaseManager.ormDb();

export default class MessageModel extends bookshelf.Model<MessageModel> {
    tableName: string = 'messages';
}
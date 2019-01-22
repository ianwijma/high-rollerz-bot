import * as Knex from "knex";

exports.up = function (knex: Knex) {
    return knex.schema.createTable('messages', t => {
        t.bigIncrements('id').unsigned().primary();
        t.string('name')
    })
};

exports.down = function (knex: Knex) {
    return knex.schema.dropTableIfExists('messages');
};

import { DataSource } from "typeorm";
import { SqlDatabase } from "@langchain/classic/sql_db";

const dataSource = new DataSource({
  type: "better-sqlite3",
  database: "./src/db/Chinook.db",
});

export const database = await SqlDatabase.fromDataSourceParams({
  appDataSource: dataSource,
});

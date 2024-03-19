import sqlite3, { Statement } from "sqlite3";
import { AsyncDatabase } from "promised-sqlite3";
import fs from "fs";
import { ISongData } from "../types/ISongData";
import config from "../config";

const dbPath = config.databasePath;
const tablesPath = "./assets/tables.sql";

export async function prepareTables(): Promise<void> {
  const db = await AsyncDatabase.open(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  );
  const statement = fs.readFileSync(tablesPath, { encoding: "utf-8" });

  await db.exec(statement);
  await db.close();
}

export async function addToQueue(song: ISongData, guid: string | undefined) {
  const db = await AsyncDatabase.open(dbPath);
  const statement = `
    INSERT INTO QUEUES (title, src, duration, guid, iat)
    VALUES ($title, $src, $duration, $guid, $iat)
  `;
  await db.run(statement, {
    $title: song.title,
    $src: song.src,
    $duration: song.duration,
    $guid: guid,
    $iat: new Date().getTime(),
  });

  await db.close();
}

export async function getQueue(guid: string | undefined) {
  const db = await AsyncDatabase.open(dbPath);

  const getStatement = `
    SELECT * FROM "QUEUES"
    WHERE guid = $guid
    ORDER BY iat ASC
  `;

  const data: any = await db.all(getStatement, {
    $guid: guid,
  });

  return data == undefined ? null : (data as Array<ISongData>);
}

export async function getCurrentSong(guid: string | undefined) {
  const db = await AsyncDatabase.open(dbPath);

  const getStatement = `
    SELECT * FROM "QUEUES"
    WHERE guid = $guid
    ORDER BY iat ASC
    LIMIT 1
  `;

  const data: any = await db.get(getStatement, {
    $guid: guid,
  });

  return data == undefined ? null : (data as ISongData);
}

export async function shiftQueue(guid: string | undefined) {
  const db = await AsyncDatabase.open(dbPath);

  const deleteStatement = `
    DELETE FROM "QUEUES"
    WHERE id IN (
      SELECT id FROM "QUEUES"
        WHERE guid = $guid
        ORDER BY iat ASC
        LIMIT 1
    )
  `;

  await db.run(deleteStatement, {
    $guid: guid,
  });
}

export async function isEmptyQueue(guid: string) {
  const db = await AsyncDatabase.open(dbPath);

  const getStatement = `
    SELECT * FROM "QUEUES"
    WHERE guid = $guid
    ORDER BY iat ASC
    LIMIT 1
  `;

  const data: any = await db.get(getStatement, {
    $guid: guid,
  });

  return !data;
}

export async function clearQueue(guid: string | undefined) {
  const db: AsyncDatabase = await AsyncDatabase.open(dbPath);

  const deleteStatement: string = `DELETE FROM "QUEUES" WHERE guid = $guid`;

  await db.run(deleteStatement, {
    $guid: guid,
  });
}

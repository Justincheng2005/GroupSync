import { db } from "../connect.js";


export const getList = (req, res) => {
    const q = "";

  db.query(q, [], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}

export const addList = (req, res) => {
    const q = "";

  db.query(q, [], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}

export const deleteList = (req, res) => {
  const q = "";

db.query(q, [], (err, data) => {
  if (err) return res.status(500).json(err);
  return res.status(200).json(data);
});
}
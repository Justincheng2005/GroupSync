import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import generator from "generate-password";


export const getUserGroups = (req, res) => {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in!");
    
      jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        
        const q = "SELECT g.groupId, g.groupName, g.groupPic FROM `groups` AS g INNER JOIN `userGroups` AS ug ON ug.groupId = g.groupId WHERE ug.userId = ?";

        db.query(q, userInfo.id, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      });
};

export const getGroup = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
        console.log(req.params.id+"testParams");

        const q = "SELECT * FROM `groups` WHERE groupId = ?";
        db.query(q, req.params.id, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
}

export const joinGroup = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        //check if user is already in group
        const memberQ = "SELECT * FROM `userGroups` WHERE `userid` = ? AND `groupid` = (SELECT groupId FROM `groups` WHERE inviteCode = ?)";
        db.query(memberQ, [userInfo.id, req.body.inviteCode], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length) return res.status(409).json("User already in group!");

                
            //add invite link in the future

            //add user to group
            const q =
            "INSERT INTO `userGroups` (`userId`, `groupId`) SELECT ?, `groupId` FROM `groups` WHERE inviteCode = ?";


            db.query(q, [userInfo.id, req.body.inviteCode], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("User added to group.");
                });
            });
  });
};

export const createGroup = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

     jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        //generate invite code
        let inviteCode = generator.generate({
            length: 8,
            numbers:true
        });        
        let uniqueCode = 0;
        //wrap query in promise and use async await(code after query happens before query is done)
         while(uniqueCode == 0){
            const checkCode = "SELECT * FROM `groups` WHERE `inviteCode` = ?";
            uniqueCode = await new Promise((resolve, reject) => {
                db.query(checkCode, [inviteCode], (err, data) => {
                    if (err) reject(err);
                    if(data.length){
                        inviteCode = generator.generate({
                            length: 8,
                            numbers:true
                        });
                        resolve(0);
                    } else { 
                        resolve(1);
                    }
                });
            });
         }

        //create group in db
        const q =
        "INSERT INTO `groups` (`groupName`, `groupPic`, `inviteCode`, `ownerId`) VALUES (?)";
        console.log(req.body.groupPic);
        const values = [
            req.body.groupName,
            req.body.groupPic,
            inviteCode,
            userInfo.id
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            //add to group in db
            const addUser = "INSERT INTO `userGroups` (`userId`, `groupId`) SELECT `ownerId`, `groupId` FROM `groups` WHERE `inviteCode` = ?";
            db.query(addUser, [inviteCode], (err, data) => {
                if (err) return res.status(500).json(err);
            });
            return res.status(200).json("Group created and creator has been added.");
        });
  });
};

export const deleteGroup = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
        "DELETE FROM `groups` WHERE `groupId`=? AND `ownerId` = ?";

        db.query(q, [req.body.groupId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Group has been deleted.");
            return res.status(403).json("You can only delete groups you own")
        });
    });
};
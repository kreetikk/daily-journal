const { Router } = require("express");
const fs = require("fs");
const path = require('path')
const save = require("./lib");
const filePath = path.join(__dirname, "..", "data", "dailyJournals.json");

if(!fs.existsSync(filePath)){
  fs.writeFileSync(filePath,"{}")
}

let journals = require(filePath);

const router = new Router();

router.get("/", (req, res) => {
  res.status(200).json(Object.values(journals).filter(x => !x.isDeleted));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (journals[id] && !journals[id].isDeleted) {
    return res.status(200).json(journals[id]);
  }
  res.status(404).json({
    message: "Journal Not Found"
  });
});

router.post("/", (req, res) => {
  const { title, content } = req.body;
  if (!title.trim()) {
    return res.status(400).json({
      message: "The title is required."
    });
  } else if (!content.trim()) {
    return res.status(400).json({
      message: "The content is required."
    });
  }
  const today = new Date();
  const result = Object.values(journals).find(x => {
    const journalDate = new Date(x.createdAt);
    return (
      journalDate.getDate() === today.getDate() &&
      journalDate.getMonth() === today.getMonth() &&
      journalDate.getFullYear() === today.getFullYear() &&
      !x.isDeleted
    );
  });

  if (result) {
    return res.status(400).json({
      message: "You have already created today's journal. Please edit."
    });
  }

  const ids = Object.keys(journals);
  const id = ids.length ? +ids[ids.length - 1] + 1 : 1;

  const request = {
    id,
    title,
    content,
    createdAt: today,
    updatedAt: today,
    isDeleted: false
  };
  journals[id] = request;
  save(journals);
  res.status(201).json(request);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title.trim()) {
    return res.status(400).json({
      message: "The title is required."
    });
  } else if (!content.trim()) {
    return res.status(400).json({
      message: "The content is required."
    });
  }
  if (journals[id]) {
    journals[id].title = title;
    journals[id].content = content;
    journals[id].updatedAt = new Date();

    save(journals);
    return res.status(200).json(journals[id]);
  }
  res.status(404).json({
    message: "Journal Not Found"
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (journals[id]) {
    journals[id].isDeleted = true;
    save(journals);

    return res.status(200).json({
      status: "deleted"
    });
  }
  res.status(404).json({
    message: "Journal Not Found"
  });
});

module.exports = router;

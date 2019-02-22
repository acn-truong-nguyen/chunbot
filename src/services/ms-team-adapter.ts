import crypto from "crypto";

const bufSecret = new Buffer(process.env.MSTEAM_WEBHOOK_SECRET, "base64");

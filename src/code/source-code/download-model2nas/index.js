'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const downloads = require('@serverless-devs/downloads').default;


async function getFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      resolve(fileHash);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}
async function copyDirectory(sourceDir, targetDir) {
  await fs.promises.mkdir(targetDir, { recursive: true });
  const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    const targetPath = path.join(targetDir, file.name);
    if (file.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}
function listAllFiles(dirPath) {
  const readDirSync = (dir) => {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        console.log(fullPath);
      }
      else if (entry.isDirectory()) {
        files = files.concat(readDirSync(fullPath));
      }
    }

    return files;
  };

  readDirSync(dirPath);
}


exports.handler = async (_event, _context, callback) => {
  const hashTag = process.env.MODEL_FILE_HASH || 'b5e0ce3470abf5ef3831aa1bd5553b486803e83251590ab7ff35a117cf6aad38';
  const region = process.env.region || 'cn-hangzhou';
  const download_path = process.env.download_path || '/mnt/embedding-download'
  const embedding_model_name = process.env.EMBEDDING_MODEL_NAME || 'bge-m3'
  const fileUrl = `https://serverless-ai-models-${region}.oss-${region}-internal.aliyuncs.com/${embedding_model_name}/pytorch_model.bin`;
  const filename = path.basename(fileUrl);
  const downloadDir = `${download_path}/${embedding_model_name}`;
  try {
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
      const sourceDir = path.join(process.cwd(), embedding_model_name)
      await copyDirectory(sourceDir, downloadDir)
    }
    const embeddingCkpt = path.join(downloadDir, filename);
    console.log('begin download', embeddingCkpt)
    if (fs.existsSync(embeddingCkpt)) {
      const fileHash = await getFileHash(downloadDir + '/' + filename);
      if (fileHash === hashTag) {
        callback(null, 'model exists');
        return;
      }
    }
    await downloads(fileUrl, {
      dest: downloadDir,
      filename,
      extract: false,
    });
    listAllFiles(downloadDir);
    const fileHash = await getFileHash(downloadDir + '/' + filename);
    if (fileHash === hashTag) {
      callback(null, 'download success');
    } else {
      callback(new Error('file hash not match,please retry'));
    }

  } catch (e) {
    console.log(e);
    callback(e);
  }

};
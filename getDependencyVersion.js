// 获取项目中指定依赖版本
const fs = require('fs');
const path = require('path');

let i = 0; // 避免多个相同依赖

// 读取项目的package.json文件
const packJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// 指定您感兴趣的依赖的名称
const dependencyName = 'react'; // 将其替换为您需要的依赖名称

// 获取依赖的版本
const dependencyVersion = packJson.dependencies[dependencyName] || packJson.devDependencies[dependencyName];

console.log(`package.json中 ${dependencyName} 版本：`, dependencyVersion);

const nodeModulesPath = path.join(__dirname, 'node_modules');

// 递归读取node_modules文件夹中的所有依赖的package.json文件
function readAllDependencies(folderPath, result = {}) {
  const folders = fs.readdirSync(folderPath);

  folders.forEach((folder) => {
    const packageJsonPath = path.join(folderPath, folder, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      if (packageJson.name === dependencyName) {
        result[`${packageJson.name}_${i}`] = packageJson.version;
        i += 1;
      }
    }

    const nestedFolderPath = path.join(folderPath, folder, 'node_modules');
    if (fs.existsSync(nestedFolderPath)) {
      readAllDependencies(nestedFolderPath, result);
    }
  });

  return result;
}

const allDependencies = readAllDependencies(nodeModulesPath);

console.log(`node_module中 ${dependencyName} 版本：`, allDependencies);
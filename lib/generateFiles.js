const path = require("path");
const fs = require("fs");
const xfs = require("fs.extra");
const Handlebars = require("handlebars");
const _ = require("lodash");
const { setPascalCase } = require("./function");

//커스텀 handlebars 함수를 불러와 등록한다.
require("./handlebars");

/**
 * @author Ryan
 * @description 도메인별 파일 생성(Controller, Service, Module)
 *
 * @param {Object} config
 */
function domainGenerateFiles(config) {
  const { modules, ...fileInfos } = config.projectStructure;

  for (const key in fileInfos) {
    if (Object.hasOwnProperty.call(fileInfos, key)) {
      const element = fileInfos[key];

      new Promise((resolve, reject) => {
        fs.readFile(
          path.join(config.root, config.file_name),
          "utf8",
          (err, data) => {
            if (err) return reject(err);
            const subdir = config.root.replace(
              new RegExp(`${config.templates_dir}[/]?`),
              ""
            );

            //컴파일 될 파일 이름
            const new_filename = config.file_name.replace(
              "___",
              _.kebabCase(element.domainName)
            );

            const target_file = path.resolve(
              config.target_dir,
              subdir,
              new_filename
            );

            const template = Handlebars.compile(data.toString());

            const importRequestDto = element.importRequestDto;
            const serviceImportRequestDto = element.serviceImportRequestDto;

            const content = template({
              openbrace: "{",
              closebrace: "}",
              decorator_method: element.decorator_method,
              domainName: element.domainName,
              domainInfo: element.domainInfo,
              importRequestDto,
              serviceImportRequestDto,
              rootPath: element.rootPath,
              router: element.router,
            });

            fs.writeFile(target_file, content, "utf8", (err) => {
              if (err) return reject(err);
              resolve();
            });
          }
        );
      });
    }
  }
}

/**
 * @author Ryan
 * @description DTO 파일 생성
 *
 * @param {@} config
 */
function dtoGenerateFile(config) {
  const fileInfos = config.dtoObjectList;

  for (const key in fileInfos) {
    if (Object.hasOwnProperty.call(fileInfos, key)) {
      const element = fileInfos[key];

      new Promise((resolve, reject) => {
        fs.readFile(
          path.join(config.root, config.file_name),
          "utf8",
          (err, data) => {
            if (err) return reject(err);
            const subdir = config.root.replace(
              new RegExp(`${config.templates_dir}[/]?`),
              ""
            );

            //컴파일 될 파일 이름
            const new_filename = config.file_name.replace(
              "---",
              _.camelCase(element.className)
            );

            const target_file = path.resolve(
              config.target_dir,
              subdir,
              new_filename
            );

            const template = Handlebars.compile(data.toString());

            const content = template({
              openbrace: "{",
              closebrace: "}",
              classValidatorList: element.classValidatorList,
              importRequestDto: element.importRequestDto,
              className: element.className,
              variableList: element.variableList,
            });

            fs.writeFile(target_file, content, "utf8", (err) => {
              if (err) return reject(err);
              resolve();
            });
          }
        );
      });
    }
  }
}

/**
 * @author Ryan
 * @description data 파일 생성
 *
 * @param {@} config
 */
function dataGenerateFile(config) {
  const fileInfos = config.dataObjectList;

  for (const key in fileInfos) {
    if (Object.hasOwnProperty.call(fileInfos, key)) {
      const element = fileInfos[key];

      new Promise((resolve, reject) => {
        fs.readFile(
          path.join(config.root, config.file_name),
          "utf8",
          (err, data) => {
            if (err) return reject(err);
            const subdir = config.root.replace(
              new RegExp(`${config.templates_dir}[/]?`),
              ""
            );

            //컴파일 될 파일 이름
            const new_filename = config.file_name.replace(
              "===",
              _.camelCase(element.className)
            );

            const target_file = path.resolve(
              config.target_dir,
              subdir,
              new_filename
            );

            const template = Handlebars.compile(data.toString());

            const content = template({
              openbrace: "{",
              closebrace: "}",
              classValidatorList: element.classValidatorList,
              importRequestDto: element.importRequestDto,
              className: element.className,
              variableList: element.variableList,
            });

            fs.writeFile(target_file, content, "utf8", (err) => {
              if (err) return reject(err);
              resolve();
            });
          }
        );
      });
    }
  }
}

/**
 * @author Ryan
 * @description 나머지 파일 생성
 * @param {*} config
 */
function generateFile(config) {
  new Promise((resolve, reject) => {
    const templates_dir = config.templates_dir;
    const target_dir = config.target_dir;
    const file_name = config.file_name;
    const root = config.root;
    const data = config.projectStructure;
    const swaggerInfo = config.swaggerInfo;
    const moduleOptions = config.moduleOptions;

    if (file_name === "app.module.ts") {
      new Promise((resolve, reject) => {
        fs.readFile(path.join(root, file_name), "utf8", (err, content) => {
          if (err) return reject(err);

          const template = Handlebars.compile(content);

          const parsed_content = template({
            openbrace: "{",
            closebrace: "}",
            modules: data.modules,
          });

          const template_path = path.relative(
            templates_dir,
            path.resolve(root, file_name)
          );
          const generated_path = path.resolve(target_dir, template_path);

          fs.writeFile(generated_path, parsed_content, "utf8", (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    } else if (file_name === "swagger.ts" || file_name === "README.md") {
      new Promise((resolve, reject) => {
        fs.readFile(path.join(root, file_name), "utf8", (err, content) => {
          if (err) return reject(err);

          const template = Handlebars.compile(content);

          const parsed_content = template({
            openbrace: "{",
            closebrace: "}",
            swagger: swaggerInfo,
          });

          const template_path = path.relative(
            templates_dir,
            path.resolve(root, file_name)
          );
          const generated_path = path.resolve(target_dir, template_path);

          fs.writeFile(generated_path, parsed_content, "utf8", (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    } else if (
      file_name === "package.json" ||
      file_name === "package-lock.json" ||
      file_name === ".env.local"
    ) {
      new Promise((resolve, reject) => {
        fs.readFile(path.join(root, file_name), "utf8", (err, content) => {
          if (err) return reject(err);

          const template = Handlebars.compile(content);

          const parsed_content = template({
            openbrace: "{",
            closebrace: "}",
            moduleOptions,
          });

          const template_path = path.relative(
            templates_dir,
            path.resolve(root, file_name)
          );
          const generated_path = path.resolve(target_dir, template_path);

          fs.writeFile(generated_path, parsed_content, "utf8", (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    } else {
      fs.readFile(path.resolve(root, file_name), "utf8", (err, content) => {
        if (err) return reject(err);
        try {
          const template = Handlebars.compile(content);
          const parsed_content = template(data);
          const template_path = path.relative(
            templates_dir,
            path.resolve(root, file_name)
          );
          const generated_path = path.resolve(target_dir, template_path);
          fs.writeFile(generated_path, parsed_content, "utf8", (err) => {
            if (err) return reject(err);
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  });
}

/**
 * @author Ryan
 * @description databases 파일 생성
 *
 * @param {@} config
 */
function databasesGenerateFile(config) {
  const templates_dir = config.templates_dir;
  const target_dir = config.target_dir;
  const file_name = config.file_name;
  const root = config.root;
  const moduleOptions = config.moduleOptions;

  new Promise((resolve, reject) => {
    if (moduleOptions.database === "not") {
      xfs.removeSync(target_dir + "/src/databases");
      moduleOptions.database = "clear";
      resolve();

      return;
    } else if (
      moduleOptions.database !== "not" &&
      moduleOptions.database !== "clear"
    ) {
      fs.readFile(path.join(root, file_name), "utf8", (err, data) => {
        if (err) return reject(err);
        const subdir = root.replace(new RegExp(`${templates_dir}[/]?`), "");

        //컴파일 될 파일 이름
        const new_filename = file_name.replace(
          "database",
          _.kebabCase(moduleOptions.database)
        );

        const target_file = path.resolve(target_dir, subdir, new_filename);

        const template = Handlebars.compile(data);

        moduleOptions.variableType = setPascalCase(moduleOptions.database);

        const content = template({
          openbrace: "{",
          closebrace: "}",
          moduleOptions,
        });

        fs.writeFile(target_file, content, "utf8", (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  });
}

/**
 * @author Ryan
 * @description kafka 파일 생성
 *
 * @param {@} config
 */
function kafkaGenerateFile(config) {
  const templates_dir = config.templates_dir;
  const target_dir = config.target_dir;
  const file_name = config.file_name;
  const root = config.root;
  const moduleOptions = config.moduleOptions;

  new Promise((resolve, reject) => {
    if (!moduleOptions.kafka) {
      //Kafka 디렉토리 삭제
      xfs.removeSync(target_dir + "/src/kafka");
      moduleOptions.kafka = "clear";
      resolve();

      return;
    } else if (moduleOptions.kafka.producer && moduleOptions.kafka.consumer) {
      fs.readFile(path.join(root, file_name), "utf8", (err, data) => {
        if (err) return reject(err);

        const template = Handlebars.compile(data);

        const content = template({
          openbrace: "{",
          closebrace: "}",
          moduleOptions,
        });

        const template_path = path.relative(
          templates_dir,
          path.resolve(root, file_name)
        );
        const generated_path = path.resolve(target_dir, template_path);

        fs.writeFile(generated_path, content, "utf8", (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } else if (moduleOptions.kafka.producer) {
      fs.readFile(path.join(root, file_name), "utf8", (err, data) => {
        if (err) return reject(err);

        const template = Handlebars.compile(data);

        const content = template({
          openbrace: "{",
          closebrace: "}",
          moduleOptions,
        });

        const template_path = path.relative(
          templates_dir,
          path.resolve(root, file_name)
        );

        const generated_path = path.resolve(target_dir, template_path);

        fs.writeFileSync(generated_path, content, "utf8");

        if (template_path === "src/kafka/consumer.service.ts") {
          //컨슈머 파일 삭제
          fs.unlinkSync(generated_path);
        }

        resolve();
      });
    } else if (moduleOptions.kafka.consumer) {
      fs.readFile(path.join(root, file_name), "utf8", (err, data) => {
        if (err) return reject(err);

        const template = Handlebars.compile(data);

        const content = template({
          openbrace: "{",
          closebrace: "}",
          moduleOptions,
        });

        const template_path = path.relative(
          templates_dir,
          path.resolve(root, file_name)
        );

        const generated_path = path.resolve(target_dir, template_path);

        fs.writeFileSync(generated_path, content, "utf8");

        if (template_path === "src/kafka/producer.service.ts") {
          //프로듀서 파일 삭제
          fs.unlinkSync(generated_path);
        }

        resolve();
      });
    }
  });
}

module.exports = {
  domainGenerateFiles,
  dtoGenerateFile,
  dataGenerateFile,
  generateFile,
  databasesGenerateFile,
  kafkaGenerateFile,
};

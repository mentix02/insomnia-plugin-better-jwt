// For help writing plugins, visit the documentation to get started:
//   https://docs.insomnia.rest/insomnia/introduction-to-plugins

const jwt = require("jwt-simple");

/**
 * @typedef {Object} TemplateTagArgOption
 * @property {string} displayName - The name shown in the dropdown
 * @property {string} value - The value of the option
 */

/**
 * @typedef {Function} RunFunction
 * @description Insomnia required entry function
 * @param {Object} context - The context of the template tag (provided by Insomnia)
 * @param {...string} args - The arguments passed to the template tag
 * @returns {Promise<string>} - The result of the template tag
 */

/**
 * @typedef {Object} TemplateTagArg
 * @property {"string" | "enum"} type - The type of the argument
 * @property {string} displayName - The name shown in the dropdown
 * @property {string} description - The description shown in the dropdown
 * @property {string} defaultValue - The default value of the argument
 * @property {string} [placeholder] - The placeholder value of the argument
 * @property {TemplateTagArgOption[]} [options] - The non-required options for the argument
 */

/**
 * @typedef {Object} TemplateTag
 * @property {string} name - The unique name of the template tag
 * @property {string} displayName - The name shown in the dropdown
 * @property {string} description - The description shown in the dropdown
 * @property {TemplateTagArg[]} args - The arguments the template tag accepts
 * @property {RunFunction} run - Insomnia entry point
 */

/**
 * @type {TemplateTag}
 */
const betterJWTTag = {
  name: "bjwt",
  displayName: "Better JWT",
  description: "Generate JWT tokens with ease",
  args: [
    {
      type: "enum",
      defaultValue: "HS256",
      displayName: "Algorithm",
      description: "The algorithm to use",
      options: [
        { displayName: "HS256", value: "HS256" },
        { displayName: "HS384", value: "HS384" },
        { displayName: "HS512", value: "HS512" },
      ],
    },
    {
      type: "string",
      defaultValue: "{}",
      displayName: "payload",
      description: "The payload to encode",
      placeholder: '{"sub": "1234", "userId": "user_1234"}',
    },
    {
      type: "string",
      defaultValue: "",
      displayName: "Secret",
      placeholder: "*********",
      description: "The key to use for encoding",
    },
  ],
  async run(context, algorithm, payload, secret) {
    // try to parse the payload
    let obj;

    try {
      obj = JSON.parse(payload);
    } catch (e) {
      return String(e.message);
    }

    // Check if algorithm is supported
    switch (algorithm) {
      case "HS256":
      case "HS384":
      case "HS512":
        break;
      default:
        return "Invalid algorithm";
    }

    return jwt.encode(obj, secret, algorithm);
  },
};

module.exports.templateTags = [betterJWTTag];

const winston = require('winston');
const { format, transports } = winston;

// const logger = winston.createLogger({
//   // format: format.combine(
//   //   format.metadata({ fillExcept: ["message", "level"] }),
//   // ),
//   transports: [
//     new transports.Console({
//       silent: (process.env.NODE_ENV === 'production'),
//       format: format.prettyPrint(),
//       // format: format.combine(
//       //   format.colorize({ all: true }),
//       //   format.prettyPrint(),
//       //   // format.printf(({ level, message, metadata }) => {
//       //   //   const metadataObject = JSON.stringify(metadata, null, 2);
//       //   //   return `${''/*this.label*/}[${level}]: ${message} ${metadataObject}`;
//       //   // }),
//       // ),
//       // new winston.transports.File({ filename: 'combined.log' })
//     }),
//   ],
// });

const logger = console;

module.exports = logger;

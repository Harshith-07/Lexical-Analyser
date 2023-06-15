
const input = '#include<iostream>';
console.log(input);

const keywords = ["int", "double", "float", "char", "if", "else", "while", "for", "do", "switch", "case", "break"];

// Regular expressions for common patterns
const digitRegex = /\d/;
const alphaRegex = /[a-zA-Z]/;
const identifierRegex = /[a-zA-Z_]\w* /;

// Token types
const TokenType = {
  IDENTIFIER: "IDENTIFIER",
  KEYWORD: "KEYWORD",
  NUMBER: "NUMBER",
  OPERATOR: "OPERATOR",
  PUNCTUATION: "PUNCTUATION",
  STRING: "STRING"
};

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

function tokenize(code) {
  const tokens = [];
  let currentToken = "";

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1];

    if (char === "/") {
      if (nextChar === "/") {
        // Single-line comment, skip to end of line
        i++;
        while (code[i] !== "\n" && i < code.length - 1) {
          i++;
        }
        continue;
      } else if (nextChar === "*") {
        // Multi-line comment, skip until end of comment
        i += 2;
        while (!(code[i] === "*" && code[i + 1] === "/") && i < code.length - 1) {
          i++;
        }
        i += 2; // Skip past end of comment
        continue;
      }
    }

    if (char === "#") {
      // Preprocessor directive
      currentToken += char;
      while (nextChar && !nextChar.match(/\s/)) {
        currentToken += nextChar;
        i++;
      }
      tokens.push(new Token(TokenType.PUNCTUATION, currentToken));
      currentToken = "";
      continue;
    }

    if (char.match(digitRegex)) {
      // Number literal
      currentToken += char;
      if (!nextChar || !nextChar.match(digitRegex)) {
        tokens.push(new Token(TokenType.NUMBER, currentToken));
        currentToken = "";
      }
    } else if (char.match(alphaRegex)) {
      // Identifier or keyword
      currentToken += char;
      if (!nextChar || !nextChar.match(/\w/)) {
        if (keywords.includes(currentToken)) {
          tokens.push(new Token(TokenType.KEYWORD, currentToken));
        } else {
          tokens.push(new Token(TokenType.IDENTIFIER, currentToken));
        }
        currentToken = "";
      }
    } else if (char === "\"" || char === "'") {
      // String literal
      let string = char;
      i++;
      while (code[i] !== char && i < code.length - 1) {
        string += code[i];
        i++;
      }
      string += char;
      tokens.push(new Token(TokenType.STRING, string));
    } else if (char.match(/\s/)) {
      // Whitespace, ignore
      continue;
    } else if (char.match(/[\+\-\*\/=&\|><!%]/)) {
      // Operator
      currentToken += char;
      if (char === "=" && nextChar === "=") {
        currentToken += nextChar;
        i++;
      }
      tokens.push(new Token(TokenType.OPERATOR, currentToken));
      currentToken = "";
    } else if (char.match(/[\(\)\{\}\[\];,:]/)) {
      // Punctuation
      tokens.push(new Token(TokenType.PUNCTUATION, char));
    } else {
      throw new Error(`Unexpected character: ${char}`);
    }
  }

  return tokens;
}


console.log(tokenize(input));


/*function insertDataIntoTable(form, o_identifiers, o_keywords, o_numbers, o_operators, o_punctuations, o_strings) {

  connection.connect(function(error) {
    if (error) {
      console.error('Error connecting to the database: ' + error.stack);
      return;
    }

    console.log('Connected to the database with ID ' + connection.threadId);
  });

  //if (err) throw err;
  //console.log('Connected to MySQL database!');

  // perform a query to insert data into the database
  //const to_identifiers = o_identifiers;
  //const to_keywords = o_keywords;
  //const to_numbers = o_numbers;
  //const to_operators = o_operators;
  //const to_punctuations = o_punctuations;
  //const to_strings = o_strings;
  //const to_code = form;

  //const sql = `INSERT INTO token_table (identifiers, keywords, numbers, operators, punctuations, strings, date_and_time) VALUES (`${to_identifiers.join(',')}`, `${to_keywords.join(',')}`, `${to_numbers.join(',')}`, `${to_operators.join(',')}`, `${to_punctuations.join(',')}`, `${to_strings.join(',')}`, current_timestamp());`;
  //const values = [to_code.join(',') ,to_identifiers.join(','), to_keywords.join(','), to_numbers.join(','), to_operators.join(','), to_punctuations.join(','), to_strings.join(','), current_timestamp()];

  const sql = `INSERT INTO token_table (code, identifiers, keywords, numbers, operators, punctuations, strings, date_and_time) VALUES ('${form}', '${o_identifiers.join(',')}', '${o_keywords.join(',')}', '${o_numbers.join(',')}', '${o_operators.join(',')}', '${o_punctuations.join(',')}', '${o_strings.join(',')}', current_timestamp());`;

  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Data inserted into table!');


    // disconnect from the database
    connection.end(function(err) {
      if (err) throw err;
      console.log('Disconnected from MySQL database!');
    });
  });




}*/

if (char === "#" && nextChar === "include") {
  // Header file
  i += 8; // Skip "#include<"
  let headerFile = "";
  while (code[i] !== ">" && i < code.length - 1) {
    headerFile += code[i];
    i++;
  }
  tokens.push(new Token(TokenType.STRING, `#include<${headerFile}>`));
  i++; // Skip ">"
  continue;
}

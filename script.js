// // CurrencyFormatter class using clean code principles.
// class CurrencyFormatter {
//   constructor() {
//     this.UNIT_MAP = {
//       one: 1,
//       two: 2,
//       three: 3,
//       four: 4,
//       five: 5,
//       six: 6,
//       seven: 7,
//       eight: 8,
//       nine: 9,
//       ten: 10,
//       eleven: 11,
//       twelve: 12,
//       thirteen: 13,
//       fourteen: 14,
//       fifteen: 15,
//       sixteen: 16,
//       seventeen: 17,
//       eighteen: 18,
//       nineteen: 19,
//     };

//     this.TENS_MAP = {
//       twenty: 20,
//       thirty: 30,
//       forty: 40,
//       fifty: 50,
//       sixty: 60,
//       seventy: 70,
//       eighty: 80,
//       ninety: 90,
//     };

//     this.MULTIPLIER_MAP = {
//       hundred: 100,
//       thousand: 1000,
//       lakh: 100000,
//       crore: 10000000,
//       million: 1000000,
//       billion: 1000000000,
//       trillion: 1000000000000,
//     };

//     this.ALL_WORDS = new Set([
//       ...Object.keys(this.UNIT_MAP),
//       ...Object.keys(this.TENS_MAP),
//       ...Object.keys(this.MULTIPLIER_MAP),
//       "paise",
//       "and",
//     ]);
//   }

//   // Separates concatenated words if they match valid currency-related words.
//   separateWords(input) {
//     let result = "";
//     let i = 0;
//     const maxLen = 20;

//     while (i < input.length) {
//       let foundMatch = false;
//       for (let len = Math.min(maxLen, input.length - i); len > 0; len--) {
//         const potentialWord = input.substring(i, i + len);
//         if (this.ALL_WORDS.has(potentialWord)) {
//           result += potentialWord + " ";
//           i += len;
//           foundMatch = true;
//           break;
//         }
//       }
//       if (!foundMatch) {
//         i++;
//       }
//     }
//     return result.trim();
//   }

//   // Converts a currency amount written in words to a numeric value.
//   convertWordsToCurrency(inputText) {
//     if (!inputText) {
//       throw new Error("Input cannot be empty");
//     }

//     let text = inputText
//       .toLowerCase()
//       .replace(/\bonly\b/gi, "")
//       .trim();
//     text = this.separateWords(text);

//     const words = text.split(/\s+/);
//     let totalAmount = 0,
//       currentNumber = 0,
//       paiseAmount = 0;
//     let isPaiseMode = false;
//     let hasNumber = false;

//     for (const word of words) {
//       if (word === "paise") {
//         if (isPaiseMode || !hasNumber) {
//           throw new Error("Invalid input: Incorrect 'paise' usage");
//         }
//         isPaiseMode = true;
//         paiseAmount = currentNumber;
//         currentNumber = 0;
//         continue;
//       }

//       if (this.UNIT_MAP.hasOwnProperty(word)) {
//         currentNumber += this.UNIT_MAP[word];
//         hasNumber = true;
//       } else if (this.TENS_MAP.hasOwnProperty(word)) {
//         currentNumber += this.TENS_MAP[word];
//         hasNumber = true;
//       } else if (this.MULTIPLIER_MAP.hasOwnProperty(word)) {
//         if (currentNumber === 0) {
//           currentNumber = 1;
//         }
//         currentNumber *= this.MULTIPLIER_MAP[word];
//         totalAmount += currentNumber;
//         currentNumber = 0;
//       } else if (word !== "and") {
//         throw new Error(`Invalid word in input: ${word}`);
//       }
//     }

//     if (!hasNumber) {
//       throw new Error("Invalid input: No recognizable numbers found");
//     }

//     totalAmount += currentNumber;
//     return totalAmount + paiseAmount / 100;
//   }
// }

// // IndexedDBManager for client-side storage using IndexedDB.
// class IndexedDBManager {
//   constructor(dbName = "CurrencyConverterDB", storeName = "conversionHistory") {
//     this.dbName = dbName;
//     this.storeName = storeName;
//     this.db = null;
//   }

//   // Initialize the database and object store.
//   initDB() {
//     return new Promise((resolve, reject) => {
//       const request = window.indexedDB.open(this.dbName, 1);

//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         if (!db.objectStoreNames.contains(this.storeName)) {
//           db.createObjectStore(this.storeName, {
//             keyPath: "id",
//             autoIncrement: true,
//           });
//         }
//       };

//       request.onsuccess = (event) => {
//         this.db = event.target.result;
//         resolve();
//       };

//       request.onerror = (event) => {
//         console.error("IndexedDB error:", event.target.error);
//         reject(event.target.error);
//       };
//     });
//   }

//   // Add a record to the IndexedDB store.
//   addRecord(record) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readwrite");
//       const store = transaction.objectStore(this.storeName);
//       const request = store.add(record);

//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(request.error);
//     });
//   }

//   // Retrieve all records from the IndexedDB store.
//   getRecords() {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readonly");
//       const store = transaction.objectStore(this.storeName);
//       const records = [];
//       const cursorRequest = store.openCursor();

//       cursorRequest.onsuccess = (event) => {
//         const cursor = event.target.result;
//         if (cursor) {
//           records.push(cursor.value);
//           cursor.continue();
//         } else {
//           resolve(records);
//         }
//       };

//       cursorRequest.onerror = (event) => reject(event.target.error);
//     });
//   }

//   // Clear all records from the IndexedDB store.
//   clearRecords() {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readwrite");
//       const store = transaction.objectStore(this.storeName);
//       const request = store.clear();

//       request.onsuccess = () => resolve();
//       request.onerror = (event) => reject(event.target.error);
//     });
//   }
// }

// // DOM Elements
// const form = document.getElementById("conversionForm");
// const inputField = document.getElementById("currencyInput");
// const resultDiv = document.getElementById("result");
// const historyTableBody = document.querySelector("#historyTable tbody");
// const clearHistoryButton = document.getElementById("clearHistory");

// // Create instances of CurrencyFormatter and IndexedDBManager.
// const formatter = new CurrencyFormatter();
// const dbManager = new IndexedDBManager();

// // Helper function to update the history table in the UI.
// async function updateHistoryTable() {
//   try {
//     const records = await dbManager.getRecords();
//     historyTableBody.innerHTML = "";
//     records.forEach((record) => {
//       const row = document.createElement("tr");
//       const timestampCell = document.createElement("td");
//       const inputCell = document.createElement("td");
//       const outputCell = document.createElement("td");

//       timestampCell.textContent = record.timestamp;
//       inputCell.textContent = record.input;
//       outputCell.textContent = record.output;

//       row.append(timestampCell, inputCell, outputCell);
//       historyTableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//   }
// }

// // Initialize the database and set up event listeners.
// dbManager
//   .initDB()
//   .then(() => {
//     // Update history table after DB is ready.
//     updateHistoryTable();

//     // Handle form submission.
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const userInput = inputField.value.trim();
//       try {
//         const numericValue = formatter.convertWordsToCurrency(userInput);
//         const formattedValue = numericValue.toFixed(2);
//         resultDiv.textContent = `Converted Value: ${formattedValue}`;

//         // Record the conversion with timestamp.
//         const record = {
//           timestamp: new Date().toLocaleString(),
//           input: userInput,
//           output: formattedValue,
//         };
//         await dbManager.addRecord(record);
//         updateHistoryTable();
//       } catch (error) {
//         resultDiv.textContent = `Error: ${error.message}`;
//       }
//       inputField.value = "";
//     });

//     // Handle clear history action.
//     clearHistoryButton.addEventListener("click", async () => {
//       try {
//         await dbManager.clearRecords();
//         updateHistoryTable();
//       } catch (error) {
//         console.error("Error clearing history:", error);
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to initialize database:", error);
//   });

// CurrencyFormatter class using clean code principles.
// CurrencyFormatter class using clean code principles and Java‐like logic.
// class CurrencyFormatter {
//   constructor() {
//     this.UNIT_MAP = {
//       one: 1,
//       two: 2,
//       three: 3,
//       four: 4,
//       five: 5,
//       six: 6,
//       seven: 7,
//       eight: 8,
//       nine: 9,
//       ten: 10,
//       eleven: 11,
//       twelve: 12,
//       thirteen: 13,
//       fourteen: 14,
//       fifteen: 15,
//       sixteen: 16,
//       seventeen: 17,
//       eighteen: 18,
//       nineteen: 19,
//     };

//     this.TENS_MAP = {
//       twenty: 20,
//       thirty: 30,
//       forty: 40,
//       fifty: 50,
//       sixty: 60,
//       seventy: 70,
//       eighty: 80,
//       ninety: 90,
//     };

//     this.MULTIPLIER_MAP = {
//       hundred: 100,
//       thousand: 1000,
//       lakh: 100000,
//       crore: 10000000,
//       million: 1000000,
//       billion: 1000000000,
//       trillion: 1000000000000,
//     };

//     // Collect all valid words.
//     this.ALL_WORDS = new Set([
//       ...Object.keys(this.UNIT_MAP),
//       ...Object.keys(this.TENS_MAP),
//       ...Object.keys(this.MULTIPLIER_MAP),
//       "paise",
//       "and",
//     ]);
//   }

//   // Separates concatenated words if they match valid currency-related words.
//   separateWords(input) {
//     let result = "";
//     let i = 0;
//     const maxLen = 20;

//     while (i < input.length) {
//       let foundMatch = false;
//       // Try to find the longest matching word starting at current position.
//       for (let len = Math.min(maxLen, input.length - i); len > 0; len--) {
//         const potentialWord = input.substring(i, i + len);
//         if (this.ALL_WORDS.has(potentialWord)) {
//           result += potentialWord + " ";
//           i += len;
//           foundMatch = true;
//           break;
//         }
//       }
//       if (!foundMatch) {
//         i++;
//       }
//     }
//     return result.trim();
//   }

//   // Parses an array of tokens into a numeric value using the Java‐like logic.
//   parseTokens(tokens) {
//     let totalAmount = 0,
//       currentNumber = 0,
//       hasNumber = false;
//     for (const token of tokens) {
//       if (this.UNIT_MAP.hasOwnProperty(token)) {
//         currentNumber += this.UNIT_MAP[token];
//         hasNumber = true;
//       } else if (this.TENS_MAP.hasOwnProperty(token)) {
//         currentNumber += this.TENS_MAP[token];
//         hasNumber = true;
//       } else if (this.MULTIPLIER_MAP.hasOwnProperty(token)) {
//         if (currentNumber === 0) {
//           currentNumber = 1;
//         }
//         currentNumber *= this.MULTIPLIER_MAP[token];
//         totalAmount += currentNumber;
//         currentNumber = 0;
//       } else if (token !== "and") {
//         throw new Error("Invalid word in input: " + token);
//       }
//     }
//     totalAmount += currentNumber;
//     if (!hasNumber) {
//       throw new Error("Invalid input: No recognizable numbers found");
//     }
//     return totalAmount;
//   }

//   // Converts a currency amount written in words to its numeric value.
//   convertWordsToCurrency(inputText) {
//     if (!inputText) {
//       throw new Error("Input cannot be empty");
//     }

//     // Clean input text.
//     let text = inputText
//       .toLowerCase()
//       .replace(/\bonly\b/gi, "")
//       .trim();
//     text = this.separateWords(text);
//     const words = text.split(/\s+/);

//     let rupees = 0,
//       paise = 0;
//     const paiseIndex = words.indexOf("paise");

//     if (paiseIndex !== -1) {
//       // Assume the token immediately before "paise" (ignoring "and") is the paise amount.
//       let candidateIndex = paiseIndex - 1;
//       while (candidateIndex >= 0 && words[candidateIndex] === "and") {
//         candidateIndex--;
//       }
//       if (candidateIndex < 0) {
//         throw new Error("Invalid input: No value specified for paise");
//       }
//       const paiseTokens = [words[candidateIndex]];

//       // The rupees part consists of all tokens before the candidate paise token.
//       let rupeesTokens = words.slice(0, candidateIndex);
//       // Remove trailing "and" tokens from rupeesTokens.
//       while (
//         rupeesTokens.length > 0 &&
//         rupeesTokens[rupeesTokens.length - 1] === "and"
//       ) {
//         rupeesTokens.pop();
//       }
//       rupees = this.parseTokens(rupeesTokens);
//       paise = this.parseTokens(paiseTokens);
//     } else {
//       rupees = this.parseTokens(words);
//     }
//     return rupees + paise / 100.0;
//   }
// }

// // IndexedDBManager for client-side storage using IndexedDB.
// class IndexedDBManager {
//   constructor(dbName = "CurrencyConverterDB", storeName = "conversionHistory") {
//     this.dbName = dbName;
//     this.storeName = storeName;
//     this.db = null;
//   }

//   // Initialize the database and object store.
//   initDB() {
//     return new Promise((resolve, reject) => {
//       const request = window.indexedDB.open(this.dbName, 1);

//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         if (!db.objectStoreNames.contains(this.storeName)) {
//           db.createObjectStore(this.storeName, {
//             keyPath: "id",
//             autoIncrement: true,
//           });
//         }
//       };

//       request.onsuccess = (event) => {
//         this.db = event.target.result;
//         resolve();
//       };

//       request.onerror = (event) => {
//         console.error("IndexedDB error:", event.target.error);
//         reject(event.target.error);
//       };
//     });
//   }

//   // Add a record to the IndexedDB store.
//   addRecord(record) {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readwrite");
//       const store = transaction.objectStore(this.storeName);
//       const request = store.add(record);

//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject(request.error);
//     });
//   }

//   // Retrieve all records from the IndexedDB store.
//   getRecords() {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readonly");
//       const store = transaction.objectStore(this.storeName);
//       const records = [];
//       const cursorRequest = store.openCursor();

//       cursorRequest.onsuccess = (event) => {
//         const cursor = event.target.result;
//         if (cursor) {
//           records.push(cursor.value);
//           cursor.continue();
//         } else {
//           resolve(records);
//         }
//       };

//       cursorRequest.onerror = (event) => reject(event.target.error);
//     });
//   }

//   // Clear all records from the IndexedDB store.
//   clearRecords() {
//     return new Promise((resolve, reject) => {
//       const transaction = this.db.transaction(this.storeName, "readwrite");
//       const store = transaction.objectStore(this.storeName);
//       const request = store.clear();

//       request.onsuccess = () => resolve();
//       request.onerror = (event) => reject(event.target.error);
//     });
//   }
// }

// // DOM Elements
// const form = document.getElementById("conversionForm");
// const inputField = document.getElementById("currencyInput");
// const resultDiv = document.getElementById("result");
// const historyTableBody = document.querySelector("#historyTable tbody");
// const clearHistoryButton = document.getElementById("clearHistory");

// // Create instances of CurrencyFormatter and IndexedDBManager.
// const formatter = new CurrencyFormatter();
// const dbManager = new IndexedDBManager();

// // Helper function to update the history table in the UI.
// async function updateHistoryTable() {
//   try {
//     const records = await dbManager.getRecords();
//     historyTableBody.innerHTML = "";
//     records.forEach((record) => {
//       const row = document.createElement("tr");
//       const timestampCell = document.createElement("td");
//       const inputCell = document.createElement("td");
//       const outputCell = document.createElement("td");

//       timestampCell.textContent = record.timestamp;
//       inputCell.textContent = record.input;
//       outputCell.textContent = record.output;

//       row.append(timestampCell, inputCell, outputCell);
//       historyTableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//   }
// }

// // Initialize the database and set up event listeners.
// dbManager
//   .initDB()
//   .then(() => {
//     // Update history table after DB is ready.
//     updateHistoryTable();

//     // Handle form submission.
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const userInput = inputField.value.trim();
//       try {
//         const numericValue = formatter.convertWordsToCurrency(userInput);
//         const formattedValue = numericValue.toFixed(2);
//         resultDiv.textContent = `Converted Value: ${formattedValue}`;

//         // Record the conversion with a timestamp.
//         const record = {
//           timestamp: new Date().toLocaleString(),
//           input: userInput,
//           output: formattedValue,
//         };
//         await dbManager.addRecord(record);
//         updateHistoryTable();
//       } catch (error) {
//         resultDiv.textContent = `Error: ${error.message}`;
//       }
//       inputField.value = "";
//     });

//     // Handle clear history action.
//     clearHistoryButton.addEventListener("click", async () => {
//       try {
//         await dbManager.clearRecords();
//         updateHistoryTable();
//       } catch (error) {
//         console.error("Error clearing history:", error);
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to initialize database:", error);
//   });





class CurrencyFormatter {
  constructor() {
    this.UNIT_MAP = new Map([
      ["one", 1],
      ["two", 2],
      ["three", 3],
      ["four", 4],
      ["five", 5],
      ["six", 6],
      ["seven", 7],
      ["eight", 8],
      ["nine", 9],
      ["ten", 10],
      ["eleven", 11],
      ["twelve", 12],
      ["thirteen", 13],
      ["fourteen", 14],
      ["fifteen", 15],
      ["sixteen", 16],
      ["seventeen", 17],
      ["eighteen", 18],
      ["nineteen", 19],
    ]);

    this.TENS_MAP = new Map([
      ["twenty", 20],
      ["thirty", 30],
      ["forty", 40],
      ["fifty", 50],
      ["sixty", 60],
      ["seventy", 70],
      ["eighty", 80],
      ["ninety", 90],
    ]);

    this.MULTIPLIER_MAP = new Map([
      ["hundred", 100],
      ["thousand", 1000],
      ["lakh", 100000],
      ["crore", 10000000],
      ["million", 1000000],
      ["billion", 1000000000],
      ["trillion", 1000000000000],
    ]);

    this.ALL_WORDS = new Set([
      ...this.UNIT_MAP.keys(),
      ...this.TENS_MAP.keys(),
      ...this.MULTIPLIER_MAP.keys(),
      "paise",
      "and",
    ]);
  }

  separateWords(input) {
    let result = "";
    let i = 0;

    while (i < input.length) {
      let foundMatch = false;
      for (let len = Math.min(20, input.length - i); len > 0; len--) {
        const potentialWord = input.substring(i, i + len);
        if (this.ALL_WORDS.has(potentialWord)) {
          result += potentialWord + " ";
          i += len;
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        i++;
      }
    }
    return result.trim();
  }

  formatIndianNumberSystem(amount) {
    // Convert to string and split on decimal point
    const [wholePart, decimalPart] = amount.toFixed(2).split(".");

    // Format the whole part with Indian numbering system
    const wholePartStr = wholePart.toString();
    let result = "";

    // Special case for numbers less than 1000
    if (wholePartStr.length <= 3) {
      return `${wholePartStr}.${decimalPart}`;
    }

    // Get the last 3 digits
    result = wholePartStr.substring(wholePartStr.length - 3);

    // Process the rest of the digits in groups of 2
    let remaining = wholePartStr.substring(0, wholePartStr.length - 3);
    while (remaining.length > 0) {
      // Take last 2 digits (or 1 if only 1 is left)
      const group =
        remaining.length >= 2
          ? remaining.substring(remaining.length - 2)
          : remaining;
      result = group + "," + result;
      remaining = remaining.substring(0, remaining.length - group.length);
    }

    return `${result}.${decimalPart}`;
  }

  convertWordsToCurrency(inputText) {
    if (!inputText) {
      throw new Error("Input cannot be empty");
    }

    inputText = inputText
      .toLowerCase()
      .replace(/\bonly\b/gi, "")
      .trim();
    inputText = this.separateWords(inputText);

    const words = inputText.split(/\s+/);

    // Check for paise
    const paiseIndex = words.indexOf("paise");
    let mainWords = words;
    let paiseWords = [];

    if (paiseIndex !== -1) {
      mainWords = words.slice(0, paiseIndex);
      paiseWords = words.slice(0, paiseIndex); // Will process these separately
    }

    // Filter out "and"
    mainWords = mainWords.filter((word) => word !== "and");

    // Organize words into a more structured format
    const parts = [];
    let current = [];

    for (const word of mainWords) {
      if (this.MULTIPLIER_MAP.has(word)) {
        if (current.length === 0) {
          current.push("one");
        }
        current.push(word);
        parts.push(current);
        current = [];
      } else {
        current.push(word);
      }
    }

    if (current.length > 0) {
      parts.push(current);
    }

    // Process parts to get the numeric value
    let total = 0;

    for (const part of parts) {
      // If it ends with a multiplier, multiply and add
      if (part.length > 1 && this.MULTIPLIER_MAP.has(part[part.length - 1])) {
        const multiplier = this.MULTIPLIER_MAP.get(part[part.length - 1]);
        const valueBeforeMultiplier = this.processWordGroup(
          part.slice(0, part.length - 1)
        );
        total += valueBeforeMultiplier * multiplier;
      } else {
        // Otherwise, just add the value
        total += this.processWordGroup(part);
      }
    }

    // Process paise if present
    let paiseValue = 0;
    if (paiseIndex !== -1) {
      paiseValue = this.processWordGroup(paiseWords) / 100;
      return paiseValue;
    }

    return total;
  }

  processWordGroup(words) {
    let value = 0;
    for (const word of words) {
      if (this.UNIT_MAP.has(word)) {
        value += this.UNIT_MAP.get(word);
      } else if (this.TENS_MAP.has(word)) {
        value += this.TENS_MAP.get(word);
      }
      // Ignore multipliers as they are handled at a higher level
    }
    return value;
  }
}

// IndexedDBManager remains unchanged
class IndexedDBManager {
  constructor(dbName = "CurrencyConverterDB", storeName = "conversionHistory") {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  initDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  addRecord(record) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(record);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  getRecords() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const records = [];
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        } else {
          resolve(records);
        }
      };

      cursorRequest.onerror = (event) => reject(event.target.error);
    });
  }

  clearRecords() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

// DOM Elements
const form = document.getElementById("conversionForm");
const inputField = document.getElementById("currencyInput");
const resultDiv = document.getElementById("result");
const historyTableBody = document.querySelector("#historyTable tbody");
const clearHistoryButton = document.getElementById("clearHistory");

// Create instances of CurrencyFormatter and IndexedDBManager.
const formatter = new CurrencyFormatter();
const dbManager = new IndexedDBManager();

// Helper function to update the history table in the UI.
async function updateHistoryTable() {
  try {
    const records = await dbManager.getRecords();
    historyTableBody.innerHTML = "";
    records.forEach((record) => {
      const row = document.createElement("tr");
      const timestampCell = document.createElement("td");
      const inputCell = document.createElement("td");
      const outputCell = document.createElement("td");

      timestampCell.textContent = record.timestamp;
      inputCell.textContent = record.input;
      outputCell.textContent = record.output;

      row.append(timestampCell, inputCell, outputCell);
      historyTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching records:", error);
  }
}

// Initialize the database and set up event listeners.
dbManager
  .initDB()
  .then(() => {
    // Update history table after DB is ready.
    updateHistoryTable();

    // Handle form submission.
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userInput = inputField.value.trim();
      try {
        const numericValue = formatter.convertWordsToCurrency(userInput);
        const formattedValue = formatter.formatIndianNumberSystem(numericValue);
        resultDiv.textContent = `Converted Value: ${formattedValue}`;

        // Record the conversion with a timestamp.
        const record = {
          timestamp: new Date().toLocaleString(),
          input: userInput,
          output: formattedValue,
        };
        await dbManager.addRecord(record);
        updateHistoryTable();
      } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
      }
      inputField.value = "";
    });

    // Handle clear history action.
    clearHistoryButton.addEventListener("click", async () => {
      try {
        await dbManager.clearRecords();
        updateHistoryTable();
      } catch (error) {
        console.error("Error clearing history:", error);
      }
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
  });

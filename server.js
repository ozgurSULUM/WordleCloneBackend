import http from 'http';
import url from 'url';
import fs from 'fs';
import readline from 'readline';

const PORT_NUMBER = process.env.PORT || 5001;

//words array for storing words, inside words.txt there is only turkish words you can change it for your needs
const wordsArr = [];

//Copy paste code for reading words.txt file.
async function processLineByLine() {
    const fileStream = fs.createReadStream('words.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        wordsArr.push(line);
    }
}

processLineByLine();

//Random number generator function for random word pick.
function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


http.createServer((request, response) => {
    const q = url.parse(request.url, true);
    if (request.method === 'GET') {
        if (q.pathname === '/getword') {
            const word = { random_word: '' };
            const random_word_index = getRandomNumberBetween(0, wordsArr.length);
            word.random_word = wordsArr[random_word_index];
            console.log(word);
            response.writeHead(200, 'New word created.',
                {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                    "Access-Control-Max-Age": 2592000,
                })
                .end(JSON.stringify(word));
            return;
        }
        else if (q.pathname === '/checkword') {
            let find_word = q.query.word;
            console.log(find_word);
            for (let quessed_word of wordsArr) {
                if (find_word === quessed_word) {
                    console.log('This word exist in dict.');
                    response.writeHead(200, 'This word exist in dict.',
                        {
                            'Content-Type': 'application/json',
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                            "Access-Control-Max-Age": 2592000,
                        })
                        .end(JSON.stringify({ exists: true }));
                    return;
                }

            }
            console.log('This word does not exist in dict.');
            response.writeHead(200, 'This word does not exist in dict.',
                {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                    "Access-Control-Max-Age": 2592000,
                })
                .end(JSON.stringify({ exists: false }));
            return;

        }

    }
    else if (request.method === 'POST') {

    }
}).listen(PORT_NUMBER);
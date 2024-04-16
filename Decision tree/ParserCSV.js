function parseCSVtoMatrix(strCSV) {
    let buff = parseCSVtoArray(strCSV); // Parse CSV string into an array
    return transArryToMat(buff); // Transform the array into a matrix
}

function parseCSVtoArray(strCSV) {
    try {
        let data = []; // Array to store the parsed values
        let regex = /("([^"]|"")*"|([^",\r\n]*))?(,|\r\n)?/; // Regular expression to match CSV elements
        let size = 0; // Variable to store the size of each row
        let check = false; // Variable to check if size has been determined

        // Loop through the CSV string and match elements using regex
        while (regex.test) {
            let buff = regex.exec(strCSV);

            // If the matched element is an empty string, break the loop
            if (buff[0] === "") {
                break;
            }

            let current = buff[1];

            // If the matched element starts with a double quote, remove the quotes
            if (buff[1][0] === '"') {
                current = "";
                for (let i = 1; i < buff[1].length - 1; i++) {
                    current += buff[1][i];
                }
            }

            data[data.length] = current;

            // Check if the row delimiter is encountered and determine the size of each row
            if ((!check) && (buff[4] === '\r\n')) {
                check = true;
                size++;
            } else {
                if (!check) {
                    size++;
                }
            }

            strCSV = strCSV.replace(regex, ""); // Remove the matched element from the CSV string
        }

        data[data.length] = size; // Store the row size at the end of the data array
        return data; // Return the data array containing parsed values and row size
    }
    catch {
        alert("Your test is incorrect"); // Alert an error message if an exception occurs
        return;
    }
}

function transArryToMat(array) {
    let matrix = []; // Matrix to store the transformed data
    let count = 0;

    // Loop through the array and convert it into a matrix
    for (let i = 0; i < (array.length - 1) / array[array.length - 1]; i++) {
        matrix[i] = [];
        for (let j = 0; j < array[array.length - 1]; j++) {
            matrix[i][j] = array[count];
            count++;
        }
    }

    return matrix; // Return the transformed matrix
}
// Add event listener for file input change
document.getElementById('file_input').addEventListener('change', async (event) => {
    const file = event.target.files[0];

    try {
        const data = await parseCSV(file);
        console.log(data); // This will log the parsed CSV data to the console
        // Now you can use the parsed data to build your decision tree or perform other operations
        buildTree(data); // Example: Build decision tree using the parsed data
    } catch (error) {
        console.error(error.message); // Log any errors that occur during parsing
    }
});

// Function to parse the CSV file
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const lines = reader.result.split('\n');
            const data = [];

            // Parse each line
            lines.forEach(line => {
                const values = line.trim().split(',');

                // Skip empty lines
                if (values.length === 0 || values.every(val => val === '')) {
                    return;
                }

                data.push(values);
            });

            resolve(data);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read the file'));
        };

        reader.readAsText(file);
    });
}
function parseCSVFile(csvContent) {
    // Split the CSV content into rows
    const rows = csvContent.trim().split('\n');

    // Initialize the data array to store the parsed CSV data
    let data = [];

    // Iterate over each row
    for (let i = 0; i < rows.length; i++) {
        // Split each row into columns
        const columns = rows[i].split(',');

        // Add the columns to the data array
        data.push(columns);
    }

    // Return the parsed CSV data
    return data;
}
function createTree() {
    // Remove the existing tree
    treeRoot = removeTree();

    // Check if a file is selected
    if (FILE.value === '') {
        // If no file is selected, build the tree with default data
        buildTree(getData(3));
        drawTree(root, treeRoot);
    } else {
        // If a file is selected, read its contents
        let file = FILE.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            // Parse the CSV data into a matrix
            let csvContent = reader.result;
            let parsedData = parseCSVFile(csvContent);

            // Build the tree with the parsed data
            buildTree(parsedData);
            drawTree(root, treeRoot);
        }
    }
    flag = true;
}

